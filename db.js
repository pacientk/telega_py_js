const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    'defaultdb',
    'vultradmin',
    'AVNS_hoYOXZ-W17HZLMZJNfc',
    {
        host: 'vultr-prod-b501a4bc-fed7-49c1-9fd6-0fdc91b0af51-vultr-prod-2b1d.vultrdb.com',
        port: '16751',
        dialect: 'postgres'
    },
);
