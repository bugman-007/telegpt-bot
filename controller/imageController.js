require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an async function to handle the OpenAI request
async function imageController(imagePrompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${imagePrompt}`,
      n: 1,
      size: "1024x1024",
    });
    image_url = response.data[0].url;
    return image_url;
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

module.exports = { imageController };
