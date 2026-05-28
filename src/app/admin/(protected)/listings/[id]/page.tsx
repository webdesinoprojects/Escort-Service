import { getListingForEdit, getCategories, getCities } from "@/server/actions/admin";
import ListingEditorClient from "./ListingEditorClient";
import { notFound } from "next/navigation";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingEditorPage({ params }: EditorPageProps) {
  const { id } = await params;
  const isNew = id === "new";

  const [listing, categories, cities] = await Promise.all([
    isNew ? Promise.resolve(null) : getListingForEdit(id),
    getCategories(),
    getCities(),
  ]);

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
