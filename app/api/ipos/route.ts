import { NextResponse } from "next/server";
import { MongoServerError, ObjectId, type Db } from "mongodb";
import { timingSafeEqual } from "node:crypto";
import {
  createIPOSlug,
  ensureIPOSlugInfrastructure,
  getIPOsCollection,
  getUniqueIPOSlug,
} from "@/lib/ipoRepository";
import { connectToDatabase } from "@/lib/mongodb";
import { IPO_IMPORT_FIELD_SET } from "@/lib/ipoImportFields";
import { mergeGMPHistory } from "@/lib/ipoPartialUpdate";

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
const PARTIAL_DATE_FIELDS = new Set(["openDate", "closeDate", "allotmentDate", "listingDate", "refundDate", "dematCreditDate", "lastUpdated"]);

function validISODate(value: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return !value;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function validatePartialChanges(changes: unknown): IPO | string {
  if (!changes || typeof changes !== "object" || Array.isArray(changes)) return "Invalid approved changes.";
  const validated: IPO = {};
  for (const [field, value] of Object.entries(changes)) {
    if (!IPO_IMPORT_FIELD_SET.has(field)) return `Unsupported IPO field: ${field}.`;
    if (field === "gmpHistory") {
      if (!Array.isArray(value) || value.some((item) => !item || typeof item !== "object" || Array.isArray(item) ||
        typeof (item as IPO).date !== "string" || typeof (item as IPO).value !== "string" ||
        Object.keys(item as IPO).some((key) => key !== "date" && key !== "value"))) {
        return "Invalid GMP history additions.";
      }
      validated[field] = value;
      continue;
    }
    if (typeof value !== "string") return `Invalid value for ${field}.`;
    const trimmed = value.trim();
    if (field === "type" && trimmed && !IPO_TYPES.has(trimmed)) return "Invalid IPO type.";
    if (field === "subscriptionSource" && trimmed && !SUBSCRIPTION_EXCHANGES.has(trimmed)) return "Invalid subscription exchange.";
    if (field === "officialSource" && trimmed && !OFFICIAL_DOCUMENT_SOURCES.has(trimmed)) return "Invalid official document source.";
    if (PARTIAL_DATE_FIELDS.has(field) && !validISODate(trimmed)) return `Invalid date for ${field}.`;
    validated[field] = trimmed;
  }
  return validated;
}

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

  if (type && !IPO_TYPES.has(type)) return "Invalid IPO type.";
  if (subscriptionSource && !SUBSCRIPTION_EXCHANGES.has(subscriptionSource)) {
    return "Invalid subscription exchange.";
  }
  if (officialSource && !OFFICIAL_DOCUMENT_SOURCES.has(officialSource)) {
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
    gmpSource: typeof ipo.gmpSource === "string" ? ipo.gmpSource : "",
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
    await ensureIPOSlugInfrastructure();
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
    const ipos = await cursor.toArray();
    return NextResponse.json(ipos.map(({ _id, ...ipo }) => ({ ...ipo, id: _id.toString() })), {
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

    const name = typeof normalizedIPO.name === "string"
      ? normalizedIPO.name.trim()
      : "";
    if (!name) {
      return NextResponse.json({ message: "IPO name is required." }, { status: 400 });
    }

    const requestedSlug =
      typeof normalizedIPO.slug === "string" && normalizedIPO.slug.trim()
        ? normalizedIPO.slug
        : name;
    const collection = await getIPOsCollection();
    const duplicateName = await collection.findOne(
      { name },
      { projection: { _id: 1 }, collation: { locale: "en", strength: 2 } }
    );
    if (duplicateName) {
      return NextResponse.json(
        { message: "An IPO with this name already exists." },
        { status: 409 }
      );
    }

    const slug = await getUniqueIPOSlug(requestedSlug);
    if (!slug) {
      return NextResponse.json(
        { message: "An IPO with this slug already exists." },
        { status: 409 }
      );
    }

    const now = new Date();
    const ipoToInsert = {
      ...normalizedIPO,
      name,
      slug,
      oldSlugs: [],
      createdAt: now,
      updatedAt: now,
    };
    await collection.insertOne(ipoToInsert);

    return NextResponse.json(
      {
        message: "IPO saved permanently!",
          ipo: ipoToInsert,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST IPO ERROR:", error);

    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { message: "An IPO with this slug already exists." },
        { status: 409 }
      );
    }

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

    const collection = await getIPOsCollection();
    const existingIPO = await collection.findOne({ name: originalName });

    if (!existingIPO) {
      return NextResponse.json(
        { message: "IPO not found." },
        { status: 404 }
      );
    }

    const name = typeof normalizedIPO.name === "string"
      ? normalizedIPO.name.trim()
      : "";
    if (!name) {
      return NextResponse.json({ message: "IPO name is required." }, { status: 400 });
    }

    const duplicateName = await collection.findOne(
      { name, _id: { $ne: existingIPO._id } },
      { projection: { _id: 1 }, collation: { locale: "en", strength: 2 } }
    );
    if (duplicateName) {
      return NextResponse.json(
        { message: "An IPO with this name already exists." },
        { status: 409 }
      );
    }

    const explicitlyRequestedSlug =
      typeof updatedIPO.slug === "string" && updatedIPO.slug.trim()
        ? createIPOSlug(updatedIPO.slug)
        : null;
    const slug = explicitlyRequestedSlug || existingIPO.slug;

    if (!slug) {
      return NextResponse.json({ message: "IPO slug is required." }, { status: 400 });
    }

    if (
      slug !== existingIPO.slug &&
      !(await getUniqueIPOSlug(slug, existingIPO._id))
    ) {
      return NextResponse.json(
        { message: "An IPO with this slug already exists." },
        { status: 409 }
      );
    }

    const oldSlugs = Array.from(
      new Set([
        ...(Array.isArray(existingIPO.oldSlugs) ? existingIPO.oldSlugs : []),
        ...(slug !== existingIPO.slug ? [existingIPO.slug] : []),
      ])
    ).filter((oldSlug): oldSlug is string => Boolean(oldSlug && oldSlug !== slug));
    const ipoToUpdate = {
      ...normalizedIPO,
      name,
      slug,
      oldSlugs,
      createdAt: existingIPO.createdAt,
      updatedAt: new Date(),
    };

    const result = await collection.replaceOne(
      { _id: existingIPO._id },
      ipoToUpdate
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "IPO not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "IPO updated successfully!",
        ipo: ipoToUpdate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT IPO ERROR:", error);

    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { message: "An IPO with this slug already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "Unable to update IPO.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const unauthorized = authorizeAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json() as { id?: unknown; slug?: unknown; changes?: unknown };
    if (typeof body.id !== "string" || !ObjectId.isValid(body.id)) {
      return NextResponse.json({ message: "A valid stored IPO id is required." }, { status: 400 });
    }
    const changes = validatePartialChanges(body.changes);
    if (typeof changes === "string") return NextResponse.json({ message: changes }, { status: 400 });
    if (Object.keys(changes).length === 0) {
      return NextResponse.json({ message: "No approved IPO changes were supplied." }, { status: 400 });
    }

    const collection = await getIPOsCollection();
    const _id = new ObjectId(body.id);
    const existingIPO = await collection.findOne({ _id });
    if (!existingIPO) return NextResponse.json({ message: "IPO not found." }, { status: 404 });
    if (typeof body.slug !== "string" || body.slug !== existingIPO.slug) {
      return NextResponse.json({ message: "Stored IPO identity no longer matches. Reload before saving." }, { status: 409 });
    }

    if (typeof changes.name === "string" && changes.name && changes.name !== existingIPO.name) {
      const duplicateName = await collection.findOne(
        { name: changes.name, _id: { $ne: _id } },
        { projection: { _id: 1 }, collation: { locale: "en", strength: 2 } }
      );
      if (duplicateName) return NextResponse.json({ message: "An IPO with this name already exists." }, { status: 409 });
    }

    const approvedSet = { ...changes };
    if (Array.isArray(changes.gmpHistory)) {
      const existingHistory = Array.isArray(existingIPO.gmpHistory) ? existingIPO.gmpHistory : [];
      approvedSet.gmpHistory = mergeGMPHistory(
        existingHistory as Array<{ date: string; value: string }>,
        changes.gmpHistory as Array<{ date: string; value: string }>
      );
    }
    const result = await collection.updateOne(
      { _id, slug: existingIPO.slug },
      { $set: { ...approvedSet, updatedAt: new Date() } }
    );
    if (!result.matchedCount) {
      return NextResponse.json({ message: "IPO changed while reviewing. Reload and try again." }, { status: 409 });
    }

    const { _id: omittedId, ...safeExistingIPO } = existingIPO;
    void omittedId;
    return NextResponse.json({
      message: "Approved IPO fields updated successfully.",
      changedFields: Object.keys(changes),
      ipo: { ...safeExistingIPO, ...approvedSet, id: body.id },
    });
  } catch (error) {
    console.error("PATCH IPO ERROR:", error);
    return NextResponse.json({ message: "Unable to apply approved IPO changes." }, { status: 500 });
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
