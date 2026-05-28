"use server";

import { createClient } from "@/server/db/supabase";
import { ListingAd, FetchListingsParams, ListingsResponse } from "@/types/listings";
import { slugify, formatSlug, CITY_TO_STATE, getMockAds } from "@/lib/utils";

// API Service Function: fetch listings with filters (connecting to Supabase)
export const fetchListings = async ({
  categorySlug,
  citySlug,
  searchQuery = "",
  page = 1,
  limit = 15,
  ethnicity,
  nationality,
  breast,
  hair,
  bodyType,
  services,
  attentionTo,
  placeOfService,
  area
}: FetchListingsParams): Promise<ListingsResponse> => {
  "use server";

  // Check if env variables exist. If not, use mock fallback.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase credentials missing, falling back to mock listings.");
    let listings = getMockAds().filter((ad) => {
      const matchCategory = ad.id.startsWith(categorySlug.substring(0, 3));
      const matchCity = citySlug ? ad.city.toLowerCase() === citySlug.toLowerCase() : true;
      return matchCategory && matchCity;
    });
    
    // Sort VIP first
    listings.sort((a, b) => (b.isVip ? 1 : 0) - (a.isVip ? 1 : 0));
    const totalItems = listings.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginated = listings.slice(startIndex, startIndex + limit);
    
    return { listings: paginated, totalPages, currentPage: page, totalItems };
  }

  try {
    const supabase = await createClient();

    // 1. Fetch category ID
    const { data: catData, error: catError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();

    if (catError || !catData) {
      console.error("Category fetch error or not found:", categorySlug, catError);
      return { listings: [], totalPages: 0, currentPage: page, totalItems: 0 };
    }

    // Increment category clicks in the database asynchronously
    supabase
      .rpc("increment_category_clicks", { cat_id: catData.id })
      .then(({ error: rpcError }) => {
        if (rpcError) console.error("Failed to increment category clicks:", rpcError);
      });

    // 2. Base Query
    let query = supabase
      .from("listings")
      .select("*, city:cities(name, state_name)", { count: "exact" })
      .eq("category_id", catData.id)
      .eq("status", "published");

    // 3. City Slug Check
    if (citySlug && citySlug !== "all-cities") {
      const { data: cityData, error: cityError } = await supabase
        .from("cities")
        .select("id")
        .eq("slug", citySlug)
        .maybeSingle();

      if (cityError || !cityData) {
        console.warn("City slug not found in DB:", citySlug);
        return { listings: [], totalPages: 0, currentPage: page, totalItems: 0 };
      }

      query = query.eq("city_id", cityData.id);
    }

    // 4. Text Search
    if (searchQuery && searchQuery.trim()) {
      const q = `%${searchQuery.trim()}%`;
      query = query.or(`title.ilike.${q},description.ilike.${q},name.ilike.${q}`);
    }

    // 5. Demographics filters
    if (ethnicity) query = query.in("ethnicity", ethnicity.split(","));
    if (nationality) query = query.in("nationality", nationality.split(","));
    if (breast) query = query.in("breast", breast.split(","));
    if (hair) query = query.in("hair", hair.split(","));
    if (bodyType) query = query.in("body_type", bodyType.split(","));

    // 6. Array filters
    if (services) query = query.overlaps("services", services.split(","));
    if (attentionTo) query = query.overlaps("attention_to", attentionTo.split(","));
    if (placeOfService) query = query.overlaps("place_of_service", placeOfService.split(","));
    
    if (area && area.trim()) {
      const a = `%${area.trim()}%`;
      query = query.or(`title.ilike.${a},description.ilike.${a}`);
    }

    // 7. Sort: VIP first, then newest
    query = query.order("is_vip", { ascending: false }).order("created_at", { ascending: false });

    // 8. Pagination Range
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) {
      console.error("Error executing supabase query:", error);
      throw error;
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    const mappedListings: ListingAd[] = (data || []).map((row) => ({
      id: row.ad_id,
      ad_id: row.ad_id,
      title: row.title,
      description: row.description || "",
      name: row.name || "",
      age: row.age || 0,
      city: row.city?.name || "",
      state: row.city?.state_name || "",
      isVip: row.is_vip,
      photoCount: row.images ? row.images.length : 0,
      images: row.images || [],
      phone: row.phone || "",
      whatsapp: row.whatsapp || "",
      date: row.created_at ? new Date(row.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short" }).toUpperCase() : "",
      aboutMe: row.about_me || [],
      tags: row.tags || [],
      services: row.services || [],
      attentionTo: row.attention_to || [],
      placeOfService: row.place_of_service || [],
      ethnicity: row.ethnicity || "",
      nationality: row.nationality || "",
      breast: row.breast || "",
      hair: row.hair || "",
      bodyType: row.body_type || ""
    }));

    return {
      listings: mappedListings,
      totalPages,
      currentPage: page,
      totalItems
    };
  } catch (err) {
    console.error("Failed to query listings from Supabase:", err);
    return { listings: [], totalPages: 0, currentPage: page, totalItems: 0 };
  }
};

// API Service Function: fetch individual ad by slug
export const fetchAdBySlug = async (categorySlug: string, slug: string): Promise<ListingAd | null> => {
  "use server";

  // Check environment fallback
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase credentials missing, falling back to mock details.");
    const allAds = getMockAds();
    const ad = allAds.find((a) => {
      const isCategory = a.id.startsWith(categorySlug.substring(0, 3));
      if (!isCategory) return false;
      const formattedSlug = `${slugify(a.title)}-${a.id}`;
      return slug === formattedSlug || slug.endsWith(a.id);
    });
    return ad || null;
  }

  try {
    const supabase = await createClient();

    // Ad ID is the alphanumeric suffix after the last dash
    const parts = slug.split("-");
    const adId = parts[parts.length - 1].toUpperCase();

    const { data, error } = await supabase
      .from("listings")
      .select("*, city:cities(name, state_name)")
      .eq("ad_id", adId)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      console.warn("Ad details not found for ID:", adId, error);
      return null;
    }

    // Record page view asynchronously
    supabase
      .from("page_views")
      .insert({ listing_id: data.id })
      .then(({ error: viewErr }) => {
        if (viewErr) console.error("Failed to insert page view stats:", viewErr);
      });

    return {
      id: data.ad_id,
      ad_id: data.ad_id,
      title: data.title,
      description: data.description || "",
      name: data.name || "",
      age: data.age || 0,
      city: data.city?.name || "",
      state: data.city?.state_name || "",
      isVip: data.is_vip,
      photoCount: data.images ? data.images.length : 0,
      images: data.images || [],
      phone: data.phone || "",
      whatsapp: data.whatsapp || "",
      date: data.created_at ? new Date(data.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short" }).toUpperCase() : "",
      aboutMe: data.about_me || [],
      tags: data.tags || [],
      services: data.services || [],
      attentionTo: data.attention_to || [],
      placeOfService: data.place_of_service || [],
      ethnicity: data.ethnicity || "",
      nationality: data.nationality || "",
      breast: data.breast || "",
      hair: data.hair || "",
      bodyType: data.body_type || ""
    };
  } catch (err) {
    console.error("Failed to fetch ad details:", err);
    return null;
  }
};
