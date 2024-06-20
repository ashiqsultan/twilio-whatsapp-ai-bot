const sendChatSummaryToDoctor = async (chatSummary, from, patientObj) => {
  try {
    console.log('Updating Doctor');
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    const getDoctorPhoneNoPath =
      Runtime.getFunctions()['business/getDoctorPhoneNo'].path;
    const getDoctorPhoneNo = require(getDoctorPhoneNoPath);

    const docPhoneNo = await getDoctorPhoneNo(chatSummary);
    const to = `whatsapp:+${docPhoneNo}`;
    console.log({ from, to });
    const messageBody = `
    Chat Summary:${chatSummary}.
    To reply to this patient please include the patient id ${patientObj.easyId} in your message.
    `;
    const message = await client.messages.create({
      from: from,
      to: to,
      body: messageBody,
    });
    console.log(message.sid);
    console.log('Doctor updated');
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = sendChatSummaryToDoctor;
