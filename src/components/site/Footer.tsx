"use client";

import { useState } from "react";

interface Country {
  code: string;
  name: string;
}

export default function Footer() {
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({ code: "IN", name: "India" });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectCountry = (code: string, name: string) => {
    setSelectedCountry({ code, name });
    setIsCountryDropdownOpen(false);
  };

  const countries: Country[] = [
    { code: "AR", name: "Argentina" },
    { code: "AU", name: "Australia" },
    { code: "BO", name: "Bolivia" },
    { code: "BR", name: "Brazil" },
    { code: "CL", name: "Chile" },
    { code: "CO", name: "Colombia" },
    { code: "CR", name: "Costa Rica" },
    { code: "CY", name: "Cyprus" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "DE", name: "Germany" },
    { code: "GT", name: "Guatemala" },
    { code: "IN", name: "India" },
    { code: "IE", name: "Ireland" },
    { code: "IT", name: "Italy" },
    { code: "MX", name: "Mexico" },
    { code: "NL", name: "Netherlands" },
    { code: "NZ", name: "New Zealand" }
  ];

  const renderFlag = (code: string) => {
    if (code === "IN") {
      return (
        <span className="w-5 h-3.5 bg-emerald-700 relative overflow-hidden flex flex-col justify-between shrink-0 border border-gray-100">
          <div className="bg-[#FF9933] h-[33.3%]" />
          <div className="bg-white h-[33.3%] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900 border border-blue-900 flex items-center justify-center" />
          </div>
          <div className="bg-[#128807] h-[33.3%]" />
        </span>
      );
    }
    if (code === "DE") {
      return (
        <span className="w-5 h-3.5 relative overflow-hidden flex flex-col justify-between shrink-0 border border-gray-100">
          <div className="bg-black h-[33.3%]" />
          <div className="bg-red-600 h-[33.3%]" />
          <div className="bg-yellow-400 h-[33.3%]" />
        </span>
      );
    }
    if (code === "IT") {
      return (
        <span className="w-5 h-3.5 relative overflow-hidden flex justify-between shrink-0 border border-gray-100">
          <div className="bg-[#008C45] w-[33.3%] h-full" />
          <div className="bg-[#F4F5F0] w-[33.3%] h-full" />
          <div className="bg-[#CD212A] w-[33.3%] h-full" />
        </span>
      );
    }
    if (code === "IE") {
      return (
        <span className="w-5 h-3.5 relative overflow-hidden flex justify-between shrink-0 border border-gray-100">
          <div className="bg-[#169B62] w-[33.3%] h-full" />
          <div className="bg-[#FFFFFF] w-[33.3%] h-full" />
          <div className="bg-[#FF883E] w-[33.3%] h-full" />
        </span>
      );
    }
    if (code === "NL") {
      return (
        <span className="w-5 h-3.5 relative overflow-hidden flex flex-col justify-between shrink-0 border border-gray-100">
          <div className="bg-[#AE1C28] h-[33.3%]" />
          <div className="bg-[#FFFFFF] h-[33.3%]" />
          <div className="bg-[#21468B] h-[33.3%]" />
        </span>
      );
    }
    if (code === "AR") {
      return (
        <span className="w-5 h-3.5 relative overflow-hidden flex flex-col justify-between shrink-0 border border-gray-100">
          <div className="bg-[#74ACDF] h-[33.3%]" />
          <div className="bg-[#FFFFFF] h-[33.3%] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-yellow-500" />
          </div>
          <div className="bg-[#74ACDF] h-[33.3%]" />
        </span>
      );
    }
    return (
      <span className="w-5 h-3.5 bg-blue-800 text-[8px] text-white flex items-center justify-center font-bold shrink-0 rounded-xs select-none border border-gray-100">
        {code}
      </span>
    );
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-0 w-full mt-auto">
      {/* Top/Main footer section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 border-b border-gray-100 pb-12 mb-12">
          
          {/* Left side: Logo & RTA badge */}
          <div className="flex flex-col gap-5 select-none">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Escort Logo" className="h-24 w-auto shrink-0" />
              <div className="text-[34px] font-extrabold tracking-tight leading-none pt-1">
                <span className="text-blue-600">Es</span>
                <span className="text-black">cort.</span>
              </div>
            </div>
            
            {/* RTA restricted to adults badge */}
            <div className="flex items-center bg-[#e0e0e0] rounded overflow-hidden border border-gray-300 w-fit select-none">
              <span className="bg-[#333333] text-white text-[10px] font-extrabold px-2.5 py-1.5 tracking-tight uppercase">RTA</span>
              <span className="text-[#333333] text-[9px] font-extrabold px-3 py-1.5 tracking-wider uppercase">Restricted To Adults</span>
            </div>
          </div>

          {/* Right side: Description paragraph */}
          <div className="max-w-3xl text-gray-500 text-sm leading-relaxed font-sans text-justify lg:text-left select-none">
            Escort stands as the go-to advertising platform for independent escorts worldwide. Discover a world of fresh ads from captivating escorts across the globe. With a presence in <span className="text-[#cf4f41] font-bold">28 countries</span>, Escort delivers an unmatched selection for anyone seeking escort services.
          </div>
        </div>



        {/* Visibility Boost and Countries select */}
        {/*
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-b border-gray-100 pb-12 mb-12 select-none">


          <div className="flex-1 max-w-md relative select-none">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Countries</h4>
            
            <div 
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="border border-gray-200 rounded-lg p-3.5 flex items-center justify-between text-sm text-gray-600 bg-white font-semibold cursor-pointer w-full hover:border-gray-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                {renderFlag(selectedCountry.code)}
                <span>{selectedCountry.code} {selectedCountry.name}</span>
              </span>
              <div className="flex flex-col text-[8px] text-gray-400 leading-none">
                <span>▲</span>
                <span className="mt-0.5">▼</span>
              </div>
            </div>

            {isCountryDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[220px] overflow-y-auto py-1">
                {countries.map((country) => {
                  const isSelected = selectedCountry.code === country.code;
                  return (
                    <div
                      key={country.code}
                      onClick={() => selectCountry(country.code, country.name)}
                      className={`flex items-center px-4 py-2.5 transition-colors cursor-pointer text-sm ${
                        isSelected 
                          ? "bg-[#202e4d] text-white font-bold" 
                          : "text-gray-700 hover:bg-gray-50 font-semibold"
                      }`}
                    >
                      <span className={`w-7 text-[11px] font-bold uppercase ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                        {country.code}
                      </span>
                      <span>{country.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        */}


      </div>

      {/* Dark blue bottom-most bar */}
      <div className="bg-[#202e4d] py-10 relative w-full">
        
        {/* Back to top button - Absolute positioned floating on the edge */}
        <button 
          onClick={scrollToTop}
          className="absolute -top-[20px] right-8 sm:right-16 z-20 shadow-md border border-gray-100 flex items-center gap-1 px-4 py-2 bg-white rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer select-none active:scale-95"
        >
          Back To Top
          <span className="text-[10px] font-bold">↗</span>
        </button>

        {/* Social media icons & Copyright */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 select-none">
          {/* Social media icons row */}
          <div className="flex items-center gap-6">
            {/* Youtube */}
            <a href="#" className="text-white hover:opacity-75 transition-opacity" aria-label="YouTube">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="text-white hover:opacity-75 transition-opacity" aria-label="Instagram">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#" className="text-white hover:opacity-75 transition-opacity" aria-label="X (Twitter)">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="text-white hover:opacity-75 transition-opacity" aria-label="Facebook">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          {/* Copyright text */}
          <div className="text-white/60 text-xs font-semibold tracking-wide">
            Copyright 2026 © Escort
          </div>
        </div>
      </div>
    </footer>
  );
}
