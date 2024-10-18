require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your BotFather token
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Function to show the main menu
function showMainMenu(chatId) {
  const options = {
    reply_markup: {
      keyboard: [
        ["Text", "Image", "Audio"],
        ["Help", "kidding?"],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  bot.sendMessage(chatId, "Please choose an option:", options);
}

// Listen for the "/start" command to show the menu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  showMainMenu(chatId);
});

// Listen for text messages to respond to menu options
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "Image") {
    bot.sendMessage(chatId, "You selected Image");
  } else if (text === "Text") {
    bot.sendMessage(chatId, "You selected Text");
  } else if (text === "Audio") {
    bot.sendMessage(chatId, "You selected Audio");
  } else if (text === "Help") {
    bot.sendMessage(chatId, "Here is some help information...");
  }
});
