"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { User, Search } from "lucide-react";
import FilterModal from "./FilterModal";

interface HeaderProps {
  showSearchIcon?: boolean;
  initialCategory?: string;
  initialCity?: string;
}

export default function Header({
  showSearchIcon = true,
  initialCategory,
  initialCity,
}: HeaderProps) {
  const router = useRouter();
  const params = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Resolve category and city from URL path if present
  const categorySlug = initialCategory || (params?.categorySlug as string) || undefined;
  const citySlug = initialCity || (params?.citySlug as string) || undefined;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`h-20 flex items-center px-6 sm:px-12 justify-between sticky top-0 z-40 select-none border-b transition-all duration-300 ${
          isScrolled 
            ? "bg-white/70 backdrop-blur-md shadow-md border-gray-200/50" 
            : "bg-white shadow-sm border-gray-100"
        }`}
      >
        {/* Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:scale-98 transition-all" 
          onClick={() => router.push("/")}
          id="header-logo"
        >
          <img src="/logo.png" alt="Escort Logo" className="h-14 w-auto object-contain shrink-0" />
          <div className="text-[28px] font-extrabold tracking-tight leading-none pt-1">
            <span className="text-blue-600">Es</span>
            <span className="text-black">cort.</span>
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
          <User
            onClick={() => router.push("/admin")}
            className="w-6 h-6 text-[#202e4d] cursor-pointer hover:opacity-75 transition-opacity"
          />
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
