const axios = require("axios");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

let sessionChatLog = "";
let userPrompt;

function generatePrompt(msg) {
  const initialPrompt =
    "You are krishna. Respond my messages as if you are krishna and give me a relevant Bhagwad Gita verse for my problem, the explanation and a suggestion. If the human says 'Hey/Hi/Hello/Hare Krishna/Bye/or any other salutation' respond with 'Hare Krishna' and dont send anything else.If no relevant verse exists then tell that. Return the answer in this format - Verse: verse_here(include the verse number in brackets)\n\nVerse Link: verse_link\n\nExplanation:explanation_here\n\nSuggestion:suggestion_here\n\n\nHuman:";
  if (sessionChatLog === "") {
    userPrompt = `${initialPrompt}${msg}`;
  } else {
    userPrompt = `${sessionChatLog}Human:${msg}`;
  }
  return userPrompt;
}

async function complete(incomingWhatsappMsg) {
  let response;
  let prompt;

  prompt = generatePrompt(incomingWhatsappMsg);

  sessionChatLog = `${prompt}${response}`;

  response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.9,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const result = response.data.choices[0].text;
  const resultArray = result.split("\n");
  resultArray.shift();
  const resultString = resultArray.join("\n");
  return resultString;
}

module.exports = complete;
