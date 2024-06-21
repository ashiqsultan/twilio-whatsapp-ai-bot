const openaiHelper = require('../utils/openaiHelper');
const doctorMsgHandlerAgent = async (doctorReply) => {
  try {
    const context = `You are a helpful assistant who helps the patient understand the reply doctor gave to the patient.
    The user message provided to you is the reply doctor gave to the patient
    Your objective two objective
    Objective 1. Identify the patient id given by doctor in the message. the id should be a six character long combination of alphabets and numbers or only alphabets.
    Example patient ids for reference eptokj , mg5o7j
    Objective 2. Summarize the Doctor reply and prepare a message for a patient.
    OUTPUT FORMAT: The output should be in JSON in the following format
    {
      "patient_id": "patient id given by doctor",
      "summary": "summary of the doctor reply for the patient"
    }
    `;
    const openaiRes = await openaiHelper(context, doctorReply);
    if (openaiRes) {
      return openaiRes;
    }
    return '';
  } catch (error) {
    throw error;
  }
};

module.exports = doctorMsgHandlerAgent;
