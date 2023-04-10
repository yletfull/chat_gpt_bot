const start = async ({ bot, chatId }) => {
  await bot.sendSticker(chatId, process.env.START_STICKER_URL)
  return bot.sendMessage(chatId, process.env.START_TEXT);
}

module.exports = {
  start,
}