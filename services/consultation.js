const dbClient = require('../utils/dbclient');

const COLLECTION_NAME = 'consultations';
const upsertByPhoneNo = async (phone_no) => {
  try {
    const db = await dbClient(process.env.MONGODB_URI);
    const collection = db.collection(COLLECTION_NAME);
    const now = new Date();
    const _updateOp = await collection.updateOne(
      { phone_no: phone_no },
      { $set: { phone_no: phone_no, updated_at: now } },
      { upsert: true }
    );
    const result = await collection.findOne({ phone_no });
    return result;
  } catch (error) {
    throw error;
  }
};

const createOne = async (phone_no) => {
  try {
    const now = new Date();
    const db = await dbClient(process.env.MONGODB_URI);
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.insertOne({ phone_no, updated_at: now });
    return result;
  } catch (error) {
    throw error;
  }
};

const updateSummaryByPhoneNo = async (phone_no, summary) => {
  try {
    const now = new Date();
    const db = await dbClient(process.env.MONGODB_URI);
    const collection = db.collection(COLLECTION_NAME);
    const _updateOp = await collection.updateOne(
      { phone_no: phone_no },
      { $set: { summary: summary, updated_at: now } }
    );
    const result = await collection.findOne({ phone_no });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { upsertByPhoneNo, createOne, updateSummaryByPhoneNo };
