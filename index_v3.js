require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { welcomeOptions } = require('./src/options');

// const steps = require('./src/steps');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Объект для хранения данных пользователя
let userData = {};

// Шаг 1: Введите имя
bot.onText(/\/start/, async msg => {
   const chatId = msg.chat.id;
   // userData = {};
   console.log('@@@@ userData 000', userData);

   await bot.sendMessage(
      chatId,
      'Здравствуйте!\n\nПриветственное сообщение.\n\nНачнем?\n',
      welcomeOptions
   );
});

bot.on('message', async msg => {
   const chatId = msg.chat.id;
   const message = msg.text;

   // Шаг 2: Введите email
   if (!userData.isStarted) {
      userData.name = message;
      console.log('@@@@ userData 222', userData);

      await bot.sendMessage(chatId, 'Шаг 2: Введите email');
   }
   // Шаг 3: Введите город
   else if (!userData.email) {
      userData.email = message;
      console.log('@@@@ userData 333', userData);

      await bot.sendMessage(chatId, 'Шаг 3: Введите город');
   }

   // Шаг 4: Выберете день или ночь
   else if (!userData.city) {
      userData.city = message;
      console.log('@@@@ userData 444', userData);

      await bot.sendMessage(chatId, 'Шаг 4: Выберете день или ночь:', {
         reply_markup: {
            inline_keyboard: [
               [{ text: 'День', callback_data: 'day' }],
               [{ text: 'Ночь', callback_data: 'night' }],
            ],
         },
      });
   }
   // Шаг 5: Выберете валюту
   else if (!userData.timeOfDay) {
      userData.timeOfDay = message;
      console.log('@@@@ userData 555', userData);

      await bot.sendMessage(chatId, 'Шаг 5: Выберете валюту:', {
         reply_markup: {
            inline_keyboard: [
               [{ text: 'Доллар', callback_data: 'usd' }],
               [{ text: 'Евро', callback_data: 'eur' }],
            ],
         },
      });
   }
   // Шаг 6: Дополнительный шаг
   else if (!userData.currency) {
      userData.currency = message;
      console.log('@@@@ userData 666', userData);

      await bot.sendMessage(
         chatId,
         `Спасибо! Вы ввели следующие данные:
Имя: ${userData.name}
Email: ${userData.email}
Город: ${userData.city}
Время суток: ${userData.timeOfDay}
Валюта: ${userData.currency}`
      );
   }
});

// Обработка нажатий на inline кнопки
bot.on('callback_query', async query => {
   const chatId = query.message.chat.id;
   const data = query.data;

   console.log('@@@@ callback_query >>>', data);

   if (!userData.city) {
      userData.city = data;
      await bot.sendMessage(chatId, `Вы выбрали ${data}. Шаг 5: Выберете валюту:`, {
         reply_markup: {
            inline_keyboard: [
               [{ text: 'Доллар', callback_data: 'usd' }],
               [{ text: 'Евро', callback_data: 'eur' }],
            ],
         },
      });
   } else if (!userData.timeOfDay) {
      userData.timeOfDay = data;
      await bot.sendMessage(chatId, `Вы выбрали ${data}. Шаг 6: Дополнительный шаг`);
   } else if (!userData.isStarted) {
      if (data === 'begin') {
         userData.isStarted = true;
      }
   }
});
