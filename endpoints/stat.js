const stat = async ({ bot, chatId, messages }) => {
    return bot.sendMessage(chatId, process.env.ADMIN_STAT_TEXT + Object.keys(messages).length);
}

module.exports = {
    stat,
}