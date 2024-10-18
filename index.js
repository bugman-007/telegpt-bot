require("dotenv").config();
const OpenAI = require("openai");
const TelegramBot = require("node-telegram-bot-api");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an async function to handle the OpenAI request
async function generateHaiku() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "assistant", content: fullInformation },
        { role: "user", content: `${userMessage}` },
      ],
      model: "gpt-4o",
    });
    const completionMessage = completion.choices[0].message;
    console.log(completionMessage.content);
  } catch (error) {
    console.error("Error generating haiku:", error);
  }
}

// Call the async function
generateHaiku();

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your BotFather token
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Listen for any kind of message
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  console.log(chatId, text);

  // Only respond to messages in groups
  if (text === "hi") {
    bot.sendMessage(chatId, "hello, I am gungho0619 bot");
  }
});

bot.onText(/\/photo/, (msg) => {
  const chatId = msg.chat.id;

  // Path to the photo you want to send
  const photoPath = "./eagle.png";

  // Send the photo
  bot
    .sendPhoto(chatId, photoPath)
    .then(() => {
      console.log("Photo sent successfully");
    })
    .catch((error) => {
      console.error("Error sending photo:", error);
    });
});
