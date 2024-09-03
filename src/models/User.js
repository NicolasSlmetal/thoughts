const sequelize = require('../db/conn');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    }
})

module.exports = User