const getSummary = async (phone_no, lastMsg) => {
  try {
    const patientServicePath = Runtime.getFunctions()['services/patient'].path;
    const patientService = require(patientServicePath);

    const consultationServicePath =
      Runtime.getFunctions()['services/consultation'].path;
    const consultationService = require(consultationServicePath);

    const summarizeAgentPath = Runtime.getFunctions()['ai/summarizeAgent'].path;
    const summarizeAgent = require(summarizeAgentPath);

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
