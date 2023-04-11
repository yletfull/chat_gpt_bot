const sequelize = require("../db");

const bdConnect = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
  } catch (e) {
    console.error('Ошибка подключения к бд', e)
  }
}

module.exports = {
  bdConnect,
}