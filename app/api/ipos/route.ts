import { NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return db;
}

type IPO = Record<string, unknown>;

export async function GET() {
  try {
    const db = await connectToDatabase();

    const ipos = await db
      .collection("ipos")
      .find({})
      .sort({ _id: -1 })
      .project({ _id: 0 })
      .toArray();

    return NextResponse.json(ipos, {
      status: 200,
    });
  } catch (error) {
    console.error("GET IPO ERROR:", error);

    return NextResponse.json(
      { message: "Unable to load IPO data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const ipo = (await request.json()) as IPO;

    if (!ipo || typeof ipo !== "object") {
      return NextResponse.json(
        { message: "Invalid IPO data." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    await db.collection("ipos").insertOne(ipo);

    return NextResponse.json(
      {
        message: "IPO saved permanently!",
        ipo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST IPO ERROR:", error);

    return NextResponse.json(
      { message: "Invalid IPO data." },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const originalName = body.originalName;
    const updatedIPO = body.ipo as IPO;

    if (
      !originalName ||
      !updatedIPO ||
      typeof updatedIPO !== "object"
    ) {
      return NextResponse.json(
        { message: "Invalid IPO update data." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    const result = await db
      .collection("ipos")
      .replaceOne({ name: originalName }, updatedIPO);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "IPO not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "IPO updated successfully!",
        ipo: updatedIPO,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT IPO ERROR:", error);

    return NextResponse.json(
      { message: "Unable to update IPO." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "IPO name is required." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    await db.collection("ipos").deleteOne({ name });

    return NextResponse.json(
      { message: "IPO deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE IPO ERROR:", error);

    return NextResponse.json(
      { message: "Unable to delete IPO." },
      { status: 500 }
    );
  }
}