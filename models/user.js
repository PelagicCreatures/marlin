const debug = require('debug')('marlin-db')
const Sequelize = require('sequelize')

module.exports.name = 'User'

const definition = {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: true,
		len: [0, 60]
	},
	username: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		len: [4, 20],
		is: ['^[a-zA-Z0-9-]+$', '']
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		isEmail: true
	},
	password: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		ADMIN: {
			hidden: true
		}
	},
	profilePhoto: {
		type: Sequelize.JSON,
		allowNull: true,
		ADMIN: {
			inputType: 'image',
			accepts: 'image/*'
		}
	},
	validated: {
		type: Sequelize.INTEGER,
		allowNull: true
	},
	stripeCustomer: {
		type: Sequelize.STRING,
		allowNull: true
	},
	stripeSubscription: {
		type: Sequelize.STRING,
		allowNull: true
	},
	stripeStatus: {
		type: Sequelize.STRING,
		allowNull: true
	},
	pendingEmail: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: true,
		isEmail: true
	}
}

module.exports.extend = (columnDefs) => {
	for (const prop in columnDefs) {
		definition[prop] = columnDefs[prop]
	}
}

module.exports.define = (sequelize, DataTypes) => {
	const User = sequelize.define('User', definition, {
		ADMIN: {
			defaultColumn: 'email',
			listColumns: ['email', 'username', 'validated'],
			searchColumns: ['email'],
			ACL: [{
				permission: 'deny',
				roles: ['*'],
				actions: ['*']
			}, {
				permission: 'allow',
				roles: ['superuser'],
				actions: ['view', 'edit', 'delete']
			}]
		}
	})

	User.associate = function (models) {
		User.hasMany(models.Token, {
			foreignKey: 'userId'
		})
		User.hasMany(models.NotificationSubscribers, {
			foreignKey: 'userId'
		})
		User.belongsToMany(models.Role, {
			through: 'UserRole',
			foreignKey: 'userId'
		})
	}

	return User
}
