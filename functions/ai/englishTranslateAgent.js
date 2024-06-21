const openaiHelper = require('../utils/openaiHelper');
const englishTranslateAgent = async (text) => {
  try {
    const context = `You are an helpful assistant who translates user message to English.
    Objective: You need to identify the language of the user message and translate the message to English. 
    If the message is already in English then just return the message as it is.
    Note: The identified input language name should be in lowercase and should have the complete name and not the abbreviation.
    Example inputlanguage: spanish or inputlanguage: french or inputlanguage: english
    OUTPUT FORMAT: The output should be in JSON in the following format.
    {
      "message": "Translated message or original message if it is already in English",
      inputLanguage: "Language of the user message.",
    }
    `;
    const openaiRes = await openaiHelper(context, text);
    if (openaiRes) {
      return openaiRes;
    }
    return '';
  } catch (error) {
    throw error;
  }
};

module.exports = englishTranslateAgent;
