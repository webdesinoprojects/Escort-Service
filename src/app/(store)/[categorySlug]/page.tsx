import { Suspense } from "react";
import { redirect } from "next/navigation";
import CategoryDetails from "./CategoryDetails";

interface PageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { categorySlug: "call-girls" },
    { categorySlug: "massage" },
    { categorySlug: "male-escorts" },
    { categorySlug: "transsexual" },
    { categorySlug: "adult-meetings" }
  ];
}

export default async function Page({ params }: PageProps) {
  const { categorySlug } = await params;
  
  // Normalize singular categories to plural
  const normalized = categorySlug.toLowerCase();
  if (normalized === "call-girl") {
    redirect("/call-girls");
  }
  if (normalized === "male-escort") {
    redirect("/male-escorts");
  }
  if (normalized === "adult-meeting") {
    redirect("/adult-meetings");
  }

  // Ensure only valid categories are rendered, otherwise fallback to home
  const validSlugs = ["call-girls", "massage", "male-escorts", "transsexual", "adult-meetings"];
  if (!validSlugs.includes(normalized)) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-500 font-semibold">Loading listings...</div>}>
      <CategoryDetails categorySlug={normalized} />
    </Suspense>
  );
}
