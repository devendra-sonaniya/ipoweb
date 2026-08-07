import type { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { absoluteUrl } from "@/lib/seo";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const staticRoutes: Array<{
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/gmp", changeFrequency: "daily", priority: 0.9 },
  { path: "/mainboard-ipo", changeFrequency: "daily", priority: 0.9 },
  { path: "/sme-ipo", changeFrequency: "daily", priority: 0.9 },
  { path: "/upcoming-ipo", changeFrequency: "daily", priority: 0.9 },
  { path: "/ipo-calendar", changeFrequency: "daily", priority: 0.9 },
  { path: "/allotment-status", changeFrequency: "daily", priority: 0.8 },
  { path: "/ipo-allotment-status", changeFrequency: "daily", priority: 0.8 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.4 },
  { path: "/risk-disclosure", changeFrequency: "yearly", priority: 0.4 },
  { path: "/ipo-faq", changeFrequency: "monthly", priority: 0.7 },
];

async function getIPOSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const db = await connectToDatabase();
    const ipos = await db
      .collection<{ name: string }>("ipos")
      .find({}, { projection: { _id: 0, name: 1 } })
      .toArray();

    return ipos
      .filter((ipo) => ipo.name)
      .map((ipo) => ({
        url: absoluteUrl(`/ipo/${createSlug(ipo.name)}`),
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error("Unable to add IPO pages to the sitemap.", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticEntries, ...(await getIPOSitemapEntries())];
}

export const dynamic = "force-dynamic";
