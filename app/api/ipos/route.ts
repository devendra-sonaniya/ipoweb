import { NextResponse } from "next/server";
import type { Db } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

type IPO = Record<string, unknown>;

export async function GET() {
  let db: Db;

  try {
    db = await connectToDatabase();
    console.log("Connected to MongoDB");
    console.log("Database:", process.env.MONGODB_DB);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }

  let collection;
  try {
    collection = db.collection("ipos");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }

  let cursor;
  try {
    cursor = collection.find({});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }

  try {
    cursor = cursor.sort({ _id: -1 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }

  try {
    cursor = cursor.project({ _id: 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }

  try {
    const ipos = await cursor.toArray();
    return NextResponse.json(ipos, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
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
      {
        message: "Invalid IPO data.",
        error: error instanceof Error ? error.message : String(error),
      },
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
      {
        message: "Unable to update IPO.",
        error: error instanceof Error ? error.message : String(error),
      },
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
      {
        message: "Unable to delete IPO.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
