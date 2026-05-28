import { createClient, createAdminClient } from "@/server/db/supabase";
import ListingEditorClient from "./ListingEditorClient";
import { notFound, redirect } from "next/navigation";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingEditorPage({ params }: EditorPageProps) {
  const { id } = await params;
  const isNew = id === "new";

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/admin/login");
  }

  const adminSupabase = createAdminClient();

  const [listingResult, categoriesResult, citiesResult] = await Promise.all([
    isNew
      ? Promise.resolve({ data: null, error: null })
      : adminSupabase.from("listings").select("*").eq("id", id).maybeSingle(),
    adminSupabase.from("categories").select("*").order("order_index", { ascending: true }),
    adminSupabase.from("cities").select("*").order("name", { ascending: true }),
  ]);

  if (listingResult.error) throw new Error(`Listing query failed: ${listingResult.error.message}`);
  if (categoriesResult.error) throw new Error(`Categories query failed: ${categoriesResult.error.message}`);
  if (citiesResult.error) throw new Error(`Cities query failed: ${citiesResult.error.message}`);

  const listing = listingResult.data;
  const categories = categoriesResult.data || [];
  const cities = citiesResult.data || [];

  if (!isNew && !listing) {
    notFound();
  }

  return (
    <ListingEditorClient
      listing={listing}
      categories={categories}
      cities={cities}
      isNew={isNew}
    />
  );
}
