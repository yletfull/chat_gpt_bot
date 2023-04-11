const bdConnect = async ({sequelize}) => {
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