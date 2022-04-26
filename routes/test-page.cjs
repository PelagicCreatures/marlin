const express = require('express')
const router = express.Router()

const {
	validateToken,
	getUserForRequestMiddleware
} = require('../lib/get-user-for-request-middleware.cjs')


module.exports = function mount (app) {

	router.get('/', getUserForRequestMiddleware(app.marlin), function (req, res, next) {
		res.render('test/index.pug', {user:req.antisocialUser})
	})

	return router
}
