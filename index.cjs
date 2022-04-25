const debug = require('debug')('marlin-user')
const fs = require('fs')
const path = require('path')

const {
	expireTokens
} = require('./lib/get-user-for-request-middleware.cjs')

const defaults = {
	DEFAULT_TTL: 3600 * 24 * 14, // 2 weeks in seconds
	DEFAULT_SALT_ROUNDS: 10,
	DEFAULT_TOKEN_LEN: 64,
	PASSWORD_RESET_TTL: 3600 * 24 * 1, // 1 day
	EMAIL_CONFIRM_TTL: 3600 * 24 * 2, // 2 days
	MOUNTPOINT: '/api/users'
}

const express = require('express')
const events = require('events')

module.exports = (app, options) => {
	// setup DB (sequelize) & load models
	const dbHandler = require('./lib/db-sequelize.cjs')

	app.marlin = new events.EventEmitter()
	app.marlin.db = new dbHandler(app, options)
	app.marlin.options = options.userOptions || {}
	app.marlin.router = express.Router()

	for (const prop in defaults) {
		if (!app.marlin.options[prop]) {
			app.marlin.options[prop] = defaults[prop]
		}
	}

	require('./routes/is-unique.cjs')(app.marlin)
	require('./routes/register.cjs')(app.marlin)
	require('./routes/login.cjs')(app.marlin)
	require('./routes/logout.cjs')(app.marlin)
	require('./routes/email-change.cjs')(app.marlin)
	require('./routes/email-validate.cjs')(app.marlin)
	require('./routes/password-change.cjs')(app.marlin)
	require('./routes/password-reset.cjs')(app.marlin)
	require('./routes/password-set.cjs')(app.marlin)
	require('./routes/token-delete.cjs')(app.marlin)
	require('./routes/delete.cjs')(app.marlin)

	app.use('/', require('./routes/user-ui-pages.cjs')(app))

	expireTokens(app.marlin)

	const bootDir = path.join(__dirname, 'boot')
	fs
		.readdirSync(bootDir)
		.filter(file => {
			return (file.indexOf('.') !== 0) && (file.slice(-4) === '.cjs')
		})
		.forEach(file => {
			debug('boot/' + file)
			require(path.join(bootDir, file))(app)
		})

	debug('mounting users API on ' + app.marlin.options.MOUNTPOINT)

	app.use(app.marlin.options.MOUNTPOINT, app.marlin.router)
}
