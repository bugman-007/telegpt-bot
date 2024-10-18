require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { textController } = require("./controller/textController");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const chatState = {};

const modes = {
  TEXT: "text",
  IMAGE: "image",
  AUDIO: "audio",
  QUIT: null,
};

function showMainMenu(chatId) {
  const options = {
    reply_markup: {
      keyboard: [["/text", "/image", "/audio", "/quit"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  bot.sendMessage(chatId, "Please choose an option:", options);
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  chatState[chatId] = { mode: modes.QUIT }; // Initialize state
  showMainMenu(chatId);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  // Ensure that the user has started the bot
  if (!chatState[chatId]) return;

  switch (text) {
    case "/text":
      chatState[chatId].mode = modes.TEXT;
      bot.sendMessage(
        chatId,
        "You are now in Text mode. Please input your text prompt."
      );
      break;

    case "/image":
      chatState[chatId].mode = modes.IMAGE;
      bot.sendMessage(chatId, "Please input your prompt for image generation.");
      // Add further logic here to handle image generation
      break;

    case "/audio":
      chatState[chatId].mode = modes.AUDIO;
      bot.sendMessage(chatId, "You selected Audio.");
      // Add further logic here to handle audio generation
      break;

    case "/quit":
      chatState[chatId].mode = modes.QUIT; // Reset the mode
      bot.sendMessage(chatId, "You have exited the current mode.");
      break;

    default:
      if (chatState[chatId].mode === modes.TEXT) {
        const generatedText = await textController(text);
        bot.sendMessage(chatId, generatedText, { parse_mode: "HTML" });
      }
      break;
  }
});
