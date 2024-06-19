const { isEqual } = require('lodash');
const patientDetailsAgent = require('../ai/patientDetailsAgent');
const { updatePatientDetailsByPhoneNo } = require('../services/patient');
const patientDetailsCheck = async (chatSummary, patientDetails, phone_no) => {
  try {
    let updatedPatientDetails = {};
    const agentResponse = await patientDetailsAgent(
      chatSummary,
      patientDetails
    );
    console.log('agentResponse', agentResponse);
    if (!isEqual(patientDetails, agentResponse.patientDetails)) {
      updatedPatientDetails = agentResponse.patientDetails;
      const updateOp = await updatePatientDetailsByPhoneNo(
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
