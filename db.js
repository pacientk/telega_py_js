const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    // 'defaultdb',
    // 'vultradmin',
    // 'AVNS_hoYOXZ-W17HZLMZJNfc',
    'defaultdb',
    'vultradmin',
    'AVNS_MGFdd5I4dKgYKdItZRI',
    {
        dialect: 'postgres',
        host: 'vultr-prod-15677b28-3396-40dc-a808-166d996fe86e-vultr-prod-2b1d.vultrdb.com',
        port: '16751',
    },
);
