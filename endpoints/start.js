const {checkAvailableMessages} = require("./gpt");
const start = async ({ bot, UserModel, message }) => {
  const user = await UserModel.findOne({
    where: {chatId: String(message.chat.id)}
  });
  if(!user) {
    const user = await UserModel.create({
      chatId: String(message.chat.id),
      firstname: message.chat.first_name,
      lastname: message.chat.last_name,
      name: message.chat.username
    })

    await checkAvailableMessages(user, bot);
    await bot.sendSticker(message.chat.id, 'https://chpic.su/_data/stickers/c/Catuku_283/Catuku_283_081.webp')
    return bot.sendMessage(message.chat.id, `Добро пожаловать, ${message.chat.first_name}, задавай вопрос - получай ответ (для генерации картинок /image текст для генерации). Полностью анонимно, история сохраняется только у тебя.`);
  }
  return bot.sendMessage(message.chat.id, `Привет, ${message.chat.first_name}, рады тебя видеть снова (для генерации картинок /image текст для генерации) `);
}

module.exports = {
  start,
}