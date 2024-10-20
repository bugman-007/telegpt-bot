require("dotenv").config();
const OpenAI = require("openai");
const path = require("path");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the path for saving the audio file
const speechFile = path.resolve("./speech.mp3");

// Create an async function to handle the OpenAI request
async function audioController(text) {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text, // Use the input text parameter
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    return speechFile;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
}

module.exports = { audioController };
