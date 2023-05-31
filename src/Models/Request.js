const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Request = sequelize.define('Request', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
   },
   userId: { type: DataTypes.STRING, unique: true },
   chatId: { type: DataTypes.STRING, unique: true },
   requestId: { type: DataTypes.INTEGER, unique: true },
   sum: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
   coin: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
   network: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
   total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

module.exports = Request;
