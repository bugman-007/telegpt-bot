require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const { longLifeCoinPromotion } = require("./config");

const { textController } = require("./controller/textController");
const { imageController } = require("./controller/imageController");
const { audioController } = require("./controller/audioController");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const chatState = {};
const subscribers = [];

if (fs.existsSync("subscribers.json")) {
  subscribers = JSON.parse(fs.readFileSync("subscribers.json"));
}

const modes = {
  TEXT: "text",
  IMAGE: "image",
  AUDIO: "audio",
  QUIT: null,
};

function sendPromotionToSubscribers() {
  subscribers.forEach((subscriberId) => {
    bot.sendMessage(subscriberId, longLifeCoinPromotion, {
      parse_mode: "Markdown",
    });
  });
  console.log("Promotion message sent to all subscribers!");
}

function showMainMenu(chatId) {
  const options = {
    reply_markup: {
      keyboard: [
        ["/text", "/image", "/audio"],
        ["/info", "/quit"],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  bot.sendMessage(chatId, "Please choose an option:", options);
}

setInterval(() => {
  sendPromotionToSubscribers();
}, 10000); // 1 hour = 60 * 60 * 1000 milliseconds

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, longLifeCoinPromotion, { parse_mode: "Markdown" });
});

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
      break;

    case "/audio":
      chatState[chatId].mode = modes.AUDIO;
      bot.sendMessage(chatId, "You selected Audio.");
      break;

    case "/quit":
      chatState[chatId].mode = modes.QUIT; // Reset the mode
      bot.sendMessage(chatId, "You have exited the current mode.");
      break;

    default:
      if (chatState[chatId].mode === modes.TEXT) {
        const generatedText = await textController(text);
        bot.sendMessage(chatId, generatedText, { parse_mode: "Markdown" });
      }

      if (chatState[chatId].mode === modes.IMAGE) {
        const imageUrl = await imageController(text);
        if (imageUrl) {
          bot.sendMessage(chatId, imageUrl); // Send the generated image URL
        } else {
          bot.sendMessage(
            chatId,
            "Sorry, there was an error generating the image."
          );
        }
      }
      if (chatState[chatId].mode === modes.AUDIO) {
        const audioPath = await audioController(text);
        await bot.sendAudio(chatId, audioPath);
      }
      break;
  }
});
