require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api')
const { Configuration, OpenAIApi } = require('openai');
const { start, debug, stat, gpt, premium } = require('./endpoints');
const sequelize = require('./db');
const { bdConnect } = require('./helpers/bdConnect');
const { UserModel } = require('./models/user')

const openAIConfig = new Configuration({
  apiKey: process.env.GPT_TOKEN,
});

const openai = new OpenAIApi(openAIConfig);
const bot = new TelegramApi(process.env.TOKEN, {polling: true})

const messages = {};
let isBotFetching = {};
const setBotIsFetching = (chatId, isFetching) => isBotFetching[chatId] = isFetching;

const startBot = async () => {
  bdConnect({sequelize});

  bot.setMyCommands([
    {command: '/start', description: 'Начать общение'},
    {command: '/debug', description: 'Исправить ошибки'},
    {command: '/premium', description: 'Премиум, сейчас абсолютно бесплатно'},
  ])

  bot.on('message', async (message) => {
    const text = message.text;
    const chatId = message.chat.id;

    try {
      if (text === '/start') {
        return start({bot, UserModel, message})
      }
      if (text === '/debug') {
        return debug({bot, chatId, messages, setBotIsFetching})
      }
      if (text === '/premium') {
        return premium({bot, chatId})
      }
      if (text === process.env.ADMIN_STAT) {
        return stat({bot, chatId, messages})
      }
      return gpt({
        bot,
        chatId,
        messages,
        isBotFetching,
        setBotIsFetching,
        openai,
        text,
      })
    } catch (e) {
      return bot.sendMessage(chatId, process.env.UNKNOWN_ERROR_TEXT);
    }
  })
}

startBot();
