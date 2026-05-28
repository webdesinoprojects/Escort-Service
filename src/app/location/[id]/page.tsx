import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return [
    { id: "call-girls-bangalore" }
  ];
}

export default async function LegacyLocationPage({ params }: PageProps) {
  const { id } = await params;
  const decoded = decodeURIComponent(id).toLowerCase();
  
  const cities = ["bangalore", "hyderabad", "mumbai", "delhi", "pune", "all-cities"];
  let foundCity = "";
  let foundCategory = "";
  
  for (const city of cities) {
    if (decoded.endsWith(`-${city}`)) {
      foundCity = city;
      foundCategory = decoded.substring(0, decoded.length - city.length - 1);
      break;
    }
  }
  
  if (foundCity && foundCategory) {
    redirect(`/${foundCategory}/${foundCity}`);
  } else {
    redirect("/");
  }
}
