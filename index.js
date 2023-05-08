require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./src/options');
const sequelize = require('./src/db');
const UserModel = require('./src/models');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const chats = {};

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
      const text = msg.text;
      const chatId = msg.chat.id;

      try {
         if (text === '/start') {
            const isUser = await UserModel.findOne({ chatId });

            if (isUser !== null) {
               await bot.sendMessage(chatId, 'Well come back!');
            } else {
               await UserModel.create({ chatId });

               await bot.sendSticker(
                  chatId,
                  'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/1.webp'
               );

               await bot.sendMessage(
                  chatId,
                  `Добрый день, ${msg.from.last_name} ${msg.from.first_name}!`
               );
            }

            const opts = {
               reply_to_message_id: msg.message_id,
               reply_markup: JSON.stringify({
                  keyboard: [['Kiev'], ['Saratov']],
               }),
            };

            return bot.sendMessage(chatId, `Укажите город:`, opts);
         }

         if (text === '/info') {
            const user = await UserModel.findOne({ chatId });
            return await bot.sendMessage(
               chatId,
               `Chat ID: ${chatId}.
               Message text: ${msg.text}. 
               Message from: ${msg.from.first_name} ${msg.from.last_name}. 
               Right answers: ${user.right} 
               Wrong answers: ${user.wrong}`
            );
         }

         if (text === '/game') {
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
