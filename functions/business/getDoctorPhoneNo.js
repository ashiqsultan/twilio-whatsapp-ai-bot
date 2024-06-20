const getDoctorPhoneNo = async (chatSummary) => {
  try {
    const doctorServicePath = Runtime.getFunctions()['services/doctor'].path;
    const doctorService = require(doctorServicePath);

    const chooseDoctorAgentPath =
      Runtime.getFunctions()['ai/chooseDoctorAgent'].path;
    const chooseDoctorAgent = require(chooseDoctorAgentPath);

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
