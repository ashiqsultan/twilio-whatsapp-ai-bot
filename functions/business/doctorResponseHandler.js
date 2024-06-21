const doctorMsgHandlerAgent = require('../ai/doctorMsgHandlerAgent');
const translateAgent = require('../ai/translateAgent');
const patientService = require('../services/patient');

const doctorResponseHandler = async (message, twilioWANo) => {
  const agentResponse = await doctorMsgHandlerAgent(message);

  if (agentResponse.patient_id && agentResponse.summary) {
    const easyId = agentResponse.patient_id;

    const patient = await patientService.getPatientbyEasyId(easyId);
    if (patient) {
      const accountSid = process.env.ACCOUNT_SID;
      const authToken = process.env.AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);
      const patientWaNo = `whatsapp:+${patient.phone_no}`;
      let messageBody = `Reply from Doctor: ${agentResponse.summary}`;

      if (patient.prefLang !== 'english') {
        const translatedMsg = await translateAgent(
          messageBody,
          patient.prefLang
        );
        messageBody = translatedMsg;
      }

      const message = await client.messages.create({
        from: twilioWANo,
        to: patientWaNo,
        body: messageBody,
      });
      // TODO later after email
      // Try to send Remainders to patient about the medication prescribed by doc

      //  Prepare entire Summary of consultation
      // Patient Details
      // Chat Summary
      // Doctor reply
      // Medication indicated by doctor if any

      // Send entire summary as an email to patient
      console.log(message.sid);
    }
  }
  return agentResponse;
};

module.exports = doctorResponseHandler;
