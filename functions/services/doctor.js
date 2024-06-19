const getAllDoctor = async () => {
  try {
    const dbClientPath = Runtime.getFunctions()['utils/dbclient'].path;
    const dbClient = require(dbClientPath);
    const db = await dbClient(process.env.MONGODB_URI);
    const collection = db.collection('doctors');
    const allDoctors = await collection.find({}).toArray();
    console.log({allDoctors});
    return allDoctors;
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllDoctor };
