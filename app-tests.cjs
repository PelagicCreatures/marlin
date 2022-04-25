// this is used as a test harness

if (process.env.ENVFILE) {
	console.log('loading env:' + process.env.ENVFILE)
	require('dotenv').config({
		path: process.env.ENVFILE
	})
}

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const uuid = require('uuid')
const helmet = require('helmet')
const debug = require('debug')('marlin-user')

const app = express()

// setup configuration from config file for environment
app.config = require('./config/' + app.get('env') + '.cjs')(app)

console.log(app.config)


// app.locals properties are exposed to pug templates
app.locals.sitename = app.config.siteName
app.locals.publicOptions = app.config.publicOptions
app.locals.nonce = uuid.v4()
app.locals.moment = require('moment')

// Content Security Profile for browser
if (app.config.cspOptions && app.config.cspOptions.directives) {
	const csp = require('helmet-csp')
	app.use(helmet())
	app.use(csp(app.config.cspOptions))
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
if (app.get('env') !== 'production') {
	app.locals.pretty = true
}

// http logs
if (app.config.LOGGER_LEVEL) {
	const logger = require('morgan')
	app.use(logger(app.config.LOGGER_LEVEL))
}

// use basic-auth for development environment
if (app.config.BASIC_AUTH && !process.env.TESTING) {
	const basicAuth = require('./lib/basicAuth.cjs')(app.config.BASIC_AUTH)
	app.use(basicAuth)
}

// parse cookies in all routes
app.use(cookieParser(app.config.COOKIE_KEY))

// set up and mount the user API
require('./index.cjs')(app, app.config)

// deliver static files from public directory
app.use(express.static(path.join(__dirname, 'public')))

// Call asynchronous things that need to be stable
// before we can handle requests
// NOTE: /admin routes are mounted by this so error
// handlers need to be defined after this call
app.start = function (done) {
	debug('starting app')
	app.marlin.db.sync(() => {
		debug('db sync done')

		// catch 404 and forward to error handler
		app.use(function (req, res, next) {
			next(createError(404))
		})

		// error handler
		app.use(function (err, req, res, next) {
			if (res.headersSent) {
				return next(err)
			}

			if (err.code === 'EBADCSRFTOKEN') {
				return res.status(403).send({
					status: 'error',
					errors: ['invalid csrf']
				})
			}

			res.locals.message = err.cause && err.cause() ? err.cause().message : err.message

			if (req.get('Sargasso-Hijax')) {
				res.set('Sargasso-Flash-Level', 'danger')
				res.set('Sargasso-Flash-Message', res.locals.message)
			}

			// set locals, only providing error details in development
			res.locals.error = err
			res.locals.verbose = req.app.get('env') === 'local' || req.app.get('env') === 'development'
			// render the error page
			res.status(err.status || 500)
			res.render('error')
		})

		done()
	})
}

module.exports = app
