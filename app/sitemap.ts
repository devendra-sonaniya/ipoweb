import type { MetadataRoute } from "next";
import { getIPOsCollection } from "@/lib/ipoRepository";
import { absoluteUrl } from "@/lib/seo";

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
    const collection = await getIPOsCollection();
    const ipos = await collection
      .find(
        { slug: { $type: "string", $ne: "" } },
        { projection: { _id: 0, slug: 1, createdAt: 1, updatedAt: 1 } }
      )
      .toArray();

    return ipos
      .filter((ipo) => ipo.slug)
      .map((ipo) => ({
        url: absoluteUrl(`/ipo/${ipo.slug}`),
        ...(ipo.updatedAt || ipo.createdAt
          ? { lastModified: ipo.updatedAt || ipo.createdAt }
          : {}),
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
