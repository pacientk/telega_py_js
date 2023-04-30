const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    // 'defaultdb',
    // 'vultradmin',
    // 'AVNS_hoYOXZ-W17HZLMZJNfc',
    'telega_py_bd',
    'rootuser',
    '!Police15',
    {
        dialect: 'postgres',
        host: '45.76.8.223',
        port: '5432',
    },
);
