require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api')
const { Configuration, OpenAIApi } = require('openai');
const { start, debug, stat, gpt, premium, info, xls, unXls, xlsLoader} = require('./endpoints');
const sequelize = require('./db');
const { bdConnect } = require('./helpers/bdConnect');
const { UserModel } = require('./models/user')
const { botModes } = require("./helpers/botModes");

const openAIConfig = new Configuration({
  apiKey: process.env.GPT_TOKEN,
});

const openai = new OpenAIApi(openAIConfig);
const bot = new TelegramApi(process.env.TOKEN, {polling: true})

const messages = {};
let isBotFetching = {};
let currentBotMode = botModes.file;
const setBotIsFetching = (chatId, isFetching) => isBotFetching[chatId] = isFetching;
const setCurrentBotMode = (botMode) => currentBotMode = botMode;

const startBot = async () => {
  bdConnect({sequelize});

  bot.setMyCommands([
    {command: '/start', description: 'Начать общение'},
    {command: '/info', description: 'Инфо по тарифному плану'},
    {command: '/debug', description: 'Исправить ошибки'},
    {command: '/premium', description: 'Премиум, сейчас абсолютно бесплатно'},
  ])

  bot.on('message', async (message) => {
    const text = message.text;
    const chatId = message.chat.id;

    try {
      if(currentBotMode === botModes.default) {
        if (text === '/xls') {
          return xls({bot, chatId, setCurrentBotMode})
        }
        if (text === '/start') {
          return start({bot, UserModel, message})
        }
        if (text === '/info') {
          return info({bot, UserModel, message})
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
      } else if (currentBotMode === botModes.file) {
        if (text === '/xlsQuit') {
          return unXls({bot, chatId, setCurrentBotMode})
        }
        return xlsLoader({bot, chatId, message})
      }
    } catch (e) {
      return bot.sendMessage(chatId, process.env.UNKNOWN_ERROR_TEXT);
    }
  })
}

startBot();
