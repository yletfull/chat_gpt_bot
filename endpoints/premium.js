const {UserModel} = require("../models/user");
const {roles} = require("../constants/roles");
const premium = async ({ bot, chatId }) => {
  const user = await UserModel.findOne({
    where: { chatId: String(chatId) }
  })
  user.update({
    role: roles.premium,
  });
  return bot.sendMessage(chatId,`${user.dataValues.firstname}, вы обладатель премиум аккаунта!`);
}

module.exports = {
  premium,
}