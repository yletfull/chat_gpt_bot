require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api')
const { Configuration, OpenAIApi } = require("openai");

const openAIConfig = new Configuration({
    apiKey: process.env.GPT_TOKEN,
});

const openai = new OpenAIApi(openAIConfig);
const bot = new TelegramApi(process.env.TOKEN, {polling: true})

const startBot = async () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начать общение'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        try {
            if (text === '/start') {
                await bot.sendSticker(chatId, process.env.START_STICKER_URL)
                return bot.sendMessage(chatId, process.env.START_TEXT);
            }

            bot.sendMessage(chatId, 'Ожидай, бот генерирует ответ...');
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: text}],
            });
            const message = `GPT: "${completion.data?.choices[0]?.message?.content}"` || 'Запрос не дошел до чата, попробуй еще разок!'
            return bot.sendMessage(chatId, message);
        } catch (e) {
            return bot.sendMessage(chatId, 'Неизвестная ошибка');
        }
    })
}

startBot()
