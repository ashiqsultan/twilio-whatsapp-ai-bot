const { MongoClient } = require('mongodb');

let db;
const dbClient = async (uri) => {
  try {
    if (db) {
      return db;
    }
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(uri);
    // await client.connect();
    db = client.db('healthlingo');
    console.log('Connected to db');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
};

module.exports = dbClient;
