const {UserModel} = require("../models/user");
const premium = async ({ bot, chatId }) => {
  const user = await UserModel.findOne({
    where: { chatId: String(chatId) }
  })
  user.update({
    role: 'premium'
  });
  return bot.sendMessage(chatId,`${user.dataValues.firstname}, вы обладатель премиум аккаунта!`);
}

module.exports = {
  premium,
}