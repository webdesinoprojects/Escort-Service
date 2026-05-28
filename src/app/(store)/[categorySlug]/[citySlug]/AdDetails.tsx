"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  ChevronLeft,
  User, 
  MapPin, 
  Calendar,
  MessageSquare,
  Phone,
  Heart,
  Share2,
  AlertTriangle,
  X
} from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { ListingAd } from "@/types/listings";
import { formatSlug } from "@/lib/utils";

interface AdDetailsProps {
  ad: ListingAd;
  categorySlug: string;
}

const CITY_TO_STATE: Record<string, string> = {
  Bangalore: "Karnataka",
  Hyderabad: "Telangana",
  Mumbai: "Maharashtra",
  Delhi: "Delhi",
  Pune: "Maharashtra"
};

export default function AdDetails({ ad, categorySlug }: AdDetailsProps) {
  const router = useRouter();
  const category = formatSlug(categorySlug);
  const state = CITY_TO_STATE[ad.city] || "Karnataka";

  // Lightbox Modal state
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  // Carousel states
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect for the carousel (only runs if there are multiple images)
  useEffect(() => {
    if (ad.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => {
        const nextIndex = (prev + 1) % ad.images.length;
        if (carouselRef.current) {
          const width = carouselRef.current.clientWidth;
          carouselRef.current.scrollTo({
            left: nextIndex * width,
            behavior: "smooth"
          });
        }
        return nextIndex;
      });
    }, 4000); // Auto scroll every 4 seconds

    return () => clearInterval(interval);
  }, [ad.images.length]);

  // Handle manual scroll change on swiping
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      const index = Math.round(scrollPosition / width);
      setCurrentImgIndex(index);
    }
  };

  const navigateCarousel = (direction: "next" | "prev") => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.clientWidth;
    let nextIndex = currentImgIndex;

    if (direction === "next") {
      nextIndex = (currentImgIndex + 1) % ad.images.length;
    } else {
      nextIndex = (currentImgIndex - 1 + ad.images.length) % ad.images.length;
    }

    carouselRef.current.scrollTo({
      left: nextIndex * width,
      behavior: "smooth"
    });
    setCurrentImgIndex(nextIndex);
  };

  // Dialpad and WhatsApp share links
  const dialpadUrl = `tel:${ad.phone}`;
  const whatsappUrl = `https://wa.me/${ad.phone.replace(/[^0-9]/g, "")}`;
  const shareTwitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(ad.title)}`;
  const shareWhatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(ad.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      
      {/* Header NAVBAR */}
      <Header />

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto px-6 sm:px-12 py-8 flex-1">
        
        {/* Back Link */}
        <div className="mb-6 select-none">
          <button 
            onClick={() => router.push(`/${categorySlug}`)}
            className="flex items-center gap-1 text-sm font-bold text-[#cf4f41] hover:underline cursor-pointer transition-all"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
            Back to search
          </button>
        </div>

        {/* Red Oklute Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1 text-xs text-[#cf4f41] font-semibold mb-8 select-none">
          <Link href="/" className="hover:underline">Oklute India</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href={`/${categorySlug}`} className="hover:underline">{category}</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href={`/${categorySlug}/${ad.city.toLowerCase()}`} className="hover:underline">
            {state} {category}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-500 font-bold">
            {ad.city} {category}
          </span>
        </div>

        {/* Profile Wrapper Card */}
        <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 mb-8 relative">
          
          {/* Top Date and Ad ID */}
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 select-none flex items-center justify-between">
            <span>{ad.date} - Ad ID: {ad.id}</span>
            {ad.isVip && (
              <span className="bg-[#d9574a] text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                ⭐ VIP AD
              </span>
            )}
          </div>

          {/* Escort Name */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#cf4f41] tracking-tight mb-4 select-none">
            {ad.name}
          </h2>

          {/* Age & City Pill Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6 select-none">
            <span className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 font-bold bg-gray-50/50">
              <User className="w-3.5 h-3.5 text-gray-400" />
              {ad.age} Years
            </span>
            <span className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 font-bold bg-gray-50/50">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {ad.city}
            </span>
          </div>

          {/* Ad Heading Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#202e4d] leading-snug tracking-tight mb-8">
            {ad.title}
          </h1>

          {/* Contact Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl select-none">
            {/* Phone Button */}
            <a 
              href={dialpadUrl}
              className="bg-[#cf4f41] hover:bg-[#b03d31] active:scale-98 text-white py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base tracking-wide transition-all shadow-sm"
            >
              <Phone className="w-5 h-5 fill-current" />
              {ad.phone}
            </a>

            {/* WhatsApp Button */}
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base tracking-wide transition-all shadow-sm"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              Whatsapp
            </a>
          </div>
        </div>

        {/* IMAGE CAROUSEL SECTION */}
        <section className="mb-12">
          {ad.images.length > 0 ? (
            <div className="relative border border-gray-100 rounded-2xl overflow-hidden shadow-sm group/carousel select-none bg-gray-50">
              
              {/* Carousel Viewport (Css scroll snap layout) */}
              <div 
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none h-[300px] sm:h-[450px]"
              >
                {ad.images.map((img, index) => (
                  <div 
                    key={index}
                    onClick={() => setActiveLightboxImg(img)}
                    className="w-full h-full flex-shrink-0 snap-center relative cursor-zoom-in"
                  >
                    <Image
                      src={img}
                      alt={`${ad.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows (Only show if multiple images exist) */}
              {ad.images.length > 1 && (
                <>
                  <button 
                    onClick={() => navigateCarousel("prev")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 active:scale-90 text-white p-2 sm:p-2.5 rounded-full transition-all border border-white/10 opacity-0 group-hover/carousel:opacity-100 backdrop-blur-xs"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => navigateCarousel("next")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 active:scale-90 text-white p-2 sm:p-2.5 rounded-full transition-all border border-white/10 opacity-0 group-hover/carousel:opacity-100 backdrop-blur-xs"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-full">
                    {ad.images.map((_, index) => (
                      <span 
                        key={index}
                        className={`block h-1.5 rounded-full transition-all duration-200 ${
                          currentImgIndex === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-64 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center select-none">
              <span className="text-gray-400 font-bold">No images provided</span>
            </div>
          )}
        </section>

        {/* ABOUT ME SECTION */}
        <section className="mb-12 border-b border-gray-100 pb-10">
          <div className="flex items-center gap-2 mb-6 select-none">
            <span className="text-xl sm:text-2xl">😊</span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#202e4d]">About me</h3>
          </div>

          {/* Description Bullet points */}
          <div className="space-y-3.5 text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
            {ad.aboutMe.map((bullet, idx) => {
              const isSubHeading = bullet.endsWith(":");
              return (
                <p 
                  key={idx} 
                  className={`${
                    isSubHeading ? "font-bold text-[#202e4d] mt-6" : ""
                  }`}
                >
                  {bullet}
                </p>
              );
            })}
          </div>

          {/* Quick Badges Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-8 select-none">
            {ad.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="border border-gray-200 rounded px-3 py-1 text-xs text-gray-500 font-bold bg-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="mb-12 border-b border-gray-100 pb-10 select-none">
          <div className="flex items-center gap-2.5 mb-6">
            <Heart className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg sm:text-xl font-extrabold text-[#202e4d]">Services</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {ad.services.map((srv, idx) => (
              <span 
                key={idx}
                className="border border-gray-200 rounded px-3.5 py-1.5 text-xs sm:text-sm text-gray-600 font-bold bg-white shadow-xs"
              >
                {srv}
              </span>
            ))}
          </div>
        </section>

        {/* ATTENTION TO SECTION */}
        <section className="mb-12 border-b border-gray-100 pb-10 select-none">
          <div className="flex items-center gap-2.5 mb-6">
            <User className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg sm:text-xl font-extrabold text-[#202e4d]">Attention To</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {ad.attentionTo.map((att, idx) => (
              <span 
                key={idx}
                className="border border-gray-200 rounded px-3.5 py-1.5 text-xs sm:text-sm text-gray-600 font-bold bg-white shadow-xs"
              >
                {att}
              </span>
            ))}
          </div>
        </section>

        {/* PLACE OF SERVICE SECTION */}
        <section className="mb-16 border-b border-gray-100 pb-10 select-none">
          <div className="flex items-center gap-2.5 mb-6">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg sm:text-xl font-extrabold text-[#202e4d]">Place Of Service</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {ad.placeOfService.map((place, idx) => (
              <span 
                key={idx}
                className="border border-gray-200 rounded px-3.5 py-1.5 text-xs sm:text-sm text-gray-600 font-bold bg-white shadow-xs"
              >
                {place}
              </span>
            ))}
          </div>
        </section>

        {/* BOTTOM CONTACT SECTION */}
        <section className="mb-12 text-center select-none">
          <h3 className="text-[#202e4d] font-extrabold text-xl mb-6">Contact Me</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Phone Button */}
            <a 
              href={dialpadUrl}
              className="bg-[#cf4f41] hover:bg-[#b03d31] active:scale-98 text-white py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base tracking-wide transition-all shadow-sm"
            >
              <Phone className="w-5 h-5 fill-current" />
              {ad.phone}
            </a>

            {/* WhatsApp Button */}
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base tracking-wide transition-all shadow-sm"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              Whatsapp
            </a>
          </div>
        </section>

        {/* SHARE & REPORT AD */}
        <section className="mb-12 py-8 border-t border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 select-none text-xs text-gray-500 font-bold">
          
          {/* Share links */}
          <div className="flex items-center gap-4">
            <span>Share ad</span>
            <div className="flex items-center gap-3">
              {/* Twitter/X icon */}
              <a 
                href={shareTwitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 hover:text-black transition-all bg-white"
                aria-label="Share on X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* WhatsApp icon */}
              <a 
                href={shareWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-300 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/5 transition-all bg-white"
                aria-label="Share on WhatsApp"
              >
                <MessageSquare className="w-4.5 h-4.5 fill-current" />
              </a>
            </div>
          </div>

          {/* Report link */}
          <div>
            <a 
              href={`mailto:report@oklute.com?subject=Report Ad ${ad.id}`}
              className="flex items-center gap-1.5 text-[#cf4f41] hover:underline"
            >
              <AlertTriangle className="w-4 h-4" />
              Report abuse or fraud
            </a>
          </div>
        </section>

        {/* View all category city ads link */}
        <div className="mb-12 text-center select-none">
          <Link 
            href={`/${categorySlug}/${ad.city.toLowerCase()}`}
            className="text-[#cf4f41] font-bold text-sm sm:text-base hover:underline"
          >
            All ads in {category} {ad.city} &gt;
          </Link>
        </div>

        {/* OFFICIAL REPORTING WARNING */}
        <section className="border border-[#f8d7da] bg-[#fdf2f2]/60 rounded-xl p-5 mb-6 text-xs text-gray-500 font-semibold leading-relaxed">
          <h4 className="text-[#721c24] font-extrabold flex items-center gap-1.5 mb-2.5 text-sm uppercase tracking-wider select-none">
            🛡️ Official Reporting Channels
          </h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Send us your email to <a href="mailto:privacy@oklute.com" className="text-[#cf4f41] hover:underline font-bold">privacy@oklute.com</a> if you come through any kind of violation to the intellectual property or inappropriate use of data such as images, phone number, address, name, and/or email id.
            </li>
            <li>
              You can send us your email to <a href="mailto:grievance@oklute.com" className="text-[#cf4f41] hover:underline font-bold">grievance@oklute.com</a> if any content seems to be abusive or illegal.
            </li>
          </ul>
        </section>

        {/* SAFETY TIPS */}
        <section className="bg-[#202e4d] rounded-xl p-5 mb-16 text-white text-xs leading-relaxed select-none">
          <h4 className="text-yellow-400 font-extrabold flex items-center gap-1.5 mb-2 text-sm uppercase tracking-wider">
            ⚠️ Security tips
          </h4>
          <p className="font-semibold text-white/90">
            If you come across imposters, please report them to Oklute and/or the appropriate authorities and block them. Enjoy a safe Oklute experience.
          </p>
        </section>

      </div>

      {/* Lightbox Modal Popup (Opens when clicking any image in the carousel) */}
      {activeLightboxImg && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center transition-all p-4">
          {/* Close trigger clicking backdrop */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveLightboxImg(null)} />
          
          {/* Close button */}
          <button 
            onClick={() => setActiveLightboxImg(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all border border-white/10 z-50 active:scale-90"
            aria-label="Close image popup"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Active Image container */}
          <div className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center select-none z-10 pointer-events-none">
            <Image
              src={activeLightboxImg}
              alt="Escort photo preview full size"
              width={1000}
              height={1000}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
