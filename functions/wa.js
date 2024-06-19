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

    const getDoctorPhoneNoPath =
      Runtime.getFunctions()['business/getDoctorPhoneNo'].path;
    const getDoctorPhoneNo = require(getDoctorPhoneNoPath);
    // Import Ends

    const WaId = event.WaId || '';
    const lastMsg = event.Body || '';
    if (!WaId) {
      throw new Error('Missing WaId');
    }

    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    //  TODO: Check is message from doctor if yes then call doctor handler
    const patient = await getOrCreatePatient(WaId);
    if (!patient) {
      throw new Error('Patient not found');
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
      const newMsg01 = new MessagingResponse();
      newMsg01.message(checkPatientDetails.question);
      await addBotMsgToSummary(WaId, chatSummary, checkPatientDetails.question);
      return callback(null, newMsg01);
    }
    if (checkPatientDetails.isPatientDetailsComplete) {
      const medicAgentRes = await medicAgent(chatSummary, patientDetails);
      console.log({ medicAgentRes });
      const botReply = medicAgentRes.message || '';
      if (!medicAgentRes.isMoreInfoRequired) {
        console.log('Updating Doctor');
        const docPhoneNo = await getDoctorPhoneNo(chatSummary, patientDetails);
        const from = event.To;
        const to = `whatsapp:+${docPhoneNo}`;
        console.log({ from, to });
        const message = await client.messages.create({
          from: from,
          to: to,
          body: String(chatSummary),
        });
        console.log(message.sid);
        console.log('Doctor updated');
      }
      const newMsg02 = new MessagingResponse();
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
