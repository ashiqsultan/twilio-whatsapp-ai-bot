const openaiHelper = require('../utils/openaiHelper');
const patientDetailsAgent = async (chatSummary, patientDetails) => {
  try {
    const context = `You will receive two user inputs
    - 1. chatSummary: Summary of the chat so far between patient and bot
    - 2. patientDetails: Available patient details in JSON format
    SYSTEM INPUT: REQUIRED PROPERTIES = name, age, gender
    Your objective is to identify the required properties in the chatSummary and patientDetails and return the updated patient details in JSON format in the output.
    The final output should have 3 fields
    - patientDetails: updated patient details.
    - isPatientDetailsComplete: boolean true or false. If the updated patient details contains all the required properties then this is true else false
    - question: if the updated patient details is not complete then ask a friendly question to the user to provide the missing properties. if the updated patient details is complete then question value should be null

    Output JSON format:
    {
    patientDetails: { name: "patient name", age: "patient age", gender: "patient gender" },
    isPatientDetailsComplete: boolean based on if the updated patient details contains all the required properties
    question: question about missing properties or null,
    }`;

    const message = `
    INPUTS
    chatSummary: ${chatSummary},
    patientDetails: ${JSON.stringify(patientDetails)}`;

    const openaiRes = await openaiHelper(context, message);
    if (openaiRes) {
      return openaiRes;
    }
    return {};
  } catch (error) {
    throw error;
  }
};

module.exports = patientDetailsAgent;
