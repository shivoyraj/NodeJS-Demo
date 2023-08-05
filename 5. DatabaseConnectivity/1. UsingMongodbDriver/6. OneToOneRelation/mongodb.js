const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1/';
const dbName = 'myDB';
let client;

async function openDBConnection() {
    try {
        client = new MongoClient(url, { useUnifiedTopology: true });
        await client.connect();
        const db = client.db(dbName);
        console.log('MongoDB connection opened');
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function closeDBConnection() {
    try {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

module.exports = { openDBConnection, closeDBConnection };
