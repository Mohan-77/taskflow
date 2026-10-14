
import mongoose from "mongoose";
import { getMongoDbUri } from "@/lib/mongodb-uri";

const MONGODB_URI = getMongoDbUri();

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export async function connectMongoose() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!globalWithMongoose.mongooseConnection) {
    globalWithMongoose.mongooseConnection = mongoose.connect(MONGODB_URI, {
      dbName: "taskflow",
    });
  }

  try {
    return await globalWithMongoose.mongooseConnection;
  } catch (error) {
    globalWithMongoose.mongooseConnection = undefined;
    throw error;
  }
}

export default connectMongoose;
