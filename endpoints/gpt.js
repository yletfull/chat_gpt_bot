const {UserModel} = require("../models/user");
const {roles} = require("../constants/roles");

const checkAvailableMessages = (user, bot, setBotIsFetching) => {
  if(user.dataValues.role === roles.default) {
    if(user.dataValues.availableMessages <= 0) {
      bot.sendMessage(user.dataValues.chatId, 'У вас закончились сообщения, сейчас премиум /premium - без ограничений, навсегда!');
      setBotIsFetching(user.dataValues.chatId, false);
      return false;
    }
  }
  return true;
}

const substractAvailableMessages = async(user, bot) => {
  if(user.dataValues.role === roles.admin || user.dataValues.role === roles.premium) {
    return;
  }
  if(user.dataValues.role === roles.default) {
    await user.update({
      availableMessages: user.dataValues.availableMessages - 1,
    })
    return bot.sendMessage(user.dataValues.chatId, `У вас осталось ${user.dataValues.availableMessages - 1} сообщений, получи премиум аккаунт /premium - сейчас абсолютно бесплатно, навсегда`);
  }
}

const gpt = async ({ bot, chatId, messages, setBotIsFetching, isBotFetching, openai, text }) => {
  const user = await UserModel.findOne({
    where: { chatId: String(chatId) }
  })

  const hasAvailableMessages = checkAvailableMessages(user, bot, setBotIsFetching);

  if(!isBotFetching[chatId] && hasAvailableMessages) {
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
    setBotIsFetching(chatId, false);
    return substractAvailableMessages(user, bot);
  } else if (isBotFetching[chatId]) {
    return bot.sendMessage(chatId, process.env.DOUBLE_FETCHING_TEXT);
  }
}

module.exports = {
  gpt,
}