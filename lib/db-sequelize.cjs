const debug = require('debug')('marlin-db')
const VError = require('verror').VError
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const admin = require('./admin.cjs')
const _ = require('lodash')
const async = require('async')

const EventEmitter = require('events')

// instantiate sequelize
// load models
// setup hooks to emit emit events for create, delete and update

class dbHandler extends EventEmitter {
	constructor (app, options) {
		debug('dbHandler create')

		super()
		this.app = app
		this.options = options.dbOptions
		this.adminOptions = options.adminOptions

		this.modelDefs = []

		this.sequelize = new Sequelize(options.dbOptions)

		const modelDirs = [path.join(__dirname, '../', 'models')]

		// application models directory set in options
		if (this.options.models) {
			modelDirs.push(this.options.models)
		}

		// load models in models directorys
		modelDirs.map((dir) => {
			debug('dbHandler loding models in ' + dir)
			fs
				.readdirSync(dir)
				.filter(file => {
					return (file.indexOf('.') !== 0) && (file.slice(-4) === '.cjs')
				})
				.forEach(file => {
					let modelDef = require(path.join(dir, file))
					if (modelDef.extend && modelDef.define) {
						if (options.extendModels && options.extendModels[modelDef.name]) {
							modelDef.extend(options.extendModels[modelDef.name])
						}
						modelDef = modelDef.define(this.sequelize, Sequelize.DataTypes)
					} else {
						modelDef = modelDef(this.sequelize, Sequelize.DataTypes)
					}
					this.modelDefs[modelDef.name] = modelDef
				})
		})

		Object.keys(this.modelDefs).forEach(modelName => {
			if (this.modelDefs[modelName].associate) {
				this.modelDefs[modelName].associate(this.modelDefs)
			}
		})

		const self = this

		this.sequelize.addHook('afterCreate', (model, options) => {
			debug('dbHandler emit db-create')
			self.emit('db-create', model.constructor.name, model)
		})

		this.sequelize.addHook('beforeDestroy', (model, options) => {
			debug('dbHandler emit db-delete')
			self.emit('db-delete', model.constructor.name, model)
		})

		this.sequelize.addHook('afterUpdate', (model, options) => {
			debug('dbHandler emit db-update')
			self.emit('db-update', model.constructor.name, model)
		})
	}

	sync (done) {
		debug('calling sequelize.sync()')
		this.sequelize.sync().then(() => {
			// if no user roles create superuser and admin
			this.getInstances('Role', {}, (err, roles, count) => {
				if (err) {
					return done(err)
				}
				if (count) {
					return done()
				}
				async.series([
					(cb) => {
						this.newInstance('Role', {
							description: 'superuser'
						}, cb)
					}, (cb) => {
						this.newInstance('Role', {
							description: 'admin'
						}, cb)
					}, (cb) => {
						this.newInstance('Role', {
							description: 'owner'
						}, cb)
					}
				], function (err) {
					if (err) {
						debug('error creating default roles', err)
					}
					debug('default roles created')
					done()
				})
			})

			// now that the db is up we can initialize /admin
			if (this.adminOptions) {
				this.app.admin = require('./admin.cjs')
				this.app.admin.mount(this.app, this.adminOptions)
			}
		})
	}

	getModel (modelName) {
		if (!this.sequelize.models[modelName]) {
			throw (new Error('db-sequelize getModel model not found: ' + modelName))
		}
		return this.sequelize.models[modelName]
	}

	newInstance (modelName, data, cb) {
		debug('dbHandler.newInstance %s', modelName)
		for (const prop in data) {
			if (!data[prop]) {
				delete data[prop]
			}
		}
		this.getModel(modelName).create(data)
			.then(function (instance) {
				cb(null, instance)
			})
			.catch(function (err) {
				cb(new VError(err, 'newInstance error'))
			})
	}

	getInstance (modelName, id, cb) {
		this.getModel(modelName).findByPk(id)
			.then(function (result) {
				debug('dbHandler.getInstance %s %s found: %j', modelName, id, result)
				cb(null, result)
			})
			.catch(function (err) {
				cb(new VError(err, 'getInstances error'))
			})
	}

	getInstances (modelName, query, cb) {
		this.getModel(modelName).findAndCountAll(query)
			.then(function (result) {
				debug('dbHandler.getInstances %s %j found: %s', modelName, query, result.rows.length)

				cb(null, result.rows, result.count)
			})
			.catch(function (err) {
				cb(new VError(err, 'getInstances error'))
			})
	}

	updateInstance (modelName, id, patch, cb) {
		debug('dbHandler.updateInstance %s %s %j', modelName, id, patch)
		this.getModel(modelName).findOne({
			where: {
				id: id
			}
		})
			.then(function (instance) {
				for (const prop in patch) {
					instance[prop] = patch[prop] ? patch[prop] : null
				}
				instance.save()
					.then(function () {
						cb(null, instance)
					})
					.catch(function (err) {
						cb(new VError(err, 'updateInstance error'))
					})
			})
			.catch(function (err) {
				cb(new VError(err, 'updateInstance error ' + modelName + ' id:' + id + ' not found'))
			})
	}

	async doDelete (modelName, instance) {
		let deps
		try {
			deps = await admin.getDependants(modelName, instance)

			// recursively delete dependant rows

			let toDelete = []

			for (const t in deps) {
				const batch = deps[t].rows.rows.map((depInstance) => {
					return this.doDelete(t, depInstance)
				})
				toDelete = toDelete.concat(batch)
			}

			await Promise.all(toDelete)

			await instance.destroy()
		} catch (err) {
			throw new VError(err, 'error selecting and deleting dependant rows')
		}
	}

	deleteInstance (modelName, id, cb) {
		debug('dbHandler.deleteInstance %s %s', modelName, id)
		this.getModel(modelName).findOne({
			where: {
				id: id
			}
		}).then((instance) => {
			this.doDelete(modelName, instance)
				.then(function () {
					cb()
				})
				.catch(function (err) {
					cb(new VError(err, 'deleteInstance error'))
				})
		}).catch(function (err) {
			cb(new VError(err, 'deleteInstance error ' + modelName + ' id:' + id + ' not found'))
		})
	}

	checkPermission (modelName, user, action, instance) {
		let permission = 'deny'

		if (!this.getModel(modelName)) {
			return permission === 'allow'
		}

		let acl = _.get(this.getModel(modelName), 'options.ADMIN.ACL')

		if (!acl) {
			acl = [{
				permission: 'deny',
				roles: ['*'],
				actions: ['*']
			}]
		}

		const userRoles = ['*']

		if (user.Roles) {
			userRoles.push('registered')
			for (let i = 0; i < user.Roles.length; i++) {
				userRoles.push(user.Roles[i].description)
			}
		} else {
			userRoles.push('anonymous')
		}

		for (const i in acl) {
			const rule = acl[i]
			// rule applies to intended action ?
			if (rule.actions.indexOf(action) !== -1 || rule.actions.indexOf('*') !== -1) {
				for (const j in rule.roles) {
					const role = rule.roles[j]

					// 'owner' role requires special case check that
					// userId in the instance is the current user
					if ((action === 'view' || action === 'update' || action === 'delete') && role === 'owner' && instance) {
						if (instance.userId === user.id) {
							permission = rule.permission
						}
					} else {
						// rule applies to user's role ?
						if (userRoles.indexOf(role) !== -1) {
							permission = rule.permission
						}
					}
				}
			}
		}

		return permission === 'allow'
	}
}

module.exports = dbHandler
