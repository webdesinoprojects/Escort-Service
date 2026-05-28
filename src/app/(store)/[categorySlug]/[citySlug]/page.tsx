import { Suspense } from "react";
import { redirect } from "next/navigation";
import CategoryDetails from "../CategoryDetails";
import AdDetails from "./AdDetails";
import { fetchAdBySlug } from "@/lib/api/listings";
import { slugify, getMockAds } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    categorySlug: string;
    citySlug: string;
  }>;
}

const KNOWN_CITIES = ["bangalore", "hyderabad", "mumbai", "delhi", "pune"];

export async function generateStaticParams() {
  const categories = ["call-girls", "massage", "male-escorts", "transsexual", "adult-meetings"];
  const cities = KNOWN_CITIES;
  
  const params: { categorySlug: string; citySlug: string }[] = [];
  
  // 1. Generate parameters for category city pages (e.g. /call-girls/bangalore)
  categories.forEach(cat => {
    cities.forEach(city => {
      params.push({ categorySlug: cat, citySlug: city });
    });
  });

  // 2. Generate parameters for specific detailed ad pages (e.g. /call-girls/some-title-mas1001abcd)
  const mockAds = getMockAds();
  mockAds.forEach(ad => {
    let catSlug = "call-girls";
    if (ad.id.startsWith("mas")) catSlug = "massage";
    else if (ad.id.startsWith("mal")) catSlug = "male-escorts";
    else if (ad.id.startsWith("tra")) catSlug = "transsexual";
    else if (ad.id.startsWith("adu")) catSlug = "adult-meetings";

    params.push({
      categorySlug: catSlug,
      citySlug: `${slugify(ad.title)}-${ad.id}`
    });
  });

  return params;
}

// Inner Server Component that fetches the ad and handles suspension
async function AdDetailsWrapper({ categorySlug, citySlug }: { categorySlug: string; citySlug: string }) {
  const ad = await fetchAdBySlug(categorySlug, citySlug);
  
  if (!ad) {
    // If ad is not found, fallback safely to the category listings page
    redirect(`/${categorySlug}`);
  }

  return <AdDetails ad={ad} categorySlug={categorySlug} />;
}

export default async function Page({ params }: PageProps) {
  const { categorySlug, citySlug } = await params;
  
  const categoryLower = categorySlug.toLowerCase();
  const cityLower = citySlug.toLowerCase();

  // Redirect singulars if necessary
  if (categoryLower === "call-girl") redirect(`/call-girls/${citySlug}`);
  if (categoryLower === "male-escort") redirect(`/male-escorts/${citySlug}`);
  if (categoryLower === "adult-meeting") redirect(`/adult-meetings/${citySlug}`);

  const validCategories = ["call-girls", "massage", "male-escorts", "transsexual", "adult-meetings"];
  if (!validCategories.includes(categoryLower)) {
    redirect("/");
  }

  // 1. Switch Route Case: It is a city listing page
  if (KNOWN_CITIES.includes(cityLower)) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-500 font-semibold">Loading listings...</div>}>
        <CategoryDetails categorySlug={categoryLower} citySlug={cityLower} />
      </Suspense>
    );
  }

  // 2. Switch Route Case: It is a detailed ad page
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-500 font-semibold">Loading details...</div>}>
      <AdDetailsWrapper categorySlug={categoryLower} citySlug={citySlug} />
    </Suspense>
  );
}
