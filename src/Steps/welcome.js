const UserModel = require('../models');
const TelegramBot = require('node-telegram-bot-api');

const constants = require('../constants');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const validateOrderNo = message => {
   const regex = constants.REGEX_DIGITS_ONLY; // Регулярное выражение для проверки наличия только цифр

   if (regex.test(message)) {
      return true;
   } else {
      return false;
   }
};

const welcomeStep = async msg => {
   const userInput = msg.text;
   const userId = msg.from.id;
   const firstName = msg.from.first_name;
   const lastName = msg.from.last_name;
   const chatId = msg.chat.id;
   const isUser = await UserModel.findOne({ where: { chatId } });

   if (!!isUser) {
      await bot.sendMessage(
         chatId,
         `<b>Добрый день, ${msg.from.last_name} ${msg.from.first_name}!</b>`,
         {
            parse_mode: 'HTML',
         }
      );
      await bot.sendMessage(chatId, `Укажите номер заявки.`);
      // await bot.sendMessage(chatId, `<code>Укажите номер заявки.</code>`, {
      //    parse_mode: 'HTML',
      // });

      if (userInput && validateOrderNo(userInput)) {
         bot.sendMessage(chatId, 'Сообщение содержит только цифры. 👍');
         currentStep++;
      } else {
         await bot.sendMessage(chatId, `Некорретно. Введите только цифры.`);
      }
      // await validateOrderNo(text);

      // bot.onText(/^[0-9]+$/, msg => {
      //    const chatId = msg.chat.id;
      //    bot.sendMessage(chatId, 'Сообщение содержит только цифры. 👍');
      // });
   } else {
      await UserModel.create({ userId, chatId, firstName, lastName });
      await bot.sendSticker(
         chatId,
         'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/1.webp'
      );
   }

   // currentStep++;
};

module.exports = welcomeStep;
