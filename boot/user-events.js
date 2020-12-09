const debug = require('debug')('user-events')
const mailer = require('../lib/mail')
const VError = require('verror').VError

module.exports = (app) => {
	app.marlin.on('didRegister', (user, post, cb) => {
		debug('didRegister event user: %j', user)
		cb()
	})

	// send confirmation email
	app.marlin.on('sendEmailConfirmation', function (user, token) {
		if (app.config.MAILER) {
			debug('sendEmailConfirmation event user: %j token: %j', user, token)
			const url = app.locals.publicOptions.PUBLIC_HOST + '/users/validate?token=' + token.token

			const options = {
				to: user.email,
				from: app.config.OUTBOUND_MAIL_SENDER,
				subject: 'Thanks For Registering',
				user: user,
				url: url
			}

			mailer(app, 'emails/verify', options, function (err) {
				if (err) {
					const e = new VError(err, 'could not send verification email')
					debug(e.toString())
					debug(e.stack)
				}
			})
		}
	})

	// send password reset email
	app.marlin.on('sendPasswordReset', function (user, token) {
		if (app.config.MAILER) {
			debug('sendPasswordReset user: %j token: %j', user, token)
			const url = app.locals.publicOptions.PUBLIC_HOST + '/users/password-set?token=' + token.token

			const options = {
				to: user.email,
				from: app.config.OUTBOUND_MAIL_SENDER,
				subject: 'Password Reset Request',
				user: user,
				url: url
			}

			mailer(app, 'emails/reset', options, function (err) {
				if (err) {
					const e = new VError(err, 'could not send reset email')
					debug(e.toString())
					debug(e.stack)
				}
			})
		}
	})

	app.marlin.db.on('db-create', function (table, instance) {
		debug('db-create %s instance id %s', table, instance.id)
	})

	app.marlin.db.on('db-update', function (table, instance) {
		debug('db-update %s instance id %s', table, instance.id)
	})

	app.marlin.db.on('db-delete', function (table, instance) {
		debug('db-delete %s instance id %s', table, instance.id)
	})
}
