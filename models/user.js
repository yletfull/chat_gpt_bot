const sequelize = require('../db');
const {DataTypes} = require('sequelize')
const {roles} = require("../constants/roles");
const dayjs = require("dayjs");

const UserModel = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  chatId: {type: DataTypes.STRING, unique: true},
  role: {type: DataTypes.STRING, defaultValue: roles.default},
  name: {type: DataTypes.STRING, unique: true},
  firstname: {type: DataTypes.STRING},
  lastname: {type: DataTypes.STRING},
  availableMessages: {type: DataTypes.INTEGER, defaultValue: 20},
  updateMessagesDate: {type: DataTypes.STRING, defaultValue: String(dayjs().toDate())}
})

module.exports = {
  UserModel,
}
