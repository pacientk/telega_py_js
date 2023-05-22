require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const steps = require('./src/steps');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, msg => {
   steps.setCurrentStep(msg.chat.id, 0);
   steps.start(bot, msg);
});

bot.on('callback_query', query => {
   const chatId = query.message.chat.id;
   const data = query.data;

   if (data === 'begin') {
      bot.sendMessage(chatId, 'beginbeginbeginbegin');
   }
});

bot.on('message', msg => {
   const chatId = msg.chat.id;
   const step = steps.getCurrentStep(chatId);

   if (step === 1) {
      steps.handleStep1(bot, chatId, msg.text);
   } else if (step === 2) {
      steps.handleStep2(bot, chatId, msg.text);
   } else if (step === 3) {
      steps.handleStep3(bot, msg);
   }
});
