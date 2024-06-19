const getAllDoctor = async () => {
  try {
    const dbClientPath = Runtime.getFunctions()['utils/dbclient'].path;
    const dbClient = require(dbClientPath);
    const db = await dbClient(process.env.MONGODB_URI);
    const collection = db.collection('doctors');
    const allDoctors = await collection.find({}).toArray();
    return allDoctors;
  } catch (error) {
    throw error;
  }
};

const getDoctorByPhoneNo = async (phone_no) => {
  try {
    const dbClientPath = Runtime.getFunctions()['utils/dbclient'].path;
    const dbClient = require(dbClientPath);
    const db = await dbClient(process.env.MONGODB_URI);
    const collection = db.collection('doctors');
    const doctor = await collection.findOne({ phone_no: phone_no });
    console.log({ doctor });
    return doctor;
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllDoctor, getDoctorByPhoneNo };
