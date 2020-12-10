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
	}, {})

	return NotificationSubscribers
}
