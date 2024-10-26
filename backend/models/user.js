'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// Waiting for group member' User Profile, Event Details, States, Volunteer History
		}

		async validatePassword(password) {
			return bcrypt.compare(password, this.password);
		}
	}

	User.init({
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		role: {
			type: DataTypes.ENUM('admin', 'volunteer'),
			defaultValue: 'volunteer'
		},
		isRegistered: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		registrationToken: {
			type: DataTypes.STRING,
			allowNull: true
		},
		tokenExpiresAt: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		sequelize,
		modelName: 'User',
		hooks: {
			beforeCreate: async (user) => {
				if (user.password) {
					user.password = await bcrypt.hash(user.password, 10);
				}
			},
			beforeUpdate: async (user) => {
				if (user.changed('password')) {
					user.password = await bcrypt.hash(user.password, 10);
				}
			}
		}
	});

	return User;
};