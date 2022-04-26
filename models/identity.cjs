const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const Identity = sequelize.define('Identity', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		provider: {
			type: Sequelize.STRING
		},
		externalId: {
			type: Sequelize.STRING
		},
		profile: {
			type: Sequelize.JSON
		},
		credentials: {
			type: Sequelize.JSON
		}
	}, {
		ADMIN: {
			behavior: 'child',
			hidden: true,
			ACL: [{
				permission: 'deny',
				roles: ['*'],
				actions: ['*']
			}, {
				permission: 'allow',
				roles: ['superuser'],
				actions: ['*']
			}]
		}
	})

	Identity.associate = function (models) {
		models.User.hasMany(models.Identity, {
			foreignKey: 'userId'
		})
	}

	return Identity
}
