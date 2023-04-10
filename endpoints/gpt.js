const gpt = async ({ bot, chatId, messages, setBotIsFetching, isBotFetching, openai, text }) => {
  if(!isBotFetching[chatId]) {
    setBotIsFetching(chatId, true);

    if(!messages[chatId]) {
      messages[chatId] = [];
    }

    messages[chatId].push({role: "user", content: text});

    bot.sendMessage(chatId, process.env.GPT_IS_FETCHING_TEXT);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages[chatId].slice(-20),
    });

    const message = `GPT: "${completion.data?.choices[0]?.message?.content}"` || 'Запрос не дошел до чата, попробуй еще разок!'

    bot.sendMessage(chatId, message);

    return setBotIsFetching(chatId, false);
  } else {
    return bot.sendMessage(chatId, process.env.DOUBLE_FETCHING_TEXT);
  }
}

module.exports = {
  gpt,
}