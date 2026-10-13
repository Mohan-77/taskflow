
import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env");
}

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client =
  process.env.NODE_ENV === "development"
    ? (global._mongoClient ??= new MongoClient(uri))
    : new MongoClient(uri);

const clientPromise =
  process.env.NODE_ENV === "development"
    ? (global._mongoClientPromise ??= client.connect())
    : client.connect();

const db: Db = client.db("taskflow");

export { client, clientPromise, db };
export default clientPromise;
