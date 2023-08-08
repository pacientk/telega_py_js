const UserModel = require('../src/Models/User');
const RequestModel = require('../src/Models/Request');
const constant = require('../src/constants');
const sequelize = require('./db');
const { welcomeOptions, coinsOptions, STEP_NAME } = require('./options');

let steps = {};
let userData = {};

steps.start = async function(bot, msg) {
   const userId = msg.from.id;
   const chatId = msg.chat.id;
   const firstName = msg.from.first_name;
   const lastName = msg.from.last_name;

   try {
      console.log('@@@ :::> Connection..');
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('@@@ :::> Connection has been established successfully.');
   } catch (error) {
      console.error('@@@ Unable to connect to the database:', error);
   }

   await UserModel.create({
      userId,
      chatId,
      firstName,
      lastName,
   });

   bot.setMyCommands([
      { command: '/start', description: 'Start Command!!' },
      // { command: '/info', description: 'Info Command@@' },
      // { command: '/game', description: 'Play a game!' },
   ]);

   await steps.setCurrentStep(chatId, STEP_NAME.GET_ORDER_ID);

   await bot.sendMessage(
      chatId,
      'Здравствуйте!\n\nПриветственное сообщение.\n\nПриветственное сообщение.\n\nПриветственное сообщение.\n\nНачнем?\n',
      welcomeOptions
   );

   // const isUser = await UserModel.findOne({ where: { chatId } });
   //
   // if (isUser) {
   //    await steps.setCurrentStep(chatId, 1);
   //    userData = {};
   // } else {
   //    await bot.sendMessage(chatId, 'New session for user');
   //    await UserModel.create({
   //       userId,
   //       chatId,
   //       firstName,
   //       lastName,
   //    });
   //    await steps.setCurrentStep(chatId, 1);
   // }
};

steps.userGetRequstId_askSum_step_1 = async function(bot, msg) {
   // const userId = msg.from.id;
   const chatId = msg.chat.id;
   const requestId = msg.text;

   // console.log('@@@@ USERDATA userGetRequstId_askSum_step_1 ::::', userData);

   if (constant.REGEX_DIGITS_ONLY.test(requestId)) {
      // const dbUserId = await UserModel.findOne({ userId });
      // userData[dbUserId?.dataValues.id] = { requestId, userId, chatId };

      await bot.sendMessage(chatId, `Номер заявки <b>#${requestId}</b> принят.`, {
         parse_mode: 'HTML',
      });
      await bot.sendMessage(chatId, 'Введите сумму.');
      await steps.setCurrentStep(chatId, STEP_NAME.GET_SUM);
   } else {
      await bot.sendMessage(chatId, 'Ошибка! Номер заявки должен состоять только из цифр.');
   }
};

steps.userGetSum_askCoin_step_2 = async function(bot, msg) {
   // const userId = msg.from.id;
   const chatId = msg.chat.id;
   const sum = msg.text;

   // const user = await UserModel.findOne({ where: { userId } });
   // userData[user.dataValues.id] = { ...userData[user.dataValues.id], sum };

   // console.log('@@@@ USERDATA userGetSum_askCoin_step_2 ::::', userData);

   if (constant.REGEX_DIGITS_ONLY.test(sum)) {
      steps.setCurrentStep(chatId, STEP_NAME.SET_COIN);
      await bot.sendMessage(chatId, `Сумма <b>${sum}</b> принята.`, { parse_mode: 'HTML' });
      await bot.sendMessage(chatId, 'Выберете монету для транзакции.\n\n', coinsOptions);
   } else {
      await bot.sendMessage(chatId, 'Ошибка! Сумма должна состоять только из цифр.');
   }
};

steps.handleStep3 = async function(bot, msg) {
   const userId = msg.from.id;
   const chatId = msg.chat.id;
   const requestId = msg.text;

   console.log('@@@@ msg.text >>>>>>>', msg.text);

   // const user = await UserModel.findOne({ where: { userId } });
   // userData[user.dataValues.id] = { ...userData[user.dataValues.id], sum };
   //
   // console.log('@@@@ USERDATA handleStep3 ::::', userData);

   const step2Data = steps.getStepData(chatId, 2);

   await bot.sendMessage(chatId, `Номер заявки step2Data: ${step2Data}`);
   await bot.sendMessage(chatId, `Сумма: ${msg.text}`);

   const isRequestExists = await RequestModel.findOne({ where: { requestId } });

   if (isRequestExists) {
      await bot.sendMessage(chatId, 'Такая заявка уже существует.');
   } else {
      await RequestModel.create({ where: { userId, chatId, requestId } });
   }

   // Завершаем пошаговый Flow
   // steps.setCurrentStep(chatId, 0);
};

steps.getWallet = async function(bot, msg) {
   // const userId = msg.from.id;
   const chatId = msg.chat.id;
   // const requestId = msg.text;

   // console.log('@@@@ USERDATA ::::', userData);

   // const step2Data = steps.getStepData(chatId, 2);

   await bot.sendMessage(chatId, 'КОШЕЛЕК!!!');

   // const isRequestExists = await RequestModel.findOne({ where: { requestId } });
   //
   // if (isRequestExists) {
   //    await bot.sendMessage(chatId, 'Такая заявка уже существует.');
   // } else {
   //    await RequestModel.create({ where: { userId, chatId, requestId } });
   // }

   // Завершаем пошаговый Flow
   // steps.setCurrentStep(chatId, 0);
};

steps.getTransactionUserData = async function(bot, msg) {
   // const userId = msg.from.id;
   const chatId = msg.chat.id;
   // const requestId = msg.text;

   // const step2Data = steps.getStepData(chatId, 2);

   console.log('@@@@ USERDATA ::::', userData);

   await bot.sendMessage(chatId, 'getTransactionUserData');

   // const isRequestExists = await RequestModel.findOne({ where: { requestId } });
   //
   // if (isRequestExists) {
   //    await bot.sendMessage(chatId, 'Такая заявка уже существует.');
   // } else {
   //    await RequestModel.create({ where: { userId, chatId, requestId } });
   // }

   // Завершаем пошаговый Flow
   // steps.setCurrentStep(chatId, 0);
};

steps.setCurrentStep = function(chatId, step) {
   if (!steps[chatId]) {
      steps[chatId] = {};
   }

   steps[chatId].currentStep = step;

   console.log('@@@@ CURRENT STEP', steps[chatId].currentStep);
};

steps.getCurrentStep = chatId => {
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
