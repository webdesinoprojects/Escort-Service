"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { User, Search } from "lucide-react";
import FilterModal from "./FilterModal";

interface HeaderProps {
  showSearchIcon?: boolean;
}

export default function Header({ showSearchIcon = true }: HeaderProps) {
  const router = useRouter();
  const params = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Resolve category and city from URL path if present
  const categorySlug = (params?.categorySlug as string) || undefined;
  const citySlug = (params?.citySlug as string) || undefined;

  return (
    <>
      <header className="bg-white border-b border-gray-100 h-20 flex items-center px-6 sm:px-12 justify-between sticky top-0 z-40 shadow-sm select-none">
        {/* Logo */}
        <div 
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-98 transition-all" 
          onClick={() => router.push("/")}
          id="header-logo"
        >
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <circle cx="35" cy="32" r="12" fill="#d9574a" />
            <path d="M15 75 C 15 50, 55 50, 55 75 Z" fill="#d9574a" />
            <circle cx="65" cy="32" r="12" fill="#202e4d" />
            <path d="M45 75 C 45 50, 85 50, 85 75 Z" fill="#202e4d" />
          </svg>
          <div className="flex flex-col justify-center leading-none">
            <span className="text-[26px] font-extrabold text-[#202e4d] tracking-tight">Oklute</span>
            <span className="text-[9px] font-bold text-[#f06e2e] tracking-widest mt-0.5 uppercase pl-0.5">India</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-6">
          {showSearchIcon && (
            <Search 
              onClick={() => setIsFilterOpen(true)}
              className="w-6 h-6 text-[#202e4d] cursor-pointer hover:opacity-75 transition-opacity" 
            />
          )}
          <User className="w-6 h-6 text-[#202e4d] cursor-pointer hover:opacity-75 transition-opacity" />
          <button 
            onClick={() => router.push("/")}
            className="bg-[#202e4d] hover:bg-[#162036] active:scale-95 text-white text-xs font-bold tracking-wide px-5 py-3 rounded transition-all uppercase shadow-sm"
            suppressHydrationWarning={true}
          >
            POST YOUR AD
          </button>
        </div>
      </header>

      {/* Global Filter Search Overlay Modal */}
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        initialCategory={categorySlug}
        initialCity={citySlug}
      />
    </>
  );
}
