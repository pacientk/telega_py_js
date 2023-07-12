require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { networkOptions, createWallerOptions } = require('./src/options');

const steps = require('./src/steps');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, msg => {
   steps.setCurrentStep(msg.chat.id, 0);
   steps.start(bot, msg);
});

/**
 * Buttons handlers
 */
bot.on('callback_query', query => {
   const chatId = query.message.chat.id;
   const data = query.data;

   if (data === 'begin') {
      bot.sendMessage(chatId, 'Укажите номер заявки.');
   }
   if (data === 'ethereum') {
      // steps.setCurrentStep(chatId, 3);
      bot.sendMessage(chatId, 'Вы указали Ethereum');

      bot.sendMessage(
         chatId,
         'Укажите сеть.\n\n *Очень важно указать правильную сеть, иначе средтва могут быть безвозвратно утеряны.',
         networkOptions
      );
   }
   if (data === 'erc20') {
      bot.sendMessage(chatId, 'Вы указали ERC20');
      bot.sendMessage(chatId, 'Убедитесь, что все данные заполнены верно:');
      bot.sendMessage(chatId, 'Создать временный кошелек.', createWallerOptions);
   }
   if (data === 'createWallet') {
      steps.setCurrentStep(chatId, 4);
      bot.sendMessage(chatId, 'Запрос обрабатывается. Это может занять какое-то время.');
      steps.getTransactionUserData(bot, query.message);
      steps.getWallet(bot, query.message);
      // bot.sendMessage(chatId, 'Создать временный кошелек.', createWallerOptions);
   }
});

bot.on('message', msg => {
   const chatId = msg.chat.id;
   const step = steps.getCurrentStep(chatId);

   if (step === 1) {
      steps.userGetRequstId_askSum_step_1(bot, msg);
   } else if (step === 2) {
      steps.userGetSum_askCoin_step_2(bot, msg);
   } else if (step === 3) {
      steps.handleStep3(bot, msg);
   }
});
