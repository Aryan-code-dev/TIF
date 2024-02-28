const { Sequelize } = require('sequelize');
require("dotenv").config({ path: require('find-config')('.env') });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql',
  });
async function checkConnection()
{
    try {
        await sequelize.authenticate();
        console.log('Connected.', new Date());
    } catch (error) {
        console.error('Unable to connect to the database:', error, new Date());
    }

} 
checkConnection();
console.log(sequelize.getDatabaseName());
module.exports = sequelize;