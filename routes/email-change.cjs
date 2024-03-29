const VError = require('verror').VError;
const debug = require('debug')('marlin-user');
const async = require('async');
const csrf = require('csurf');
const express = require('express');
const getAdmin = require('../lib/admin.cjs').getAdmin;

const csrfProtection = csrf({
	cookie: {
		signed: true,
		httpOnly: true
	},
	ignoreMethods: process.env.TESTING ? ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'] : []
});

const {
	getUserForRequestMiddleware
} = require('../lib/get-user-for-request-middleware.cjs');

const {
	validatePayload
} = require('../lib/validator-extensions.cjs');

module.exports = (marlin) => {

	debug('mounting users API /email-change');

	let db = marlin.db;

	let createToken = require('../lib/create-token.cjs')(marlin);

	marlin.router.patch('/email-change', express.json(), getUserForRequestMiddleware(marlin), csrfProtection, function (req, res) {

		debug('/email-change', req.body);

		let validators = getAdmin('User').getValidations();

		let errors = validatePayload(req.body, {
			email: validators.email
		}, {
			strict: true,
			additionalProperties: ['_csrf']
		});

		if (errors.length) {
			return res
				.status(422)
				.json({
					status: 'error',
					errors: errors
				});
		}

		var currentUser = req.antisocialUser;
		if (!currentUser) {
			return res.status(401).json({
				status: 'error',
				errors: ['must be logged in']
			});
		}

		// patch user.pendingEmail, generate token, send validation email
		async.waterfall([
			function (donePatch) {
				db.updateInstance('User', currentUser.id, {
					'pendingEmail': req.body.email,
					'validated': false
				}, function (err, user) {
					if (err) {
						return db(new VError('unable to save pendingEmail'));
					}
					donePatch(null, user);
				});
			},
			function (user, doneToken) {
				createToken(user, {
					ttl: marlin.options.EMAIL_CONFIRM_TTL,
					type: 'validate'
				}, function (err, token) {
					marlin.emit('sendEmailConfirmation', user, token);
					doneToken(err);
				});
			}
		], function (err) {

			if (err) {
				return res.status(400).json({
					status: 'error',
					flashLevel: 'danger',
					flashMessage: 'Change Email failed',
					errors: [err.message]
				});
			}

			res.json({
				'status': 'ok',
				'flashLevel': 'success',
				'flashMessage': 'Saved. Please check your email for confirmation.',
				'hijaxLocation': '/users/home'
			});
		});
	});
};
