const { MongoClient } = require('mongodb');

let client;
let db;

const connectDB = async (uri) => {
    const MONGODB_URI = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/emr';
    try {
        client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        db = client.db();
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const getDB = () => db;

const closeDB = async () => {
    if (client) {
        await client.close();
    }
};

module.exports = { connectDB, getDB, closeDB };
