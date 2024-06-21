const openaiHelper = require('../utils/openaiHelper');
const translateAgent = async (text, languageToTranslate) => {
  try {
    const context = `You are an helpful translator.
      Objective: You need to translate the user message to ${languageToTranslate}.
      OUTPUT FORMAT: The output should be in JSON in the following format.
      {
        "message": "Translated message",
      }
      `;
    const openaiRes = await openaiHelper(context, text);
    if (openaiRes && openaiRes.message) {
      return openaiRes.message;
    }
    return '';
  } catch (error) {
    throw error;
  }
};

module.exports = translateAgent;
