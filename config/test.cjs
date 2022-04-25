const debug = require('debug')('marlin-db')

module.exports = function (app) {
	debug('env: testing')

	const config = {

		siteName: '',

		COOKIE_KEY: 'SeCretDecdrrnG',

		publicOptions: {},

		userOptions: {},

		dbOptions: {
			dialect: 'sqlite',
			storage: ':memory:',
			define: {
				charset: 'utf8',
				freezeTableName: true
			},
			logging: false
		},

		adminOptions: {
			MOUNTPOINT: '/admin',
			UPLOAD_PATH: '/uploads/'
		}
	}

	return config
}
