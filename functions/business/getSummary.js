const patientService = require('../services/patient');
const consultationService = require('../services/consultation');
const summarizeAgent = require('../ai/summarizeAgent');
const getSummary = async (phone_no, lastMsg) => {
  try {
    const consultation = await consultationService.upsertByPhoneNo(phone_no);
    const patient = await patientService.getPatientbyPhoneNo(phone_no);

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
    const _updateSummaryOp = await consultationService.updateSummaryByPhoneNo(
      phone_no,
      summary
    );
    return summary;
  } catch (error) {
    throw error;
  }
};

module.exports = getSummary;
