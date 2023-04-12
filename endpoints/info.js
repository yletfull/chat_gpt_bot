const {rolesTitles, roles} = require("../constants/roles");
const info = async ({ bot, UserModel, message }) => {
  const user = await UserModel.findOne({
    where: {chatId: String(message.chat.id)}
  });
  return bot.sendMessage(message.chat.id, `Привет, <b>${message.chat.first_name}</b>, 
Статус аккаунта: <b>${rolesTitles[user.dataValues.role]}</b>,
Доступно сообщений: ${user.dataValues.role === roles.premium ? '<b>∞</b>' : user.dataValues.availableMessages} шт.
  `, {parse_mode: 'html'});
}

module.exports = {
  info,
}