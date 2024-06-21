const doctorService = require('../services/doctor');
const isDoctorMsg = async (phone_no) => {
  try {
    const doctor = await doctorService.getDoctorByPhoneNo(phone_no);
    return doctor ? true : false;
  } catch (error) {
    throw error;
  }
};

module.exports = isDoctorMsg;
