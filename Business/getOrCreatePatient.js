const { getPatientbyPhoneNo, createPatient } = require('../services/patient');

const getOrCreatePatient = async (phone_no) => {
  try {
    const patient = await getPatientbyPhoneNo(phone_no);
    if (patient) {
      return patient;
    }
    const newPatient = await createPatient(phone_no);
    console.log('new patient created', newPatient);
    return newPatient;
  } catch (error) {
    throw error;
  }
};

module.exports = getOrCreatePatient;
