module.exports = {
   gameOptions: {
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [
               { text: '1', callback_data: '1' },
               { text: '2', callback_data: '2' },
               { text: '3', callback_data: '3' },
            ],
            [
               { text: '4', callback_data: '4' },
               { text: '5', callback_data: '5' },
               { text: '6', callback_data: '6' },
            ],
            [
               { text: '7', callback_data: '7' },
               { text: '8', callback_data: '8' },
               { text: '9', callback_data: '9' },
            ],
            [{ text: '10', callback_data: '10' }],
         ],
      }),
   },

   welcomeOptions: {
      reply_markup: JSON.stringify({
         inline_keyboard: [[{ text: 'Начать', callback_data: 'begin' }]],
      }),
   },

   coinsOptions: {
      reply_markup: JSON.stringify({
         inline_keyboard: [[{ text: 'ETH', callback_data: 'ethereum' }]],
      }),
   },

   networkOptions: {
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [
               { text: 'ERC20', callback_data: 'erc20' },
               { text: 'BEP20', callback_data: 'bep20' },
            ],
         ],
      }),
   },

   createWallerOptions: {
      reply_markup: JSON.stringify({
         inline_keyboard: [[{ text: 'Создать', callback_data: 'createWallet' }]],
      }),
   },
};
