"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { ListingAd } from "@/types/listings";
import { slugify } from "@/lib/utils";

interface ListingCardProps {
  ad: ListingAd;
  categorySlug: string;
}

export default function ListingCard({ ad, categorySlug }: ListingCardProps) {
  // Generate the slug for the ad details page
  const adSlug = `${slugify(ad.title)}-${ad.id}`;
  const detailUrl = `/${categorySlug}/${adSlug}`;

  // Display the first image as card thumbnail
  const cardImage = ad.images[0] || "/hero-anime.png";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row relative group">
      
      {/* Image side */}
      <Link href={detailUrl} className="relative w-full md:w-56 h-48 md:h-44 shrink-0 overflow-hidden select-none bg-gray-50 block cursor-pointer">
        <Image
          src={cardImage}
          alt={ad.title}
          fill
          sizes="(max-width: 768px) 100vw, 224px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Photo Count */}
        <div className="absolute bottom-2.5 left-3 bg-black/60 backdrop-blur-[2px] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
          </svg>
          <span>{ad.photoCount}</span>
        </div>
      </Link>

      {/* Details side */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={detailUrl}>
            <h3 className="text-[#cf4f41] font-bold text-base sm:text-[17px] hover:underline cursor-pointer leading-snug mb-2 pr-12 line-clamp-2">
              {ad.title}
            </h3>
          </Link>
          {/* Description */}
          <p className="text-gray-500 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
            {ad.description}
          </p>
        </div>

        {/* Metadata details row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 font-semibold border-t border-gray-50 pt-3">
          {/* Age */}
          <span className="flex items-center gap-1 select-none">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {ad.age} Years
          </span>
          {/* City */}
          <span className="flex items-center gap-1 select-none">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {ad.city}
          </span>
          {/* Country */}
          <span className="flex items-center gap-1.5 select-none">
            <span className="w-4.5 h-3 bg-emerald-700 relative overflow-hidden flex flex-col justify-between shrink-0 border border-gray-100">
              <div className="bg-[#FF9933] h-[33.3%]" />
              <div className="bg-white h-[33.3%] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-900" />
              </div>
              <div className="bg-[#128807] h-[33.3%]" />
            </span>
            <span>IN Indian</span>
          </span>
        </div>
      </div>

      {/* VIP badge */}
      {ad.isVip && (
        <div className="absolute top-0 right-4 select-none">
          <div className="bg-[#d9574a] text-white text-[9px] font-extrabold px-2.5 py-1.5 rounded-b-md shadow-sm border-t-0 border border-[#b83b2e] flex items-center gap-0.5">
            <span>⭐</span>
            <span>VIP</span>
          </div>
        </div>
      )}
    </div>
  );
}
