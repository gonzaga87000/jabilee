require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const dbName = 'todos'; // Specify your database name here

const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

let client;
let db;

const connectToMongoDB = async () => {
    if (!client) {
        try {
            console.log("Connecting to MongoDB with URI:", uri);
            client = await MongoClient.connect(uri, options);
            db = client.db(dbName); // Specify the database name
            console.log("Connected to MongoDB successfully");
            return db;
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    }
    return db;
};

const getCollection = async (collectionName) => {
    if (!db) {
        await connectToMongoDB();
    }
    return db.collection(collectionName);
};

const getConnectedClient = () => client;

const disconnectFromMongoDB = async () => {
    if (client) {
        try {
            await client.close();
            console.log("Disconnected from mongodb");
        } catch (error) {
            console.error("Error disconnecting from mongodb: ", error);
        }
    }
};

module.exports = { connectToMongoDB, getCollection, getConnectedClient, disconnectFromMongoDB };