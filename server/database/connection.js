import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import ENV from '../config.js'

async function connect() {
    const mongo = await MongoMemoryServer.create();
    const getURI = await mongo.getUri();
    mongoose.set('strictQuery', false);
    const db = await mongoose.connect(ENV.MONGO_DB_URI);
    return db;
}

export default connect;