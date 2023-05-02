const { Sequelize } = require('sequelize');

module.exports = new Sequelize('defaultdb', 'vultradmin', 'AVNS_9I74M7C9XmwmVRx5b2l', {
   dialect: 'postgres',
   host: 'vultr-prod-062f0b48-7750-4b0a-80ef-0d8382e1d86e-vultr-prod-2b1d.vultrdb.com',
   port: '16751',
   operatorsAliases: 0,
   pool: {
      max: 5,
      min: 0,
      acquire: 3000,
      idle: 10000,
   },
});
