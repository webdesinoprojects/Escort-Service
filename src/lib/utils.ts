import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ListingAd } from "@/types/listings"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const formatSlug = (slug: string) => {
  if (slug === "call-girls") return "Call Girls";
  if (slug === "massage") return "Massage";
  if (slug === "male-escorts") return "Male Escorts";
  if (slug === "transsexual") return "Transsexual";
  if (slug === "adult-meetings") return "Adult Meetings";
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export const CITY_TO_STATE: Record<string, string> = {
  bangalore: "Karnataka",
  hyderabad: "Telangana",
  mumbai: "Maharashtra",
  delhi: "Delhi",
  pune: "Maharashtra"
};

export const getMockAds = (): ListingAd[] => {
  const categories = ["call-girls", "massage", "male-escorts", "transsexual", "adult-meetings"];
  const cities = ["Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune"];
  const names = ["Vani", "Anjali", "Priya", "Riya", "Kavya", "Sonia", "Sneha", "Neha"];
  const titles = [
    "24/7 Available Adult Meeting Services VIP and Genuine Work",
    "Bangalore Low price Hotel Service Home Services Full Sex Trusted service",
    "Independent Premium Call Girls for sensuous escort service",
    "VIP Escort High Class Independent Model Available Home & Hotel",
    "Genuine Escort Service safe and secure independent call girl"
  ];
  const animeImages = [
    "/image0.png",
    "/image1.png",
    "/hero-anime.png",
    "/images/categories/call-girls.png",
    "/images/categories/massage.png",
    "/images/categories/male-escorts.png",
    "/images/categories/transsexual.png",
    "/images/categories/adult-meetings.png"
  ];

  const allAds: ListingAd[] = [];
  categories.forEach((catSlug) => {
    for (let i = 0; i < 20; i++) {
      const id = `${catSlug.substring(0, 3)}${1000 + i}`;
      const title = titles[i % titles.length];
      const name = names[i % names.length];
      const age = 19 + (i % 7);
      const city = cities[i % cities.length];
      const state = CITY_TO_STATE[city.toLowerCase()] || "State";
      
      allAds.push({
        id,
        title,
        description: "AVAILABLE FOR COMPLETE ENJOYMENT WITH HIGH PROFILE INDIAN MODEL AVAILABLE HOTEL & HOME ★ SAFE AND SECURE HIGH CLASS SERVICE AFFORDABLE RATE ★ SATISFACTION,UNLIMITED ENJOYMENT.",
        name,
        age,
        city,
        state,
        isVip: i % 4 === 0,
        photoCount: 3,
        images: [animeImages[i % animeImages.length], animeImages[(i + 1) % animeImages.length]],
        phone: `0911915${10000 + i}`,
        whatsapp: `https://wa.me/91911915${10000 + i}`,
        date: "28 MAY",
        aboutMe: ["★ SAFE AND SECURE HIGH CLASS SERVICE AFFORDABLE RATE", "★ All Meetings are confidential"],
        tags: ["Indian", "Slim"],
        services: ["Oral", "French kiss", "Role play"],
        attentionTo: ["Men", "Women"],
        placeOfService: ["Hotel / Motel", "Outcall"],
        ethnicity: "Indian",
        nationality: "Indian",
        breast: "Natural",
        hair: "Black",
        bodyType: "Slim"
      });
    }
  });
  return allAds;
};
