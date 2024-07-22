const {DataTypes, Model}=require('sequelize');

const sequelize=require('../util/database.js');

const File=sequelize.define('file',{
    filename: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.STRING
    }
});

module.exports=File;