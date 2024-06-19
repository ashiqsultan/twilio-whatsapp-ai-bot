const openai = require('../utils/openai');
const patientDetailsAgent = async (chatSummary, patientDetails) => {
  try {
    const context = `You are a helpful assistant. You will be provided with two inputs chatSummary and patientDetails.
    INSTRUCTIONS
    You need to check whether the patientDetails object contains the following properties with proper values
    Must have properties in patientDetails are [name, age, gender, country].
    The chatSummary may or may not contain these properties.
    Your role is to do Named Entity Recognition from the chatSummary and update the required properties in patientDetails object. The patient Name should be a proper name of a person and it cannot be "patient" or "patient name"
    Add the properties to patientDetails only if it exists in chatSummary else dont include the property
    After you identify the properties from chatSummary and update the patientDetails object. Check if the patientDetails object contains all the must have properties.
    There are two possible outcomes for this agent.
    Case01: patientDetails object still contains missing properties. The output json for this case should contain three properties 
    1. patientDetails: the updated patientDetails object.
    2. question: a string, A question to ask the patient to provide the required properties. The question should be in second person 
    3. isPatientDetailsComplete: boolean true or false
    OUTPUT JSON FORMAT for Case01
    {
      patientDetails: {
        name: "patient name" or null,
        age: "patient age or null",
        gender: "patient gender or null",
        country: "patient country or null"
      },
      question: "question for missing properties",
      isPatientDetailsComplete: false
    }
    Case02: patientDetails object contains all the must have properties.
    In this case your output json should contain three properties
    1. patientDetails 
    2. question will be null
    3. isPatientDetailsComplete: true
    OUTPUT JSON FORMAT for Case02
    {
      patientDetails: {
        name: "patient name",
        age: "patient age",
        gender: "patient gender",
        country: "patient country"
      },
      question: null,
      isPatientDetailsComplete: true
    }
    `;

    const message = `
    INPUTS
    chatSummary: ${chatSummary},
    patientDetails: ${JSON.stringify(patientDetails)}`;

    const openaiRes = await openai(context, message);
    if (openaiRes) {
      return openaiRes;
    }
    return {};
  } catch (error) {
    throw error;
  }
};

module.exports = patientDetailsAgent;
