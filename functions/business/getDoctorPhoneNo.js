const doctorService = require('../services/doctor');
const chooseDoctorAgent = require('../ai/chooseDoctorAgent');
const getDoctorPhoneNo = async (chatSummary) => {
  try {
    const allDoctors = await doctorService.getAllDoctor();
    const agentRes = await chooseDoctorAgent(chatSummary, allDoctors);
    console.log({ agentRes });
    if (agentRes.phone_no) {
      return agentRes.phone_no;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

module.exports = getDoctorPhoneNo;
