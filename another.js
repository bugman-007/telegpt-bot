require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your BotFather token
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Function to show the main menu
function showMainMenu(chatId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Text", callback_data: "text" },
          { text: "Image", callback_data: "image" },
          { text: "Audio", callback_data: "audio" },
        ],
        [{ text: "ReadMe", callback_data: "readme" }],
      ],
    },
  };

  bot.sendMessage(chatId, "Please choose generator:", options);
}

// Listen for the "/start" command to show the menu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  showMainMenu(chatId);
});

// Handle callback data from inline keyboard
bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  // Respond to user's selection
  if (data === "text") {
    bot.sendMessage(chatId, "You selected text mode");
  } else if (data === "image") {
    bot.sendMessage(chatId, "You selected image mode");
  } else if (data === "audio") {
    bot.sendMessage(chatId, "You selected audio mode");
  } else if (data === "readme") {
    bot.sendMessage(chatId, "Here is some readme information...");
  }

  // Acknowledge the callback
  bot.answerCallbackQuery(callbackQuery.id);
});
