require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./src/options');
const sequelize = require('./src/db');
const UserModel = require('./src/models');
const constants = require('./src/constants');
const welcomeStep = require('./src/Steps/welcome');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const chats = {};
let currentStep = 0;

const start = async () => {
   try {
      console.log('Connection..');
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('Connection has been established successfully.');
   } catch (error) {
      console.error('Unable to connect to the database:', error);
   }

   bot.setMyCommands([
      { command: '/start', description: 'Start Command' },
      { command: '/info', description: 'Info Command' },
      { command: '/game', description: 'Play a game!' },
   ]);

   bot.on('message', async msg => {
      const userInput = msg.text;
      const userId = msg.from.id;
      const firstName = msg.from.first_name;
      const lastName = msg.from.last_name;
      const chatId = msg.chat.id;

      try {
         if (userInput === '/start') {
            console.log('@@@@ currentStep::', currentStep);

            if (currentStep === 0) {
               welcomeStep(msg);
            } else if (currentStep === 1) {
               await bot.sendMessage(chatId, `Укажите сумму.`);
            }

            bot.onText(constants.REGEX_DIGITS_ONLY, msg => {
               const chatId = msg.chat.id;
               bot.sendMessage(chatId, 'Сообщение содержит только цифры. 👍');
            });

            // const opts = {
            //    // reply_to_message_id: msg.message_id,
            //    reply_markup: {
            //       inline_keyboard: [
            //          [{ text: 'Budapest!', web_app: { url: 'https://google.com' } }],
            //       ],
            //    },
            // };
            //
            // return bot.sendMessage(chatId, `Укажите город:`, opts);
         }

         if (userInput === '/info') {
            const user = await UserModel.findOne({ userId });

            return await bot.sendMessage(
               chatId,
               `Chat ID: ${chatId}.
               Message text: ${msg.text}. 
               Message from: ${msg.from.first_name} ${msg.from.last_name}. 
               Right answers: ${user.right} 
               Wrong answers: ${user.wrong}`
            );
         }

         if (userInput === '/game') {
            await bot.sendMessage(chatId, `Добро пожаловать в игру!`);
            return startGame(chatId);
         }
      } catch (e) {
         console.log('@@@@ ERR:::::', e);
         bot.sendMessage(chatId, `ERROR: ${e.message}`);
      }
   });

   bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      const user = await UserModel.findOne({ chatId });

      if (data === '/again') {
         return startGame(chatId);
      }

      if (data == chats[chatId]) {
         user.right += 1;
         await bot.sendMessage(chatId, `Да. Число ${chats[chatId]}`, againOptions);
      } else {
         user.wrong += 1;
         await bot.sendMessage(chatId, `Нет. Число: ${chats[chatId]}`, againOptions);
      }
      await user.save();
   });
};

const startGame = async chatId => {
   const randomNumber = Math.floor(Math.random() * 10);
   console.log('@@@@ randomNumber', randomNumber);

   chats[chatId] = randomNumber;

   await bot.sendMessage(chatId, `Отгадай цифру от 0 до 10.`, gameOptions);
};

start();
