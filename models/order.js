const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    paymentid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    orderid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Order;
