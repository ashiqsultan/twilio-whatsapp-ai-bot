const { isEqual } = require('lodash');

const patientDetailsCheck = async (chatSummary, patientDetails, phone_no) => {
  try {
    const patientServicePath = Runtime.getFunctions()['services/patient'].path;
    const patientService = require(patientServicePath);

    const patientDetailsAgentPath =
      Runtime.getFunctions()['ai/patientDetailsAgent'].path;
    const patientDetailsAgent = require(patientDetailsAgentPath);

    let updatedPatientDetails = {};
    const agentResponse = await patientDetailsAgent(
      chatSummary,
      patientDetails
    );
    console.log('agentResponse', agentResponse);

    if (!isEqual(patientDetails, agentResponse.patientDetails)) {
      updatedPatientDetails = agentResponse.patientDetails;
      const updateOp = await patientService.updatePatientDetailsByPhoneNo(
        phone_no,
        updatedPatientDetails
      );
    }
    return agentResponse;
  } catch (error) {
    throw error;
  }
};

module.exports = patientDetailsCheck;
