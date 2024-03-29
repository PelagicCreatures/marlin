const request = require('superagent')
const assert = require('assert')
const expect = require('expect.js')
const uuid = require('uuid')
const async = require('async')

const validateToken = require('../lib/get-user-for-request-middleware.cjs').validateToken

// TODO negative coverage for login, reg, validate etc.

describe('users', function () {
	this.timeout(50000)

	const client1 = request.agent()
	const client2 = request.agent()
	const client3 = request.agent()

	let token1
	let token2

	let id2, id1

	const app = require('../app-tests.cjs')

	before(function (done) {
		const http = require('http')
		app.start(() => {
			server = http.createServer(app)
			const listener = server.listen(3000)
			done()
		})
	})

	after(function (done) {
		server.close((e) => {
			done()
		})
	})

	it('should not be able to post empty register payload', function (done) {
		client1.put('http://127.0.0.1:3000/api/users/register')
			.send({
				email: '',
				password: '',
				username: ''
			})
			.set('Accept', 'application/json')
			.end(function (err, res) {
				if (err) {
					// console.log('errors: %j %j', err, res.body ? res.body : '');
				}
				expect(res.status).to.equal(422)
				expect(res.body.errors).to.be.an('array')
				done()
			})
	})

	it('should not be able to post invalid register payload', function (done) {
		client1.put('http://127.0.0.1:3000/api/users/register')
			.set('Accept', 'application/json')
			.send({
				email: 'invalid email',
				password: 'test with spaces',
				username: 'invalid username'
			})
			.end(function (err, res) {
				if (err) {
					// console.log('errors: %j %j', err, res.body ? res.body : '');
				}
				expect(res.status).to.equal(422)
				expect(res.body.errors).to.be.an('array')
				done()
			})
	})

	it('should be able to create account 1', function (done) {
		client1.put('http://127.0.0.1:3000/api/users/register')
			.set('Accept', 'application/json')
			.send({
				username: 'user-one',
				email: 'mrhodes+1@myantisocial.net',
				password: 'Testing123'
			})
			.end(function (err, res) {
				if (err) {
					console.log('errors: %j %j', err, res.body ? res.body : '')
				}
				expect(err).to.be(null)
				expect(res.status).to.equal(200)
				expect(res.body.status).to.equal('ok')
				id1 = res.body.result.id
				token1 = getCookie(res.headers['set-cookie'], 'access-token')
				expect(token1).to.be.a('string')
				done()
			})
	})

	it('should be able to validate account 1', function (done) {
		app.marlin.db.getInstances('Token', {
			where: {
				userId: id1,
				type: 'validate'
			}
		}, function (err, tokenInstances) {
			if (err || !tokenInstances || !tokenInstances.length) {
				return done('could not read validate token')
			}

			client1.patch('http://127.0.0.1:3000/api/users/email-validate')
				.set('Accept', 'application/json')
				.send({
					token: tokenInstances[0].token
				}).end(function (err, res) {
					if (err) {
						console.log('errors: %j %j', err, res.body ? res.body : '')
					}
					expect(res.status).to.equal(200)
					expect(res.body.status).to.equal('ok')
					done()
				})
		})
	})

	it('should be able to logout account 1', function (done) {
		client1.delete('http://127.0.0.1:3000/api/users/logout')
			.end(function (err, res) {
				if (err) {
					console.log('errors: %j %j', err, res.body ? res.body : '')
				}
				expect(err).to.be(null)
				expect(res.status).to.equal(200)
				expect(res.body.status).to.equal('ok')
				done()
			})
	})

	it('should be able to create account 2', function (done) {
		client2.put('http://127.0.0.1:3000/api/users/register')
			.set('Accept', 'application/json')
			.send({
				username: 'user-two',
				email: 'mrhodes+2@myantisocial.net',
				password: 'Testing123'
			})
			.end(function (err, res) {
				if (err) {
					console.log('errors: %j %j', err, res.body ? res.body : '')
				}
				expect(err).to.be(null)
				expect(res.status).to.equal(200)
				expect(res.body.status).to.equal('ok')
				id2 = res.body.result.id
				token2 = getCookie(res.headers['set-cookie'], 'access-token')
				expect(token2).to.be.a('string')
				done()
			})
	})

	it('should be able to validate account 2', function (done) {
		app.marlin.db.getInstances('Token', {
			where: {
				userId: id2,
				type: 'validate'
			}
		}, function (err, tokenInstances) {
			if (err || !tokenInstances || !tokenInstances.length) {
				return done('could not read validate token')
			}

			client2.patch('http://127.0.0.1:3000/api/users/email-validate')
				.set('Accept', 'application/json')
				.send({
					token: tokenInstances[0].token
				})
				.end(function (err, res) {
					if (err) {
						console.log('errors: %j %j', err, res.body ? res.body : '')
					}
					expect(res.status).to.equal(200)
					expect(res.body.status).to.equal('ok')
					done()
				})
		})
	})

	it('should be able to logout account 2', function (done) {
		client2.delete('http://127.0.0.1:3000/api/users/logout')
			.end(function (err, res) {
				if (err) {
					console.log('errors: %j %j', err, res.body ? res.body : '')
				}
				expect(err).to.be(null)
				expect(res.status).to.equal(200)
				expect(res.body.status).to.equal('ok')
				done()
			})
	})

	it('should not be able to login w/ bad payload', function (done) {
		client2.put('http://127.0.0.1:3000/api/users/login')
			.set('Accept', 'application/json')
			.send({
				email: 'mrhodes+2myantisocial.net',
				password: 'Testing123bad',
				some: 'crap'
			})
			.end(function (err, res) {
				if (err) {
					// console.log('errors: %j %j', err, res.body ? res.body : '');
				}
				expect(res.status).to.equal(422)
				done()
			})
	})

	it('should not be able to login account 2 w/bad password', function (done) {
		client2.put('http://127.0.0.1:3000/api/users/login')
			.set('Accept', 'application/json')
			.send({
				email: 'mrhodes+2@myantisocial.net',
				password: 'Testing123bad'
			})
			.end(function (err, res) {
				if (err) {
					// console.log('errors: %j %j', err, res.body ? res.body : '');
				}
				expect(res.status).to.equal(401)
				done()
			})
	})

	it('should be able to login account 2', function (done) {
		client2.put('http://127.0.0.1:3000/api/users/login')
			.set('Accept', 'application/json')
			.send({
				email: 'mrhodes+2@myantisocial.net',
				password: 'Testing123'
			})
			.end(function (err, res) {
				if (err) {
					console.log('errors: %j %j', err, res.body ? res.body : '')
				}
				expect(err).to.be(null)
				expect(res.status).to.equal(200)
				expect(res.body.status).to.equal('ok')
				done()
			})
	})

	it('should be able to send password reset account 1', function (done) {
		client1.patch('http://127.0.0.1:3000/api/users/password-reset')
			.set('Accept', 'application/json')
			.send({
				email: 'mrhodes+1@myantisocial.net'
			})
			.end(function (err, res) {
				if (err) {
					console.log('errors: %j %j', err, res.body ? res.body : '')
				}
				expect(err).to.be(null)
				expect(res.status).to.equal(200)
				expect(res.body.status).to.equal('ok')
				done()
			})
	})

	it('should be able to set new password with token account 1', function (done) {
		app.marlin.db.getInstances('Token', {
			where: {
				userId: id1,
				type: 'reset'
			}
		}, function (err, tokenInstances) {
			if (err || !tokenInstances || !tokenInstances.length) {
				return done('could not read validate token')
			}

			client1.patch('http://127.0.0.1:3000/api/users/password-set')
				.set('Accept', 'application/json')
				.send({
					token: tokenInstances[0].token,
					password: 'Testing1234'
				})
				.end(function (err, res) {
					if (err) {
						console.log('errors: %j %j', err, res.body ? res.body : '')
					}
					expect(err).to.be(null)
					expect(res.status).to.equal(200)
					expect(res.body.status).to.equal('ok')
					done()
				})
		})
	})

	it('should be able to log in again account 1 after reset', function (done) {
		client1.put('http://127.0.0.1:3000/api/users/login')
			.set('Accept', 'application/json')
			.send({
				email: 'mrhodes+1@myantisocial.net',
				password: 'Testing1234'
			})
			.end(function (err, res) {
				if (err) {
					console.log('errors: %j %j', err, res.body ? res.body : '')
				}
				expect(err).to.be(null)
				expect(res.status).to.equal(200)
				expect(res.body.status).to.equal('ok')
				token1 = getCookie(res.headers['set-cookie'], 'access-token')
				expect(token1).to.be.a('string')
				done()
			})
	})

	it('should be able to change password when logged in', function (done) {
		client1.patch('http://127.0.0.1:3000/api/users/password-change')
			.set('Accept', 'application/json')
			.send({
				oldpassword: 'Testing1234',
				password: 'Testing123'
			})
			.end(function (err, res) {
				if (err) {
					console.log('errors: %j %j', err, res.body ? res.body : '')
				}
				expect(err).to.be(null)
				expect(res.status).to.equal(200)
				expect(res.body.status).to.equal('ok')
				done()
			})
	})

	it('should be able to change email when logged in', function (done) {
		client1.patch('http://127.0.0.1:3000/api/users/email-change')
			.set('Accept', 'application/json')
			.send({
				email: 'mrhodes+11@myantisocial.net'
			})
			.end(function (err, res) {
				if (err) {
					console.log('errors: %j %j', err, res.body ? res.body : '')
				}
				expect(err).to.be(null)
				expect(res.status).to.equal(200)
				expect(res.body.status).to.equal('ok')
				done()
			})
	})

	it('should be able to validate account 1 after email change', function (done) {
		app.marlin.db.getInstances('Token', {
			where: {
				userId: id1,
				type: 'validate'
			}
		}, function (err, tokenInstances) {
			if (err || !tokenInstances || !tokenInstances.length) {
				return done('could not read validate token')
			}

			client1.patch('http://127.0.0.1:3000/api/users/email-validate')
				.set('Accept', 'application/json')
				.send({
					token: tokenInstances[0].token
				}).end(function (err, res) {
					if (err) {
						console.log('errors: %j %j', err, res.body ? res.body : '')
					}
					expect(res.status).to.equal(200)
					expect(res.body.status).to.equal('ok')
					done()
				})
		})
	})

	it('should be able to create a token that expires in 1 seconds', function (done) {
		const ttl = 1
		app.marlin.db.newInstance('Token', {
			token: uuid.v4(),
			lastaccess: new Date(),
			ttl: ttl,
			expires: Math.round(new Date().getTime() / 1000) + ttl,
			type: 'access'
		}, function (err, token) {
			if (err) {
				return done(new Error('error creating token'))
			}
			validateToken(app.marlin.db, token, function (err) {
				if (err) {
					return done('error validating token', err)
				}
				setTimeout(() => {
					validateToken(app.marlin.db, token, function (err) {
						if (!err) {
							return done(new Error('token ttl timeout validation failed'))
						}
						done()
					})
				}, (ttl + 1) * 1000)
			})
		})
	})
})

function getCookie (headers, id) {
	for (let i = 0; i < headers.length; i++) {
		const kv = headers[i].split(';')[0].split('=')
		if (kv[0] === id) {
			return kv[1]
		}
	}
	return null
}
