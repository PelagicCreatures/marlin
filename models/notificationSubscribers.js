const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const NotificationSubscribers = sequelize.define('NotificationSubscribers', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		subscription: {
			type: Sequelize.JSON
		},
		lastStatusCode: {
			type: Sequelize.INTEGER
		}
	}, {
		ADMIN: {
			behavior: 'reference',
			ACL: [{
				permission: 'deny',
				roles: ['*'],
				actions: ['*']
			}, {
				permission: 'allow',
				roles: ['superuser'],
				actions: ['create', 'view', 'edit', 'delete']
			}]
		}
	})

	NotificationSubscribers.associate = function (models) {
		NotificationSubscribers.belongsTo(models.User, {
			foreignKey: 'userId'
		})
	}

	return NotificationSubscribers
}
