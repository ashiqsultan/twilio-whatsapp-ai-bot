const getDoctorPhoneNo = require('../business/getDoctorPhoneNo');
const sendChatSummaryToDoctor = async (chatSummary, from, patientObj) => {
  try {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    const docPhoneNo = await getDoctorPhoneNo(chatSummary);
    const to = `whatsapp:+${docPhoneNo}`;
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
