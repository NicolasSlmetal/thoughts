const sequelize = require("../db/conn")
const {  DataTypes} = require('sequelize');
const User = require('./User');


const Thought = sequelize.define("Thought", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },

})

Thought.belongsTo(User)
User.hasMany(Thought)

module.exports = Thought;