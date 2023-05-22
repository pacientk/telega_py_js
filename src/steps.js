const UserModel = require('../src/models');
const sequelize = require('./db');

let steps = {};

steps.start = async function(bot, msg) {
   console.log('@@@@ ', msg);

   try {
      console.log('Connection..');
      await sequelize.authenticate();
      await sequelize.sync();
      console.log(':::> Connection has been established successfully.');
   } catch (error) {
      console.error('Unable to connect to the database:', error);
   }

   const userId = msg.from.id;
   const chatId = msg.chat.id;
   const firstName = msg.from.first_name;
   const lastName = msg.from.last_name;

   bot.sendMessage(chatId, 'Шаг первый: Приветственное сообщение.');

   const isUser = await UserModel.findOne({ where: { chatId } });

   if (!!isUser) {
      bot.sendMessage(chatId, 'New user');
      steps.setCurrentStep(chatId, 1);
   } else {
      await UserModel.create({ userId, chatId, firstName, lastName });
      steps.setCurrentStep(chatId, 1);
   }
};

steps.handleStep1 = function(bot, chatId, message) {
   bot.sendMessage(chatId, 'Шаг второй: Укажите номер заявки.');

   if (/^\d+$/.test(message)) {
      steps.setCurrentStep(chatId, 2);
      bot.sendMessage(chatId, 'Правильно указан номер заявки.');
   } else {
      bot.sendMessage(chatId, 'Ошибка! Номер заявки должен состоять только из цифр.');
   }
};

steps.handleStep2 = function(bot, chatId, message) {
   bot.sendMessage(chatId, 'Шаг третий: Введите сумму.');

   if (/^\d+$/.test(message)) {
      steps.setCurrentStep(chatId, 3);
      bot.sendMessage(chatId, 'Правильно указана сумма.');
   } else {
      bot.sendMessage(chatId, 'Ошибка! Сумма должна состоять только из цифр.');
   }
};

steps.handleStep3 = function(bot, chatId, message) {
   const step2Data = steps.getStepData(chatId, 2);

   bot.sendMessage(chatId, `Номер заявки: ${step2Data}`);
   bot.sendMessage(chatId, `Сумма: ${message}`);

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
