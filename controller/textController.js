require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an async function to handle the OpenAI request
async function textController(userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `${userMessage}` },
      ],
      model: "gpt-4o",
    });
    const completionMessage = completion.choices[0].message.content;
    const result = completionMessage.replace(/\*\*(.*?)\*\*/g, "*$1*");
    return result;
  } catch (error) {
    console.error("Error generating text:", error);
  }
}

module.exports = { textController };
