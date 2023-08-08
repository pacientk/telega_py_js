const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
   },
   userId: { type: DataTypes.STRING, allowNull: false, unique: false },
   chatId: { type: DataTypes.STRING, allowNull: false, unique: false },
   firstName: { type: DataTypes.STRING, allowNull: false },
   lastName: { type: DataTypes.STRING, allowNull: false },
   right: { type: DataTypes.INTEGER, defaultValue: 0 },
   wrong: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = User;
