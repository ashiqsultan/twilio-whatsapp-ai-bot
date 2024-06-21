const openaiHelper = require('../utils/openaiHelper');
const chooseDoctorAgent = async (chatSummary, doctorList) => {
  try {
    const context = `You are a helpful assistant who helps to choose the right doctor for a clinical chat app which is used by patients
    You are provided with the following details
    - ChatSummary: Chat summary of the conversation between the patient and bot
    - doctorList: List of Doctors with their phone_no and details fetched from DB
    Your objective is to identify one doctor from the list that is most relevant to the chat summary
    Do not use a imaginary doctor in your response only use the name and phone_no of the doctor in the doctorList
    OUTPUT FORMAT: The output should be in JSON in the following format
    {
      "name": "name of the doctor",
      "phone_no": "phone number of the doctor"
    }
    chatSummary: ${chatSummary},
    doctorList: ${JSON.stringify(doctorList)},
    `;
    const openaiRes = await openaiHelper(context, '');
    if (openaiRes) {
      return openaiRes;
    }
    return '';
  } catch (error) {
    throw error;
  }
};

module.exports = chooseDoctorAgent;
