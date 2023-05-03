const { Sequelize } = require('sequelize');

module.exports = new Sequelize('defaultdb', 'root', 'Police15!', {
   dialect: 'postgres',
   host: 'vultr-prod-062f0b48-7750-4b0a-80ef-0d8382e1d86e-vultr-prod-2b1d.vultrdb.com',
   port: '16751',
});
