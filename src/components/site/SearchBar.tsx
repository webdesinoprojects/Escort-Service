"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import FilterModal from "./FilterModal";

interface SearchBarProps {
  variant?: "home" | "listings";
  initialCategory?: string;
  initialCity?: string;
}

export default function SearchBar({ variant = "listings", initialCategory, initialCity }: SearchBarProps) {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  // Sync display search query with URL params
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchVal(currentSearch);
  }, [searchParams]);

  if (variant === "home") {
    return (
      <div className="w-full max-w-4xl relative">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white rounded-full flex items-center px-6 py-4 gap-3 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer select-none"
        >
          <input
            type="text"
            readOnly
            value={searchVal}
            placeholder="Search By City, Category, Filters..."
            className="flex-1 bg-transparent outline-none text-gray-800 text-lg placeholder-gray-400 font-sans cursor-pointer"
            suppressHydrationWarning={true}
          />
          <Search className="w-6 h-6 text-gray-400 shrink-0 hover:text-gray-600 transition-colors" />
        </div>

        {/* Filter Popup Modal */}
        <FilterModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialCategory={initialCategory}
          initialCity={initialCity}
        />
      </div>
    );
  }

  // default variant: "listings" (compact layout with red search button)
  return (
    <div className="w-full max-w-4xl relative">
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-full border border-gray-200 flex items-center pl-6 pr-2 py-2 gap-3 shadow-sm hover:shadow transition-shadow duration-300 cursor-pointer select-none"
      >
        {/* MapPin / Search icon left */}
        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <input
          type="text"
          readOnly
          value={searchVal}
          placeholder="Search by city, name, filters..."
          className="flex-1 bg-transparent outline-none text-gray-800 text-base placeholder-gray-400 font-sans cursor-pointer"
          suppressHydrationWarning={true}
        />
        {/* Red Magnifying Glass Button */}
        <button 
          className="bg-[#cf4f41] hover:bg-[#b03d31] text-white p-3 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0"
          suppressHydrationWarning={true}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Popup Modal */}
      <FilterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialCategory={initialCategory}
        initialCity={initialCity}
      />
    </div>
  );
}
