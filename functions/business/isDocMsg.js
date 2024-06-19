const isDoctorMsg = async (phone_no) => {
  try {
    const doctorServicePath = Runtime.getFunctions()['services/doctor'].path;
    const doctorService = require(doctorServicePath);
    const doctor = await doctorService.getDoctorByPhoneNo(phone_no);
    return doctor ? true : false;
  } catch (error) {
    throw error;
  }
};

module.exports = isDoctorMsg;
