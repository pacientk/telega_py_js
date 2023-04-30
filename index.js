const TelegramBot = require('node-telegram-bot-api');
const child_process = require('child_process');
const sequelize = require('./db');
const { gameOptions, againOptions } = require('./options');
const moment = require('moment');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const chats = {};

const start = async () => {
    try {
        console.log('@@@@ Connct to DB...')
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        console.log('@@@@ ERROR', e.message);
    }

    bot.setMyCommands([
        { command: '/start', description: 'Start Command' },
        { command: '/info', description: 'Info Command' },
        { command: '/game', description: 'Play a game!' },
    ]);

    bot.onText(/\/start/, async msg => {
        // console.log('@@@@ ', bot);

        const opts = {
            reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
                keyboard: [
                    ['Kiev'],
                    ['Saratov'],
                ],
            }),
        };

        const text = msg.text;
        const chatId = msg.chat.id;
        // await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/1.webp');
        return bot.sendMessage(chatId, `Добрый день, ${msg.from.last_name} ${msg.from.first_name}! \nУкажите город:`, opts);

    });

    bot.onText(/\/game/, async msg => {
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, `Добро пожаловать в игру!`);
        return startGame(chatId);
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Да. Число ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Нет. Число: ${chats[chatId]}`, againOptions);
        }

    });

    bot.onText(/\/info/, async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        return await bot.sendMessage(chatId, `Chat ID: ${chatId}.\nMessage text: ${msg.text} \n${msg.entities}`);
    });

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === 'kir') {
            return await bot.sendMessage(chatId, `Test msg: ${text} ${moment(msg.date).format('DD-MM-YYYY')}`);
        }
        // return bot.sendMessage(chatId, 'What?');
    });

};

const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10);
    console.log('@@@@ randomNumber', randomNumber);

    chats[chatId] = randomNumber;

    await bot.sendMessage(chatId, `Отгадай цифру от 0 до 10.`, gameOptions);
};


start();


// Matches /love
// bot.onText(/\/love/, function onLoveText(msg) {
//     console.log('@@@@ ', msg);
//
//     const opts = {
//         reply_to_message_id: msg.message_id,
//         reply_markup: JSON.stringify({
//             keyboard: [
//                 ['Yes, you are the bot of my life ❤'],
//                 ['No, sorry there is another one...'],
//             ],
//         }),
//     };
//
//     bot.sendMessage(msg.chat.id, 'Do you love me?' /*opts*/);
// });
