import { NextResponse } from "next/server";
import type { Db } from "mongodb";
import { timingSafeEqual } from "node:crypto";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

type IPO = Record<string, unknown>;

const IPO_TYPES = new Set(["MAINBOARD", "SME", "NSE SME", "BSE SME"]);
const SUBSCRIPTION_EXCHANGES = new Set(["NSE", "BSE"]);
const OFFICIAL_DOCUMENT_SOURCES = new Set([
  "DRHP",
  "RHP",
  "NSE",
  "BSE",
  "SEBI",
]);

function normalizeAdminIPO(ipo: IPO): IPO | string {
  const type = typeof ipo.type === "string" ? ipo.type : "";
  const subscriptionSource =
    typeof ipo.subscriptionSource === "string"
      ? ipo.subscriptionSource
      : "";
  const officialSource =
    typeof ipo.officialSource === "string" ? ipo.officialSource : "";
  const totalAssetsFY2024 =
    typeof ipo.totalAssetsFY2024 === "string" ? ipo.totalAssetsFY2024 : "";
  const totalAssetsFY2025 =
    typeof ipo.totalAssetsFY2025 === "string" ? ipo.totalAssetsFY2025 : "";
  const totalAssetsFY2026 =
    typeof ipo.totalAssetsFY2026 === "string" ? ipo.totalAssetsFY2026 : "";
  const growwIPOUrl =
    typeof ipo.growwIPOUrl === "string" ? ipo.growwIPOUrl.trim() : "";

  if (!IPO_TYPES.has(type)) return "Invalid IPO type.";
  if (!SUBSCRIPTION_EXCHANGES.has(subscriptionSource)) {
    return "Invalid subscription exchange.";
  }
  if (!OFFICIAL_DOCUMENT_SOURCES.has(officialSource)) {
    return "Invalid official document source.";
  }
  if (growwIPOUrl) {
    try {
      const url = new URL(growwIPOUrl);
      const isGrowwHost =
        url.hostname === "groww.in" || url.hostname === "www.groww.in";

      if (url.protocol !== "https:" || !isGrowwHost || !url.pathname.startsWith("/ipo/")) {
        return "Groww IPO Link must be an official https://groww.in/ipo/... URL.";
      }
    } catch {
      return "Groww IPO Link must be a valid URL.";
    }
  }

  return {
    ...ipo,
    type,
    gmpSource: "GREY MARKET",
    subscriptionSource,
    officialSource,
    totalAssetsFY2024,
    totalAssetsFY2025,
    totalAssetsFY2026,
    growwIPOUrl,
  };
}

function authorizeAdmin(request: Request): NextResponse | null {
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey) {
    console.error("[api/ipos] ADMIN_API_KEY is not configured");
    return NextResponse.json(
      { message: "Admin writes are not configured." },
      { status: 503 }
    );
  }

  const authorization = request.headers.get("authorization");
  const suppliedKey = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const expected = Buffer.from(expectedKey);
  const supplied = Buffer.from(suppliedKey);

  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return NextResponse.json(
      { message: "Unauthorized." },
      {
        status: 401,
        headers: { "WWW-Authenticate": "Bearer" },
      }
    );
  }

  return null;
}

export async function GET() {
  let db: Db;

  try {
    db = await connectToDatabase();
    console.log("Connected to MongoDB");
    console.log("Database:", process.env.MONGODB_DB);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to load IPO data." },
      { status: 500 }
    );
  }

  let collection;
  try {
    collection = db.collection("ipos");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to load IPO data." },
      { status: 500 }
    );
  }

  let cursor;
  try {
    cursor = collection.find({});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to load IPO data." },
      { status: 500 }
    );
  }

  try {
    cursor = cursor.sort({ _id: -1 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to load IPO data." },
      { status: 500 }
    );
  }

  try {
    cursor = cursor.project({ _id: 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to load IPO data." },
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
      { message: "Unable to load IPO data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = authorizeAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const ipo = (await request.json()) as IPO;

    if (!ipo || typeof ipo !== "object") {
      return NextResponse.json(
        { message: "Invalid IPO data." },
        { status: 400 }
      );
    }

    const normalizedIPO = normalizeAdminIPO(ipo);
    if (typeof normalizedIPO === "string") {
      return NextResponse.json({ message: normalizedIPO }, { status: 400 });
    }

    const db = await connectToDatabase();

    await db.collection("ipos").insertOne(normalizedIPO);

    return NextResponse.json(
      {
        message: "IPO saved permanently!",
        ipo: normalizedIPO,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST IPO ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to save IPO data.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const unauthorized = authorizeAdmin(request);
  if (unauthorized) return unauthorized;

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

    const normalizedIPO = normalizeAdminIPO(updatedIPO);
    if (typeof normalizedIPO === "string") {
      return NextResponse.json({ message: normalizedIPO }, { status: 400 });
    }

    const db = await connectToDatabase();

    const result = await db
      .collection("ipos")
      .replaceOne({ name: originalName }, normalizedIPO);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "IPO not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "IPO updated successfully!",
        ipo: normalizedIPO,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT IPO ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to update IPO.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const unauthorized = authorizeAdmin(request);
  if (unauthorized) return unauthorized;

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
      },
      { status: 500 }
    );
  }
}
