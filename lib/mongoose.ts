
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env");
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export async function connectMongoose() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!globalWithMongoose.mongooseConnection) {
    globalWithMongoose.mongooseConnection = mongoose.connect(MONGODB_URI as string, {
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
