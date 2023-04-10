const debug = async ({ bot, chatId, messages, setBotIsFetching }) => {
  messages[chatId] = [];
  bot.sendMessage(chatId, process.env.DEBUG_TEXT);
  return setBotIsFetching(chatId, false)
}

module.exports = {
  debug,
}