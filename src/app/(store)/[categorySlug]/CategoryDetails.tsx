"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SearchBar from "@/components/site/SearchBar";
import ListingCard from "@/features/catalog/components/ListingCard";
import { fetchListings } from "@/lib/api/listings";
import { formatSlug } from "@/lib/utils";
import { ListingAd } from "@/types/listings";

interface CategoryDetailsProps {
  categorySlug: string;
  citySlug?: string;
}

const CITY_INFO: Record<string, { state: string; label: string }> = {
  bangalore: { state: "Karnataka", label: "Bangalore" },
  hyderabad: { state: "Telangana", label: "Hyderabad" },
  mumbai: { state: "Maharashtra", label: "Mumbai" },
  delhi: { state: "Delhi", label: "Delhi" },
  pune: { state: "Maharashtra", label: "Pune" }
};

// Map slug to singular display terms for page header
const getPageTitle = (slug: string) => {
  if (slug === "call-girls") return "Call Girl";
  if (slug === "massage") return "Massage";
  if (slug === "male-escorts") return "Male Escort";
  if (slug === "transsexual") return "Shemale Escort";
  if (slug === "adult-meetings") return "Adult Dating";
  return formatSlug(slug);
};

export default function CategoryDetails({ categorySlug, citySlug }: CategoryDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const category = formatSlug(categorySlug);
  const pageTitle = getPageTitle(categorySlug);

  // States read from URL Search Params
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  
  // Demographics and service query filters
  const searchQuery = searchParams.get("search") || "";
  const ethnicity = searchParams.get("ethnicity") || "";
  const nationality = searchParams.get("nationality") || "";
  const breast = searchParams.get("breast") || "";
  const hair = searchParams.get("hair") || "";
  const bodyType = searchParams.get("bodyType") || "";
  const services = searchParams.get("services") || "";
  const attentionTo = searchParams.get("attentionTo") || "";
  const placeOfService = searchParams.get("placeOfService") || "";
  const area = searchParams.get("area") || "";

  // Data fetching states
  const [listings, setListings] = useState<ListingAd[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchListings({
      categorySlug,
      citySlug,
      searchQuery,
      page: currentPage,
      limit: 15,
      ethnicity,
      nationality,
      breast,
      hair,
      bodyType,
      services,
      attentionTo,
      placeOfService,
      area
    }).then((res) => {
      if (isMounted) {
        setListings(res.listings);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalItems);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    categorySlug, 
    citySlug, 
    searchQuery, 
    currentPage, 
    ethnicity, 
    nationality, 
    breast, 
    hair, 
    bodyType, 
    services, 
    attentionTo, 
    placeOfService, 
    area
  ]);

  const handlePageChange = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNum.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    // Navigate back to current category list without query parameters
    const path = citySlug ? `/${categorySlug}/${citySlug.toLowerCase()}` : `/${categorySlug}`;
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      
      {/* HEADER NAVBAR */}
      <Header />

      {/* SEARCH BAR SECTION WITH FILTER MODAL INTEGRATION */}
      <section className="bg-gray-50/50 py-8 px-6 border-b border-gray-100 flex justify-center">
        <SearchBar variant="listings" initialCategory={categorySlug} initialCity={citySlug} />
      </section>

      {/* BREADCRUMBS & HEADING */}
      <section className="pt-8 pb-6 px-6 sm:px-12 max-w-5xl mx-auto w-full select-none">
        {/* Dynamic Breadcrumbs matching Oklute hierarchy */}
        {citySlug && CITY_INFO[citySlug.toLowerCase()] ? (
          <div className="flex flex-wrap items-center gap-1 text-xs text-[#cf4f41] font-semibold mb-4">
            <Link href="/" className="hover:underline">Oklute India</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href={`/${categorySlug}`} className="hover:underline">{category}</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400 font-bold">{CITY_INFO[citySlug.toLowerCase()].state} {category}</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500 font-bold">{CITY_INFO[citySlug.toLowerCase()].label} {category}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-[#cf4f41] font-semibold mb-4">
            <Link href="/" className="hover:underline">Oklute India</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500 font-bold">{category}</span>
          </div>
        )}

        {/* Dynamic Page Headline */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
          {citySlug && CITY_INFO[citySlug.toLowerCase()]
            ? `${pageTitle} in ${CITY_INFO[citySlug.toLowerCase()].label}`
            : `${pageTitle} India`}
        </h1>
      </section>

      {/* LISTINGS COLUMN */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 sm:px-12 pb-16">
        <div className="flex flex-col gap-6">
          {isLoading ? (
            // LOADING SKELETON PLACEHOLDERS
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row gap-6 animate-pulse">
                <div className="w-full md:w-56 h-44 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : listings.length > 0 ? (
            listings.map((ad) => (
              <ListingCard key={ad.id} ad={ad} categorySlug={categorySlug} />
            ))
          ) : (
            // NO RESULTS STATE
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center select-none shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#202e4d] mb-1">No listings match these filters</h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                Try expanding your search criteria or resetting your active demographic filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#cf4f41] hover:bg-[#b03d31] text-white text-xs font-bold px-6 py-3 rounded-full transition-colors cursor-pointer"
              >
                RESET FILTERS
              </button>
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 select-none">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center justify-center p-2.5 rounded-xl border border-gray-100 transition-colors cursor-pointer bg-white ${
                  currentPage === 1 ? "opacity-50 pointer-events-none" : "hover:bg-gray-50"
                }`}
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#cf4f41] text-white"
                        : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center p-2.5 rounded-xl border border-gray-100 transition-colors cursor-pointer bg-white ${
                  currentPage === totalPages ? "opacity-50 pointer-events-none" : "hover:bg-gray-50"
                }`}
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
