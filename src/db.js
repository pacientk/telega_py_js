const { Sequelize } = require('sequelize');

module.exports = new Sequelize('telega_py_db', 'kir', 'qwqwQWQW', {
   host: 'mysql_server',
   dialect: 'mysql',
});
