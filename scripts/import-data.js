require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

async function run() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri || !dbName) {
    console.error("MONGODB_URI or MONGODB_DB missing in .env.local");
    return;
  }

  const filePath = path.join(process.cwd(), "data", "ipos.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const ipos = JSON.parse(fileData);

  if (!Array.isArray(ipos) || ipos.length === 0) {
    console.log("No IPOs found in data/ipos.json");
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("ipos");

    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(
        `Collection already has ${existingCount} documents. Skipping import to avoid duplicates.`
      );
      return;
    }

    const result = await collection.insertMany(ipos);
    console.log(`Successfully imported ${result.insertedCount} IPOs!`);
  } catch (error) {
    console.error("Import failed:", error);
  } finally {
    await client.close();
  }
}

run();