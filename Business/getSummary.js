const summarizeAgent = require('../ai/summarizeAgent');
const {
  upsertByPhoneNo,
  updateSummaryByPhoneNo,
} = require('../services/consultation');
const { getPatientbyPhoneNo } = require('../services/patient');

const getSummary = async (phone_no, lastMsg) => {
  try {
    const consultation = await upsertByPhoneNo(phone_no);
    const patient = await getPatientbyPhoneNo(phone_no);
    let lastSummary = '';
    let patientDetails = {};
    if (consultation && consultation.summary) {
      lastSummary = consultation.summary;
    }
    if (patient && patient.details) {
      patientDetails = patient.details;
    }

    const summary = await summarizeAgent(
      lastSummary,
      lastMsg,
      'patient',
      patientDetails
    );
    // Update the summary in the Consultation collection
    const _updateSummaryOp = await updateSummaryByPhoneNo(phone_no, summary);
    return summary;
  } catch (error) {
    throw error;
  }
};

module.exports = { getSummary };
