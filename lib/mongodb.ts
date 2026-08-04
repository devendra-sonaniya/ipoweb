import { Db, MongoClient } from "mongodb";

declare global {
  // Kept on globalThis so Fast Refresh does not create another pool.
  var __mongoClient: MongoClient | undefined;
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
  throw new Error("MongoDB is not configured. Set MONGODB_URI and MONGODB_DB.");
}

const mongoUri: string = uri;
const mongoDbName: string = dbName;

// Do not pass TLS options here. The connection string is the single source of
// truth for TLS configuration and its `ssl=true` setting remains intact.
function getMongoClient(): Promise<MongoClient> {
  if (!globalThis.__mongoClientPromise) {
    const client = (globalThis.__mongoClient ??= new MongoClient(mongoUri));

    globalThis.__mongoClientPromise = client.connect().catch(async (error) => {
      // Do not cache a failed TLS handshake. Clear both values together so a
      // subsequent request performs one fresh, shared connection attempt.
      globalThis.__mongoClientPromise = undefined;
      globalThis.__mongoClient = undefined;
      await client.close().catch(() => undefined);
      throw error;
    });
  }

  return globalThis.__mongoClientPromise;
}

export async function connectToDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(mongoDbName);
}
