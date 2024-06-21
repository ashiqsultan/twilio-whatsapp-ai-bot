const patientService = require('../services/patient');
const getOrCreatePatient = async (phone_no) => {
  try {
    const patient = await patientService.getPatientbyPhoneNo(phone_no);
    if (patient) {
      return patient;
    }
    const newPatient = await patientService.createPatient(phone_no);
    console.log('new patient created', newPatient);
    return newPatient;
  } catch (error) {
    throw error;
  }
};

module.exports = getOrCreatePatient;
