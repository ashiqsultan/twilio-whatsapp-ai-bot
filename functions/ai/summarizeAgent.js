const summarizeChat = async (
  lastSummary,
  lastMsg,
  userType,
  patientDetails
) => {
  try {
    const openaiHelperPath = Runtime.getFunctions()['utils/openaiHelper'].path;
    const openaiHelper = require(openaiHelperPath);

    const context = `You are a helpful assistant who helps to summarize conversation for a clinical chat app which is used by patients
  You are provided with the following details
  - Previous summary: summarized history of the conversation between the patient and bot
  - Patient Details: Basic details of the patient like name age and gender.
  - The user message is the last message said by the patient in the conversation.
  You need to summarize the previous summary and the user message and identify key entities or properties being mentioned in the conversation.
  Remember this is for a clinical app so give importance to medical terminology.
  previousSummary: ${lastSummary},
  patientDetails: ${JSON.stringify(patientDetails)},
  OUTPUT FORMAT: The output should be in JSON in the following format
  {
    "summary": "summary of the conversation"
  }
  `;
    const openaiRes = await openaiHelper(context, lastMsg);
    if (openaiRes && openaiRes.summary) {
      return openaiRes.summary;
    }
    return '';
  } catch (error) {
    throw error;
  }
};

module.exports = summarizeChat;
