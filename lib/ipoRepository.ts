import "server-only";

import { cache } from "react";
import type { Collection, Document, ObjectId, WithId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

export type IPORecord = Document & {
  name: string;
  slug?: string;
  oldSlugs?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type IPOSlugLookup = {
  ipo: WithId<IPORecord>;
  requestedSlug: string;
  canonicalSlug: string;
  shouldRedirect: boolean;
};

declare global {
  var __ipoSlugInfrastructurePromise: Promise<void> | undefined;
}

export function createIPOSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getIPOCollection() {
  return connectToDatabase().then((db) => db.collection<IPORecord>("ipos"));
}

async function slugExists(
  collection: Collection<IPORecord>,
  slug: string,
  excludeId?: ObjectId
) {
  return Boolean(
    await collection.findOne(
      {
        $or: [{ slug }, { oldSlugs: slug }],
        ...(excludeId ? { _id: { $ne: excludeId } } : {}),
      },
      { projection: { _id: 1 } }
    )
  );
}

async function findAvailableSlug(
  collection: Collection<IPORecord>,
  requestedSlug: string,
  excludeId?: ObjectId
) {
  let candidate = requestedSlug;
  let suffix = 2;

  while (await slugExists(collection, candidate, excludeId)) {
    candidate = `${requestedSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function initializeIPOSlugInfrastructure() {
  const collection = await getIPOCollection();
  const missingSlugIPOs = await collection
    .find(
      {
        $or: [
          { slug: { $exists: false } },
          { slug: null as unknown as string },
          { slug: "" },
        ],
      },
      { projection: { _id: 1, name: 1 } }
    )
    .sort({ _id: -1 })
    .toArray();

  for (const ipo of missingSlugIPOs) {
    const baseSlug = createIPOSlug(ipo.name) || `ipo-${ipo._id.toString()}`;
    const slug = await findAvailableSlug(collection, baseSlug, ipo._id);

    await collection.updateOne(
      {
        _id: ipo._id,
        $or: [
          { slug: { $exists: false } },
          { slug: null as unknown as string },
          { slug: "" },
        ],
      },
      { $set: { slug } }
    );
  }

  await collection.createIndex(
    { slug: 1 },
    {
      name: "ipos_slug_unique",
      unique: true,
      partialFilterExpression: { slug: { $type: "string" } },
    }
  );
  await collection.createIndex(
    { oldSlugs: 1 },
    { name: "ipos_old_slugs" }
  );
}

export async function ensureIPOSlugInfrastructure() {
  if (!globalThis.__ipoSlugInfrastructurePromise) {
    globalThis.__ipoSlugInfrastructurePromise =
      initializeIPOSlugInfrastructure().catch((error) => {
        globalThis.__ipoSlugInfrastructurePromise = undefined;
        throw error;
      });
  }

  await globalThis.__ipoSlugInfrastructurePromise;
}

export async function getIPOsCollection() {
  await ensureIPOSlugInfrastructure();
  return getIPOCollection();
}

export const getIPOBySlug = cache(
  async (requestedSlug: string): Promise<IPOSlugLookup | null> => {
    await ensureIPOSlugInfrastructure();
    const collection = await getIPOCollection();
    const ipo = await collection.findOne({
      $or: [{ slug: requestedSlug }, { oldSlugs: requestedSlug }],
    });

    if (!ipo?.slug) return null;

    return {
      ipo,
      requestedSlug,
      canonicalSlug: ipo.slug,
      shouldRedirect: ipo.slug !== requestedSlug,
    };
  }
);

export async function getCanonicalSlugForOldSlug(oldSlug: string) {
  await ensureIPOSlugInfrastructure();
  const collection = await getIPOCollection();
  const ipo = await collection.findOne(
    { oldSlugs: oldSlug },
    { projection: { slug: 1 } }
  );

  return ipo?.slug || null;
}

export async function getUniqueIPOSlug(
  requestedSlug: string,
  excludeId?: ObjectId
) {
  const slug = createIPOSlug(requestedSlug);
  if (!slug) throw new Error("IPO slug cannot be empty.");

  const collection = await getIPOsCollection();
  if (await slugExists(collection, slug, excludeId)) return null;
  return slug;
}
