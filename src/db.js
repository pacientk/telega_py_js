const { Sequelize } = require('sequelize');

module.exports = new Sequelize('defaultdb', 'vultradmin', 'AVNS_1RFAFSo_WUNuazdeR4E', {
   host: 'vultr-prod-3fbea8c4-682d-4355-867b-836a6663e95e-vultr-prod-2b1d.vultrdb.com',
   port: 16751,
   dialect: 'mysql',
});
