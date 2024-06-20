const englishTranslateAgent = async (text, languageToTranslate) => {
  try {
    const openaiHelperPath = Runtime.getFunctions()['utils/openaiHelper'].path;
    const openaiHelper = require(openaiHelperPath);

    const context = `You are an helpful translator.
      Objective: You need to translate the user message to ${languageToTranslate}.
      OUTPUT FORMAT: The output should be in JSON in the following format.
      {
        "message": "Translated message",
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
