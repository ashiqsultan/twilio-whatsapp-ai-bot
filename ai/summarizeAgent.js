const openai = require('../utils/openai');
const summarizeChat = async (
  lastSummary,
  lastMsg,
  userType,
  patientDetails
) => {
  try {
    const context = `You are a helpful assistant who summarizes conversation for a chat app which is used between patients and doctor.
  You need to summarize conversation and identify key entities or properties being mentioned in the conversation
  You are provided with the following details
  - Previous summary: summarized history of the conversation.
  - User Type: Whether the user message is by patient or doctor.
  - Patient Details: Basic details of the patient like name age and gender.
  The user message is the last message in the conversation.
  previousSummary: ${lastSummary},
  userType: ${userType},
  patientDetails: ${JSON.stringify(patientDetails)},
  OUTPUT FORMAT: The output should be in JSON in the following format
  {
    "summary": "summary of the conversation"
  }
  `;
    const openaiRes = await openai(context, lastMsg);
    if (openaiRes && openaiRes.summary) {
      return openaiRes.summary;
    }
    return '';
  } catch (error) {
    throw error;
  }
};

module.exports = summarizeChat;
