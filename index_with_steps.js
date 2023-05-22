require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const steps = require('./src/steps');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

console.log('@@@@ ::::', steps);

bot.onText(/\/start/, msg => {
   steps.start(bot, msg);
});

bot.on('message', msg => {
   const chatId = msg.chat.id;
   const step = steps.getCurrentStep(chatId);

   if (step === 1) {
      steps.handleStep1(bot, chatId, msg.text);
   } else if (step === 2) {
      steps.handleStep2(bot, chatId, msg.text);
   } else if (step === 3) {
      steps.handleStep3(bot, chatId, msg.text);
   }
});
