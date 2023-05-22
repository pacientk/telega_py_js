require('dotenv').config();
const sequelize = require('./src/db');
const TelegramBot = require('node-telegram-bot-api');

const steps = require('./src/steps');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

console.log('@@@@ ::::', steps);

const connectDB = async () => {
   try {
      console.log('Connection..');
      await sequelize.authenticate();
      await sequelize.sync();
      console.log(':::> Connection has been established successfully.');
   } catch (error) {
      console.error('Unable to connect to the database:', error);
   }
};

bot.onText(/\/start/, msg => {
   connectDB();
   steps.start(bot, msg);
});

bot.on('message', msg => {
   const step = steps.getCurrentStep(chatId);

   if (step === 1) {
      steps.handleStep1(bot, chatId, msg.text);
   } else if (step === 2) {
      steps.handleStep2(bot, chatId, msg.text);
   } else if (step === 3) {
      steps.handleStep3(bot, chatId, msg.text);
   }
});
