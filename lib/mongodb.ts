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

function getConnectionMetadata() {
  const scheme = mongoUri.match(/^([^:]+):/)?.[1] ?? "unknown";
  const authority = mongoUri
    .replace(/^mongodb(?:\+srv)?:\/\//i, "")
    .split("/", 1)[0]
    .split("@").at(-1) ?? "";
  const hosts = authority
    .split(",")
    .map((host) => host.replace(/:\d+$/, ""))
    .filter(Boolean);

  return {
    scheme,
    host: hosts[0] ?? "unknown",
    hostCount: hosts.length,
    database: mongoDbName,
    usesLocalhost: ["localhost", "127.0.0.1", "::1"].includes(
      hosts[0] ?? ""
    ),
    tlsConfiguredInUri: /[?&](?:tls|ssl)=/i.test(mongoUri),
  };
}

function getSafeErrorDetails(error: unknown) {
  const value = error instanceof Error ? error : new Error(String(error));
  const errorWithCode = value as Error & { code?: string; errorLabels?: Set<string> };

  return {
    name: value.name,
    message: value.message.replace(
      /mongodb(?:\+srv)?:\/\/[^@\s]+@/gi,
      "mongodb://<redacted>@"
    ),
    code: errorWithCode.code,
    errorLabels: errorWithCode.errorLabels
      ? [...errorWithCode.errorLabels]
      : undefined,
  };
}

// Do not pass TLS options here. The connection string is the single source of
// truth for TLS configuration and its `ssl=true` setting remains intact.
function getMongoClient(): Promise<MongoClient> {
  if (!globalThis.__mongoClientPromise) {
    const reusingClient = Boolean(globalThis.__mongoClient);
    const client = (globalThis.__mongoClient ??= new MongoClient(mongoUri));

    console.info("[mongodb] connection attempt", {
      ...getConnectionMetadata(),
      reusingClient,
    });

    globalThis.__mongoClientPromise = client.connect().then(() => {
      console.info("[mongodb] connection established", getConnectionMetadata());
      return client;
    }).catch(async (error) => {
      // Do not cache a failed TLS handshake. Clear both values together so a
      // subsequent request performs one fresh, shared connection attempt.
      console.error("[mongodb] connection failed", {
        ...getConnectionMetadata(),
        error: getSafeErrorDetails(error),
      });
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
