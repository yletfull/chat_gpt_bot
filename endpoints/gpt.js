const {UserModel} = require("../models/user");
const {roles} = require("../constants/roles");

const checkAvailableMessages = (user, bot, setBotIsFetching) => {
  const currentDate = new Date();
  const userUpdateDate = user.dataValues?.updateMessagesDate;

  if(!userUpdateDate) {
    const date = currentDate;
    date.setDate(date.getDate() + Number(process.env.DAYS_UDPATE_MESSAGE || 1))
    user.update({ updateMessagesDate: String(date)})
  }

  const isNeedUpdate = new Date(userUpdateDate) < new Date();

  if(isNeedUpdate) {
    user.update({ updateMessagesDate: '', availableMessages: process.env.DAILY_AVAILABLE_MESSAGES })
  }

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
    return await user.update({
      availableMessages: user.dataValues.availableMessages - 1,
    })
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

    const lastMessage = messages[chatId][messages[chatId].length - 1]?.content;
    const isImageRequest = lastMessage?.includes('/image');

    if(isImageRequest) {
      const response = await openai.createImage({
        prompt: lastMessage,
        n: 1,
        size: "1024x1024",
      });
      const resultImageUrl = response.data.data[0].url;
      bot.sendSticker(chatId, resultImageUrl)
    } else {
      const completion = await openai.createChatCompletion({
        model: process.env.GPT_MODEL,
        messages: messages[chatId].slice(-20),
      });
      const resultMessage = `GPT: "${completion.data?.choices[0]?.message?.content}"` || 'Запрос не дошел до чата, попробуй еще разок!'
      bot.sendMessage(chatId, resultMessage);
    }
    setBotIsFetching(chatId, false);
    return substractAvailableMessages(user, bot);
  } else if (isBotFetching[chatId]) {
    return bot.sendMessage(chatId, process.env.DOUBLE_FETCHING_TEXT);
  }
}

module.exports = {
  gpt,
}