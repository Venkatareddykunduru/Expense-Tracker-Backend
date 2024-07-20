// models/forgotPasswordRequest.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});



module.exports = ForgotPasswordRequest;
