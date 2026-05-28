import { Suspense } from "react";
import { redirect } from "next/navigation";
import CategoryDetails from "../CategoryDetails";
import AdDetails from "./AdDetails";
import { fetchAdBySlug } from "@/lib/api/listings";
import { createClient } from "@/server/db/supabase";

interface PageProps {
  params: Promise<{
    categorySlug: string;
    citySlug: string;
  }>;
}

async function AdDetailsWrapper({ categorySlug, citySlug }: { categorySlug: string; citySlug: string }) {
  const ad = await fetchAdBySlug(categorySlug, citySlug);

  if (!ad) {
    redirect(`/${categorySlug}`);
  }

  return <AdDetails ad={ad} categorySlug={categorySlug} />;
}

export default async function Page({ params }: PageProps) {
  const { categorySlug, citySlug } = await params;

  const categoryLower = categorySlug.toLowerCase();
  const cityLower = citySlug.toLowerCase();

  // Redirect singular forms
  if (categoryLower === "call-girl") redirect(`/call-girls/${citySlug}`);
  if (categoryLower === "male-escort") redirect(`/male-escorts/${citySlug}`);
  if (categoryLower === "adult-meeting") redirect(`/adult-meetings/${citySlug}`);

  // Validate category against DB
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("slug")
    .eq("slug", categoryLower)
    .maybeSingle();

  if (!category) {
    redirect("/");
  }

  // Check if cityLower matches a real city → category+city listing page
  const { data: city } = await supabase
    .from("cities")
    .select("slug")
    .eq("slug", cityLower)
    .maybeSingle();

  if (city) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-500 font-semibold">Loading listings...</div>}>
        <CategoryDetails categorySlug={categoryLower} citySlug={cityLower} />
      </Suspense>
    );
  }

  // Otherwise treat as detailed ad page
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-500 font-semibold">Loading details...</div>}>
      <AdDetailsWrapper categorySlug={categoryLower} citySlug={citySlug} />
    </Suspense>
  );
}
