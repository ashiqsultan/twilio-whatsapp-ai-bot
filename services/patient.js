const dbClient = require('../utils/dbclient');

const COLLECTION_NAME = 'patients';
const getPatientbyPhoneNo = async (phone_no) => {
  try {
    const db = await dbClient(process.env.MONGODB_URI);
    const patient = await db
      .collection(COLLECTION_NAME)
      .findOne({ phone_no: phone_no });
    return patient;
  } catch (error) {
    throw error;
  }
};

const createPatient = async (phone_no) => {
  try {
    const db = await dbClient(process.env.MONGODB_URI);
    const collection = db.collection(COLLECTION_NAME);
    const newDoc = await collection.insertOne({ phone_no: phone_no });
    const result = await collection.findOne({ _id: newDoc.insertedId });
    return result;
  } catch (error) {
    throw error;
  }
};

// Using mongodb update the patient details field with the given object
const updatePatientDetailsByPhoneNo = async (phone_no, patientDetails) => {
  try {
    const db = await dbClient(process.env.MONGODB_URI);
    const collection = db.collection(COLLECTION_NAME);
    const _updateOp = await collection.updateOne(
      { phone_no: phone_no },
      { $set: { details: patientDetails } }
    );
    const result = await collection.findOne({ phone_no });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPatientbyPhoneNo,
  createPatient,
  updatePatientDetailsByPhoneNo,
};
