import { MetadataRoute } from "next";
import { createAdminClient } from "@/server/db/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const DEFAULT_CATEGORIES = [
  "call-girls",
  "massage",
  "male-escorts",
  "transsexual",
  "adult-meetings",
];

const DEFAULT_CITIES = ["bangalore", "hyderabad", "mumbai", "delhi", "pune"];

interface CategoryRecord { slug: string }
interface CityRecord { slug: string }
interface ListingRecord {
  id: string;
  ad_id: string | null;
  title: string | null;
  updated_at: string | null;
  created_at: string | null;
  category: CategoryRecord | null;
}

async function fetchCategories(): Promise<string[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }
    return (data as CategoryRecord[]).map((c) => c.slug);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

async function fetchCities(): Promise<string[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("cities")
      .select("slug")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CITIES;
    }
    return (data as CityRecord[]).map((c) => c.slug);
  } catch {
    return DEFAULT_CITIES;
  }
}

async function fetchPublishedListings(): Promise<Array<{ categorySlug: string; adSlug: string; lastModified: Date }>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("listings")
      .select("id, ad_id, title, updated_at, created_at, category:categories(slug)")
      .eq("status", "published");

    if (error || !data) {
      return [];
    }

    return (data as unknown as ListingRecord[])
      .map((listing) => {
        const categorySlug = listing.category?.slug || "";
        const adId = listing.ad_id || listing.id;
        const titleSlug = (listing.title || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        const adSlug = `${titleSlug}-${adId}`.toLowerCase();

        return {
          categorySlug,
          adSlug,
          lastModified: listing.updated_at
            ? new Date(listing.updated_at)
            : listing.created_at
              ? new Date(listing.created_at)
              : new Date(),
        };
      })
      .filter((item) => item.categorySlug && item.adSlug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();

  const [categorySlugs, citySlugs, listings] = await Promise.all([
    fetchCategories(),
    fetchCities(),
    fetchPublishedListings(),
  ]);

  urls.push({
    url: `${SITE_URL}/`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
  });

  categorySlugs.forEach((slug) => {
    urls.push({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  categorySlugs.forEach((category) => {
    citySlugs.forEach((city) => {
      urls.push({
        url: `${SITE_URL}/${category}/${city}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  });

  categorySlugs.forEach((category) => {
    urls.push({
      url: `${SITE_URL}/${category}/all-cities`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  listings.forEach((listing) => {
    urls.push({
      url: `${SITE_URL}/${listing.categorySlug}/${listing.adSlug}`,
      lastModified: listing.lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  });

  return urls;
}
