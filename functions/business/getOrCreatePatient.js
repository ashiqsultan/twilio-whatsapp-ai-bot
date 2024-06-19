const getOrCreatePatient = async (phone_no) => {
  try {
    const patientServicePath = Runtime.getFunctions()['services/patient'].path;
    const patientService = require(patientServicePath);

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
