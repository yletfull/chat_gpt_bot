const { botModes } = require("../helpers/botModes");
const fs = require("fs");
const xls = async ({ bot, chatId, setCurrentBotMode }) => {
  setCurrentBotMode(botModes.file);
  bot.sendMessage(chatId, 'Перешли в режим загрузки файлов, /xlsQuit выйти');
}

const unXls = async ({ bot, chatId, setCurrentBotMode }) => {
  setCurrentBotMode(botModes.default);
  bot.sendMessage(chatId, 'Вы вышли из режима загрузки файлов');
}

const xlsLoader = async ({ bot, chatId, message }) => {
  await bot.on('document', async (doc) => {
    const fileId = doc?.document?.thumbnail?.file_id;
    const fileName = doc?.document?.file_name;

    const fileStream = bot.getFileStream(fileId);

    const filePath = `./${fileName}`;

    const writeStream = fs.createWriteStream(filePath);

    fileStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    bot.sendDocument(chatId, filePath, { caption: fileName });
  })
}

module.exports = {
  xls,
  xlsLoader,
  unXls
}