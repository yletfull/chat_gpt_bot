const {rolesTitles, roles} = require("../constants/roles");
const dayjs = require("dayjs");

const info = async ({ bot, UserModel, message }) => {
  const user = await UserModel.findOne({
    where: {chatId: String(message.chat.id)}
  });
  return bot.sendMessage(message.chat.id, `Привет, <b>${message.chat.first_name}</b>, 
Статус аккаунта: <b>${rolesTitles[user.dataValues.role]}</b>,
Доступно сообщений: <b>${user.dataValues.role === roles.premium ? '∞' : user.dataValues.availableMessages}</b> шт,
Дата обновления сообщений: <b>${dayjs(user.dataValues.updateMessagesDate).format('DD.MM.YYYY HH:mm')}</b>,
  `, {parse_mode: 'html'});
}

module.exports = {
  info,
}