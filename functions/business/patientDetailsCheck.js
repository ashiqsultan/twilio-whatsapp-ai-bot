const { isEqual } = require('lodash');
const patientService = require('../services/patient');
const patientDetailsAgent = require('../ai/patientDetailsAgent');

const patientDetailsCheck = async (chatSummary, patientDetails, phone_no) => {
  try {
    let updatedPatientDetails = {};
    const agentResponse = await patientDetailsAgent(
      chatSummary,
      patientDetails
    );
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
