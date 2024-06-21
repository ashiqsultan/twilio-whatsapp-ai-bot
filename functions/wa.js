const MessagingResponse = require('twilio').twiml.MessagingResponse;
const getOrCreatePatient = require('./business/getOrCreatePatient');
const getSummary = require('./business/getSummary');
const patientDetailsCheck = require('./business/patientDetailsCheck');
const addBotMsgToSummary = require('./business/addBotMsgToSummary');
const medicAgent = require('./ai/medicAgent');
const isDocMsg = require('./business/isDocMsg');
const sendChatSummaryToDoctor = require('./business/sendChatSummaryToDoctor');
const doctorResponseHandler = require('./business/doctorResponseHandler');
const englishTranslateAgent = require('./ai/englishTranslateAgent');
const translateAgent = require('./ai/translateAgent');
const patientService = require('./services/patient');

const waHandler = async (event) => {
  try {
    console.log('You hit Whats App route');
    console.log('event');
    console.log(event);

    const WaId = event.WaId || '';
    let userMsg = event.Body || '';
    const twilioWANo = event.To;
    if (!WaId) {
      throw new Error('Missing WaId');
    }

    // Check is message from doctor if yes then call doctor handler
    const isMsgFromDoctor = await isDocMsg(WaId);
    if (isMsgFromDoctor) {
      const doctorResponse = await doctorResponseHandler(userMsg, twilioWANo);
      return `Reply sent to patient: ${doctorResponse.patient_id}`;
    }

    let patient = await getOrCreatePatient(WaId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Identify the language of the user message and update if required
    const englishAgentRes = await englishTranslateAgent(userMsg);
    const inputLang =
      englishAgentRes?.inputLanguage?.toLowerCase() || 'english';
    const lastMsg = englishAgentRes.message || userMsg;
    if (patient.prefLang !== inputLang) {
      const updatedPatient = await patientService.updatePrefLangByPhoneNo(
        WaId,
        inputLang
      );
      patient = updatedPatient;
    }

    const patientDetails = patient.details || {};

    // Summarize Conversation
    const chatSummary = await getSummary(WaId, lastMsg);
    // Confirm Basic details
    const checkPatientDetails = await patientDetailsCheck(
      chatSummary,
      patientDetails,
      WaId
    );
    if (checkPatientDetails.question) {
      let msgBody = checkPatientDetails.question;
      await addBotMsgToSummary(WaId, chatSummary, msgBody);
      if (patient.prefLang !== 'english') {
        const translatedMsg = await translateAgent(msgBody, patient.prefLang);
        msgBody = translatedMsg;
      }
      return msgBody;
    }
    if (checkPatientDetails.isPatientDetailsComplete) {
      const medicAgentRes = await medicAgent(chatSummary);
      console.log({ medicAgentRes });
      const botReply = medicAgentRes.botReply || '';
      await addBotMsgToSummary(WaId, chatSummary, botReply);
      if (medicAgentRes.isSubmit) {
        await sendChatSummaryToDoctor(chatSummary, twilioWANo, patient);
      }
      if (patient.prefLang !== 'english') {
        const translatedMsg = await translateAgent(botReply, patient.prefLang);
        return translatedMsg;
      }
      return botReply;
    }
    return 'fallback messaege';
  } catch (err) {
    // if (dbclient.close) {
    //   console.log('Reached catch block');
    //   await dbclient.close();
    // }
    console.error(err);
    return 'Something went wrong, Please try again later';
  }
};

module.exports = waHandler;
