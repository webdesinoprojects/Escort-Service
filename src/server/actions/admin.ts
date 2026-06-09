"use server";

import { createClient, createAdminClient } from "@/server/db/supabase";
import { revalidateTag } from "next/cache";
import {
  listingSchema,
  categorySchema,
  citySchema,
  heroSettingsSchema,
  loginSchema,
} from "@/server/validators/listings";
import { ListingAd } from "@/types/listings";

// Helper to assert admin authentication
async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
  return { supabase, user };
}

// Helper to generate a unique AD ID based on category slug
async function generateUniqueAdId(supabase: any, categoryId: string) {
  // Get category slug
  const { data: category } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", categoryId)
    .single();

  const prefix = category
    ? category.slug.substring(0, 3).toUpperCase()
    : "ADX";

  let adId = "";
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit code
    adId = `${prefix}${randomNum}`;

    const { data } = await supabase
      .from("listings")
      .select("id")
      .eq("ad_id", adId)
      .maybeSingle();

    if (!data) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    // Fallback to timestamp ID
    adId = `${prefix}${Date.now().toString().slice(-4)}`;
  }

  return adId;
}

// ----------------------------------------------------
// ADMIN AUTH ACTIONS
// ----------------------------------------------------
export async function adminLogin(formData: any) {
  try {
    const credentials = loginSchema.parse(formData);
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export async function adminLogout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getCurrentAdmin() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

// ----------------------------------------------------
// HERO CMS ACTIONS
// ----------------------------------------------------
export async function getHeroSettings() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return data || {
      hero_title: "Flying Solo? No Worries, Escort is made for all.",
      hero_subtitle: "Search or Post Your Adult Advertisement",
      hero_image_url: "",
    };
  } catch (err) {
    console.error("Failed to fetch site settings:", err);
    return {
      hero_title: "Flying Solo? No Worries, Escort is made for all.",
      hero_subtitle: "Search or Post Your Adult Advertisement",
      hero_image_url: "",
    };
  }
}

export async function updateHeroSettings(formData: any) {
  try {
    await assertAdmin();
    const data = heroSettingsSchema.parse(formData);

    const supabase = createAdminClient(); // Use admin client to bypass default select-only policy
    
    // Check if settings row exists
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .maybeSingle();

    let error;
    if (existing) {
      const { error: err } = await supabase
        .from("site_settings")
        .update({
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle,
          hero_image_url: data.hero_image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from("site_settings")
        .insert({
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle,
          hero_image_url: data.hero_image_url,
        });
      error = err;
    }

    if (error) throw error;

    revalidateTag("site_settings", "max");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// CATEGORIES CMS ACTIONS
// ----------------------------------------------------
export async function getCategories() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
}

export async function upsertCategory(formData: any) {
  try {
    await assertAdmin();
    const parsed = categorySchema.parse(formData);
    const supabase = createAdminClient();

    let result;
    if (parsed.id) {
      result = await supabase
        .from("categories")
        .update({
          title: parsed.title,
          slug: parsed.slug,
          description: parsed.description,
          image_url: parsed.image_url,
          icon_name: parsed.icon_name,
          order_index: parsed.order_index,
        })
        .eq("id", parsed.id);
    } else {
      result = await supabase
        .from("categories")
        .insert({
          title: parsed.title,
          slug: parsed.slug,
          description: parsed.description,
          image_url: parsed.image_url,
          icon_name: parsed.icon_name,
          order_index: parsed.order_index,
        });
    }

    if (result.error) throw result.error;

    revalidateTag("categories", "max");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;

    revalidateTag("categories", "max");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// LOCATIONS CMS ACTIONS
// ----------------------------------------------------
export async function getCities() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Failed to fetch cities:", err);
    return [];
  }
}

export async function upsertCity(formData: any) {
  try {
    await assertAdmin();
    const parsed = citySchema.parse(formData);
    const supabase = createAdminClient();

    let result;
    if (parsed.id) {
      result = await supabase
        .from("cities")
        .update({
          name: parsed.name,
          slug: parsed.slug,
          state_name: parsed.state_name,
        })
        .eq("id", parsed.id);
    } else {
      result = await supabase
        .from("cities")
        .insert({
          name: parsed.name,
          slug: parsed.slug,
          state_name: parsed.state_name,
        });
    }

    if (result.error) throw result.error;

    revalidateTag("cities", "max");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCity(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase.from("cities").delete().eq("id", id);
    if (error) throw error;

    revalidateTag("cities", "max");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// LISTINGS CRUD CMS ACTIONS
// ----------------------------------------------------
export async function getAdminListings({
  page = 1,
  limit = 15,
  status,
  search = "",
  sort = "updated_desc",
  dateRange = "all",
}: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: "updated_desc" | "created_desc" | "created_asc";
  dateRange?: "all" | "today" | "7d" | "30d";
}) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    let query = supabase
      .from("listings")
      .select("*, category:categories(title, slug), city:cities(name, state_name)", { count: "exact" });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search.trim()) {
      const q = `%${search.trim()}%`;
      query = query.or(`title.ilike.${q},name.ilike.${q},ad_id.ilike.${q}`);
    }

    if (dateRange !== "all") {
      const days = dateRange === "today" ? 1 : dateRange === "7d" ? 7 : 30;
      const since = new Date();
      since.setDate(since.getDate() - (days - 1));
      since.setHours(0, 0, 0, 0);
      query = query.gte("created_at", since.toISOString());
    }

    if (sort === "created_desc") {
      query = query.order("created_at", { ascending: false });
    } else if (sort === "created_asc") {
      query = query.order("created_at", { ascending: true });
    } else {
      query = query.order("updated_at", { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      listings: data || [],
      totalPages,
      currentPage: page,
      totalItems,
    };
  } catch (err: any) {
    console.error("Failed to load admin listings:", err);
    return { listings: [], totalPages: 0, currentPage: page, totalItems: 0, error: err.message };
  }
}

export async function getListingForEdit(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Failed to fetch listing for editing:", err);
    return null;
  }
}

export async function upsertListing(formData: any) {
  try {
    await assertAdmin();
    const parseResult = listingSchema.safeParse(formData);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const path = firstIssue?.path?.join(".") || "field";
      return { success: false, error: `${path}: ${firstIssue?.message || "Invalid input"}` };
    }
    const parsed = parseResult.data;
    const supabase = createAdminClient();

    let result;
    if (parsed.id) {
      // Update existing listing
      result = await supabase
        .from("listings")
        .update({
          title: parsed.title,
          name: parsed.name,
          age: parsed.age,
          description: parsed.description,
          phone: parsed.phone,
          whatsapp: parsed.whatsapp,
          is_vip: parsed.is_vip,
          status: parsed.status,
          category_id: parsed.category_id,
          city_id: parsed.city_id,
          images: parsed.images,
          about_me: parsed.about_me,
          tags: parsed.tags,
          services: parsed.services,
          attention_to: parsed.attention_to,
          place_of_service: parsed.place_of_service,
          ethnicity: parsed.ethnicity,
          nationality: parsed.nationality,
          breast: parsed.breast,
          hair: parsed.hair,
          body_type: parsed.body_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", parsed.id);
    } else {
      // Create new listing
      const adId = await generateUniqueAdId(supabase, parsed.category_id);
      
      result = await supabase
        .from("listings")
        .insert({
          ad_id: adId,
          title: parsed.title,
          name: parsed.name,
          age: parsed.age,
          description: parsed.description,
          phone: parsed.phone,
          whatsapp: parsed.whatsapp,
          is_vip: parsed.is_vip,
          status: parsed.status,
          category_id: parsed.category_id,
          city_id: parsed.city_id,
          images: parsed.images,
          about_me: parsed.about_me,
          tags: parsed.tags,
          services: parsed.services,
          attention_to: parsed.attention_to,
          place_of_service: parsed.place_of_service,
          ethnicity: parsed.ethnicity,
          nationality: parsed.nationality,
          breast: parsed.breast,
          hair: parsed.hair,
          body_type: parsed.body_type,
        });
    }

    if (result.error) throw result.error;

    revalidateTag("listings", "max");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteListing(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) throw error;

    revalidateTag("listings", "max");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleListingStatus(id: string, currentStatus: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("listings")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    revalidateTag("listings", "max");
    return { success: true, newStatus };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function archiveListing(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("listings")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    revalidateTag("listings", "max");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// ANALYTICS & DASHBOARD CHARTS ACTIONS
// ----------------------------------------------------
export async function getDashboardStats() {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    // Calculate date threshold for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Fetch counts in parallel
    const [
      { count: totalAds },
      { count: activeAds },
      { count: draftAds },
      { count: archivedAds },
      { count: vipAds },
      { data: listingsByCategory },
      { data: recentActivity },
      { data: adsLast7Days },
      { data: viewsLast7Days },
    ] = await Promise.all([
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "archived"),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("is_vip", true),
      // Join to get counts by category
      supabase.from("listings").select("category_id, category:categories(title)"),
      // Recent registrations
      supabase
        .from("listings")
        .select("id, ad_id, title, status, created_at, category:categories(title)")
        .order("created_at", { ascending: false })
        .limit(5),
      // Ads created in last 7 days
      supabase.from("listings").select("created_at").gte("created_at", sevenDaysAgo.toISOString()),
      // Page views in last 7 days
      supabase.from("page_views").select("created_at").gte("created_at", sevenDaysAgo.toISOString()),
    ]);

    // Count categories distribution
    const categoryCountsMap: Record<string, number> = {};
    (listingsByCategory || []).forEach((item: any) => {
      const title = item.category?.title || "Unknown";
      categoryCountsMap[title] = (categoryCountsMap[title] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryCountsMap).map(([name, value]) => ({
      name,
      value,
    }));

    // Process last 7 days dynamic timeline for Recharts
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    interface TimelineDay {
      name: string;
      dayOfMonth: number;
      month: number;
      year: number;
      Views: number;
      Ads: number;
    }
    const timeline: TimelineDay[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      timeline.push({
        name: dayName,
        dayOfMonth: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        Views: 0,
        Ads: 0,
      });
    }

    // Populate views count
    (viewsLast7Days || []).forEach((v: any) => {
      const viewDate = new Date(v.created_at);
      const match = timeline.find(t => 
        t.dayOfMonth === viewDate.getDate() &&
        t.month === viewDate.getMonth() &&
        t.year === viewDate.getFullYear()
      );
      if (match) match.Views++;
    });

    // Populate ads count
    (adsLast7Days || []).forEach((a: any) => {
      const adDate = new Date(a.created_at);
      const match = timeline.find(t => 
        t.dayOfMonth === adDate.getDate() &&
        t.month === adDate.getMonth() &&
        t.year === adDate.getFullYear()
      );
      if (match) match.Ads++;
    });

    const viewsTimeline = timeline.map(t => ({
      name: t.name,
      Views: t.Views,
      Ads: t.Ads,
    }));

    return {
      stats: {
        totalAds: totalAds || 0,
        activeAds: activeAds || 0,
        draftAds: draftAds || 0,
        archivedAds: archivedAds || 0,
        vipAds: vipAds || 0,
      },
      categoryDistribution,
      viewsTimeline,
      recentActivity: recentActivity || [],
    };
  } catch (err: any) {
    console.error("Failed to load dashboard statistics:", err);
    return {
      stats: { totalAds: 0, activeAds: 0, draftAds: 0, archivedAds: 0, vipAds: 0 },
      categoryDistribution: [],
      viewsTimeline: [],
      recentActivity: [],
      error: err.message,
    };
  }
}
