/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient } = require("mongodb");
const dns = require("dns");

const uri = process.env.MONGODB_URI;

dns.setServers(["8.8.8.8"]);

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connection succeeded");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
