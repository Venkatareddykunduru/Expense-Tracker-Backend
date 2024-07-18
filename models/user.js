const {DataTypes}=require('sequelize');

const sequelize=require('../util/database.js');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ispremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    
});

module.exports=User;