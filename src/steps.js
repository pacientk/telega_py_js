const UserModel = require('../src/Models/User');
const RequestModel = require('../src/Models/Request');
const constant = require('../src/constants');
const sequelize = require('./db');

let steps = {};

steps.start = async function(bot, msg) {
   const userId = msg.from.id;
   const chatId = msg.chat.id;
   const firstName = msg.from.first_name;
   const lastName = msg.from.last_name;

   try {
      console.log(':::> Connection..');
      await sequelize.authenticate();
      await sequelize.sync();
      console.log(':::> Connection has been established successfully.');
   } catch (error) {
      console.error('Unable to connect to the database:', error);
   }

   bot.setMyCommands([
      { command: '/start', description: 'Start Command!!' },
      // { command: '/info', description: 'Info Command@@' },
      // { command: '/game', description: 'Play a game!' },
   ]);

   await bot.sendMessage(chatId, 'Шаг первый: Приветственное сообщение.');
   await bot.sendMessage(chatId, 'Шаг второй: Укажите номер заявки.');

   const isUser = await UserModel.findOne({ where: { chatId } });

   if (isUser) {
      await steps.setCurrentStep(chatId, 1);
   } else {
      await bot.sendMessage(chatId, 'New user');
      await UserModel.create({ where: { userId, chatId, firstName, lastName } });
      await steps.setCurrentStep(chatId, 1);
   }
};

steps.handleStep1 = async function(bot, chatId, message) {
   if (constant.REGEX_DIGITS_ONLY.test(message)) {
      await steps.setCurrentStep(chatId, 2);
      await bot.sendMessage(chatId, 'Номер заявки принят.');
      await bot.sendMessage(chatId, 'Шаг третий: Введите сумму.');
   } else {
      await bot.sendMessage(chatId, 'Ошибка! Номер заявки должен состоять только из цифр.');
   }
};

steps.handleStep2 = async function(bot, chatId, message) {
   if (constant.REGEX_DIGITS_ONLY.test(message)) {
      steps.setCurrentStep(chatId, 3);
      bot.sendMessage(chatId, 'Правильно указана сумма.');
   } else {
      bot.sendMessage(chatId, 'Ошибка! Сумма должна состоять только из цифр.');
   }
};

steps.handleStep3 = async function(bot, msg) {
   console.log('@@@@ ***********', msg);
   const userId = msg.from.id;
   const chatId = msg.chat.id;
   const requestId = msg.text;

   const step2Data = steps.getStepData(chatId, 2);

   await bot.sendMessage(chatId, `Номер заявки: ${step2Data}`);
   await bot.sendMessage(chatId, `Сумма: ${msg.text}`);

   const isRequestExists = await RequestModel.findOne({ where: { requestId } });

   if (isRequestExists) {
      await bot.sendMessage(chatId, 'Такая заявка уже существует.');
   } else {
      await RequestModel.create({ where: { userId, chatId, requestId } });
   }

   // Вы можете добавить свою логику обработки шага 4 здесь

   // Завершаем пошаговый Flow
   steps.setCurrentStep(chatId, 0);
};

steps.setCurrentStep = function(chatId, step) {
   if (!steps[chatId]) {
      steps[chatId] = {};
   }

   steps[chatId].currentStep = step;
};

steps.getCurrentStep = function(chatId) {
   return steps[chatId] ? steps[chatId].currentStep : 0;
};

steps.getStepData = function(chatId, step) {
   if (steps[chatId] && steps[chatId][step]) {
      return steps[chatId][step];
   } else {
      return null;
   }
};

module.exports = steps;
