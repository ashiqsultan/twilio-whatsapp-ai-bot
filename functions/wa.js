const MessagingResponse = require('twilio').twiml.MessagingResponse;

exports.handler = async (context, event, callback) => {
  try {
    console.log('You hit Whats App route');
    console.log('event');
    console.log(event);
    // Import
    const getOrCreatePatientPath =
      Runtime.getFunctions()['business/getOrCreatePatient'].path;
    const getOrCreatePatient = require(getOrCreatePatientPath);

    const getSummaryPath = Runtime.getFunctions()['business/getSummary'].path;
    const getSummary = require(getSummaryPath);

    const patientDetailsCheckPath =
      Runtime.getFunctions()['business/patientDetailsCheck'].path;
    const patientDetailsCheck = require(patientDetailsCheckPath);

    const addBotMsgToSummaryPath =
      Runtime.getFunctions()['business/addBotMsgToSummary'].path;
    const addBotMsgToSummary = require(addBotMsgToSummaryPath);

    const medicAgentPath = Runtime.getFunctions()['ai/medicAgent'].path;
    const medicAgent = require(medicAgentPath);

    const isDocMsgPath = Runtime.getFunctions()['business/isDocMsg'].path;
    const isDocMsg = require(isDocMsgPath);

    const sendChatSummaryToDoctorPath =
      Runtime.getFunctions()['business/sendChatSummaryToDoctor'].path;
    const sendChatSummaryToDoctor = require(sendChatSummaryToDoctorPath);

    const doctorResponseHandlerPath =
      Runtime.getFunctions()['business/doctorResponseHandler'].path;
    const doctorResponseHandler = require(doctorResponseHandlerPath);

    const englishTranslateAgentPath =
      Runtime.getFunctions()['ai/englishTranslateAgent'].path;
    const englishTranslateAgent = require(englishTranslateAgentPath);

    const translateAgentPath = Runtime.getFunctions()['ai/translateAgent'].path;
    const translateAgent = require(translateAgentPath);

    const patientServicePath = Runtime.getFunctions()['services/patient'].path;
    const patientService = require(patientServicePath);
    // Import Ends

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
      return callback(
        null,
        `Reply sent to patient: ${doctorResponse.patient_id}`
      );
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
    console.log({ chatSummary });
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
      const newMsg01 = new MessagingResponse();
      newMsg01.message(msgBody);
      return callback(null, newMsg01);
    }
    if (checkPatientDetails.isPatientDetailsComplete) {
      const medicAgentRes = await medicAgent(chatSummary, patientDetails);
      console.log({ medicAgentRes });
      const botReply = medicAgentRes.message || '';
      if (!medicAgentRes.isMoreInfoRequired) {
        await sendChatSummaryToDoctor(chatSummary, twilioWANo, patient);
      }
      await addBotMsgToSummary(WaId, chatSummary, botReply);
      if (patient.prefLang !== 'english') {
        const translatedMsg = await translateAgent(botReply, patient.prefLang);
        botReply = translatedMsg;
      }
      const newMsg02 = new MessagingResponse();
      newMsg02.message(botReply);
      return callback(null, newMsg02);
    }

    const fallbackMsg = new MessagingResponse();
    fallbackMsg.message('fallback messaege');
    return callback(null, fallbackMsg);
  } catch (err) {
    // if (dbclient.close) {
    //   console.log('Reached catch block');
    //   await dbclient.close();
    // }
    console.error(err);
    const msgRes = new MessagingResponse();
    msgRes.message('Something went wrong, Please try again later');
    return callback(null, msgRes);
  }
};
