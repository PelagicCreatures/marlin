const express = require('express')

module.exports = function mount (marlin) {
	marlin.router.post('/notifications/subscribe', express.json(), (req, res, next) => {
		marlin.db.newInstance('NotificationSubscribers', {
			subscription: req.body
		}, function (err, user) {
			if (err) {
				res.send({
					status: 'error',
					error: err
				})
			}
			res.send({
				status: 'ok'
			})
		})
	})
}
