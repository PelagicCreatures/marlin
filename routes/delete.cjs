const debug = require('debug')('marlin-user')
const async = require('async')
const VError = require('verror').VError

const {
	getUserForRequestMiddleware
} = require('../lib/get-user-for-request-middleware.cjs')

module.exports = (marlin) => {
	debug('mounting users API /delete')

	const db = marlin.db

	marlin.router.delete('/delete', getUserForRequestMiddleware(marlin), function (req, res) {
		debug('/delete')

		const currentUser = req.antisocialUser
		if (!currentUser) {
			return res.status(401).json({
				status: 'error',
				errors: ['must be logged in']
			})
		}

		const actions = []

		async.series([
			(cb) => {
				marlin.emit('deleteUser', req.antisocialUser, function (err, action) {
					if (action) {
						actions.push(action)
					}
					cb(err)
				})
			},

			// delete the user (will also delete all tokens)
			(cb) => {
				db.deleteInstance('User', req.antisocialUser.id, function (err) {
					if (err) {
						return cb(new VError(err, 'Error while deleting user'))
					}
					actions.push('User & Login Session Deleted.')
					cb()
				})
			}
		], function (err) {
			if (err) {
				return res.status(500).json({
					status: 'error',
					errors: [err.message]
				})
			}

			let count = 0

			// delete all cookies
			for (const cookie in req.cookies) {
				++count
				res.clearCookie(cookie, {
					path: '/'
				})
			}

			// delete all secure cookies
			for (const cookie in req.signedCookies) {
				++count
				res.clearCookie(cookie, {
					path: '/',
					signed: true,
					httpOnly: true
				})
			}

			actions.push(count + ' Browser Cookies Deleted.')

			res.send({
				status: 'ok',
				flashLevel: 'info',
				flashMessage: actions.join(', '),
				didLogout: true
			})
		})
	})
}
