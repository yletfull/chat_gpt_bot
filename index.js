require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api')
const { Configuration, OpenAIApi } = require("openai");

const openAIConfig = new Configuration({
    apiKey: process.env.GPT_TOKEN,
});

const openai = new OpenAIApi(openAIConfig);
const bot = new TelegramApi(process.env.TOKEN, {polling: true})

const messages = {};
let isBotFetching = {};

const startBot = async () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начать общение'},
        {command: '/debug', description: 'Исправить ошибки'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        try {
            if (text === '/start') {
                await bot.sendSticker(chatId, process.env.START_STICKER_URL)
                return bot.sendMessage(chatId, process.env.START_TEXT);
            }

            if (text === '/debug') {
                messages[chatId] = [];
                isBotFetching[chatId] = false;
                return bot.sendMessage(chatId, process.env.DEBUG_TEXT);
            }

            if (text === process.env.ADMIN_STAT) {
                return bot.sendMessage(chatId, process.env.ADMIN_STAT_TEXT + Object.keys(messages).length);
            }

            if(!isBotFetching[chatId]) {
                isBotFetching[chatId] = true;

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
                return isBotFetching[chatId] = false
            } else {
                bot.sendMessage(chatId, process.env.DOUBLE_FETCHING_TEXT);
            }
        } catch (e) {
            return bot.sendMessage(chatId, process.env.UNKNOWN_ERROR_TEXT);
        }
    })
}

startBot()
