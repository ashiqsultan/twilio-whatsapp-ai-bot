const MessagingResponse = require('twilio').twiml.MessagingResponse;
const getOrCreatePatient = require('../Business/getOrCreatePatient');
const { getSummary } = require('../Business/getSummary');
const patientDetailsCheck = require('../Business/patientDetailsCheck');
const addBotMsgToSummary = require('../Business/addBotMsgToSummary');
const dbclient = require('../utils/dbclient');

exports.handler = async (context, event, callback) => {
  try {
    console.log('You hit Whats App route');
    console.log('event');
    console.log(event);
    const WaId = event.WaId || '';
    if (!WaId) {
      throw new Error('Missing WaId');
    }
    //  TODO: Check is message from doctor if yes then call doctor handler
    const patient = await getOrCreatePatient(WaId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    const patientDetails = patient.details || {};
    // Summarize Conversation
    const chatSummary = await getSummary(WaId, event.Body);
    // Confirm Basic details
    console.log({ chatSummary });
    const checkPatientDetails = await patientDetailsCheck(
      chatSummary,
      patientDetails,
      WaId
    );
    if (checkPatientDetails.question) {
      const newMsg01 = new MessagingResponse();
      newMsg01.message(checkPatientDetails.question);
      await addBotMsgToSummary(WaId, chatSummary, checkPatientDetails.question);
      return callback(null, newMsg01);
    }
    if (checkPatientDetails.isPatientDetailsComplete) {
      const newMsg02 = new MessagingResponse();
      const botReply =
        'Thank you for your response. Please explain your problem and symptoms';
      newMsg02.message(botReply);
      await addBotMsgToSummary(WaId, chatSummary, botReply);
      return callback(null, newMsg02);
    }

    // Call Intent identifier AI using the summary and last message
    // Based on the intent call the suitable Business function, example updatePatientDetails, Set remainder etc
    const newMsg03 = new MessagingResponse();
    newMsg03.message(JSON.stringify(patient));
    return callback(null, newMsg03);
  } catch (err) {
    if (dbclient.close) {
      console.log('Reached catch block');
      await dbclient.close();
    }
    console.error(err);
    const msgRes = new MessagingResponse();
    msgRes.message('Something went wrong, Please try again later');
    return callback(null, msgRes);
  }
};
