const {Sequelize} = require('sequelize');

const user = process.env.DB_USER
const pwd = process.env.DB_PWD
const host = process.env.DB_HOST
const db = process.env.DB_DATABASE

const sequelize = new Sequelize(db, user, pwd, {
    host: host,
    dialect: "mysql"
}
)

try{
    sequelize.authenticate()
} catch (err){
    console.log(err)
}

module.exports = sequelize;
