import { Suspense } from "react";
import { redirect } from "next/navigation";
import CategoryDetails from "./CategoryDetails";
import { createClient } from "@/server/db/supabase";

interface PageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { categorySlug } = await params;
  const normalized = categorySlug.toLowerCase();

  // Normalize singular categories to plural
  if (normalized === "call-girl") redirect("/call-girls");
  if (normalized === "male-escort") redirect("/male-escorts");
  if (normalized === "adult-meeting") redirect("/adult-meetings");

  // Validate against DB categories
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("slug")
    .eq("slug", normalized)
    .maybeSingle();

  if (!category) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-500 font-semibold">Loading listings...</div>}>
      <CategoryDetails categorySlug={normalized} />
    </Suspense>
  );
}
