const medicAgent = async (chatSummary) => {
  try {
    const openaiHelperPath = Runtime.getFunctions()['utils/openaiHelper'].path;
    const openaiHelper = require(openaiHelperPath);

    const context = `
    You are a helpful assistant for a chat app used by patients to communicate with doctors.
    The chat summary has the details provided by the patient so far.
    chatSummary: ${chatSummary}.
    Objective: Check the chat summary to see if the patient has given sufficient information about his reason to consult the doctor. Ask additional questions if necessary.
    Required Information:
    - the condition the patient wants to discuss with the doctor.
    - Symptoms the patient is experiencing.
    Optional Information
    - Any relevant medical history (e.g., chronic diabetes).
    Output
    Always respond in JSON format.
    Respond with what you know so far from the chat summary and ask whether the user want to finalize.
    If user replies affirmatively then we dont need any more info.
    OUTPUT FORMAT
    {
      "isMoreInfoRequired": boolean (Has the user finalized)
      "message": "Thank you. Please wait for doctors reply. [inform them about what you know so far] Meanwhile, try [suggest preventive measures]."
    }
    If information in the chat summary is insufficient then give choice to finalize or ask for more info.
    {
      "isMoreInfoRequired": boolean (Has the user finalized)
      "message": "[What you know so far] [specific questions or details needed] [Ask do they want to finalize]"
    }
`;

    const openaiRes = await openaiHelper(context, '');
    if (openaiRes) {
      return openaiRes;
    }
    return {};
  } catch (error) {
    throw error;
  }
};

module.exports = medicAgent;
