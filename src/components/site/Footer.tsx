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
            <div className="flex items-center gap-2">
              <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <circle cx="35" cy="32" r="12" fill="#d9574a" />
                <path d="M15 75 C 15 50, 55 50, 55 75 Z" fill="#d9574a" />
                <circle cx="65" cy="32" r="12" fill="#202e4d" />
                <path d="M45 75 C 45 50, 85 50, 85 75 Z" fill="#202e4d" />
              </svg>
              <span className="text-[28px] font-extrabold text-[#202e4d] tracking-tight">Oklute</span>
            </div>
            
            {/* RTA restricted to adults badge */}
            <div className="flex items-center bg-[#e0e0e0] rounded overflow-hidden border border-gray-300 w-fit select-none">
              <span className="bg-[#333333] text-white text-[10px] font-extrabold px-2.5 py-1.5 tracking-tight uppercase">RTA</span>
              <span className="text-[#333333] text-[9px] font-extrabold px-3 py-1.5 tracking-wider uppercase">Restricted To Adults</span>
            </div>
          </div>

          {/* Right side: Description paragraph */}
          <div className="max-w-3xl text-gray-500 text-sm leading-relaxed font-sans text-justify lg:text-left select-none">
            Oklute stands as the leading advertising platform for independent escorts globally. Explore a multitude of new advertisements from attractive escorts across the globe. Oklute operates in <span className="text-[#cf4f41] font-bold">28 countries</span>, providing a vast selection for users seeking escort services.
          </div>
        </div>

        {/* Links columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-100 pb-12 mb-12 select-none">
          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-[#202e4d] font-bold text-sm tracking-wide">Legal</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm font-semibold">
              <li><a href="#" className="hover:text-[#cf4f41] transition-colors">Terms and Conditions</a></li>
              <li><a href="#" className="hover:text-[#cf4f41] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#cf4f41] transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-[#202e4d] font-bold text-sm tracking-wide">Support</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm font-semibold">
              <li><a href="#" className="hover:text-[#cf4f41] transition-colors">Contact us</a></li>
              <li><a href="#" className="hover:text-[#cf4f41] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#cf4f41] transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h4 className="text-[#202e4d] font-bold text-sm tracking-wide">Security</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm font-semibold">
              <li><a href="#" className="hover:text-[#cf4f41] transition-colors">How to report a scam</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-[#202e4d] font-bold text-sm tracking-wide">Company</h4>
            <ul className="space-y-2.5 text-gray-400 text-sm font-semibold">
              <li><a href="#" className="hover:text-[#cf4f41] transition-colors">Incontro Elegante</a></li>
              <li><a href="#" className="hover:text-[#cf4f41] transition-colors">Oklute Network</a></li>
            </ul>
          </div>
        </div>

        {/* Visibility Boost and Countries select */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-b border-gray-100 pb-12 mb-12 select-none">
          {/* Boost visibility */}
          <div className="flex-1 max-w-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Boost your visibility</h4>
            <button className="bg-[#202e4d] hover:bg-[#162036] active:scale-98 text-white font-bold py-3.5 px-8 rounded-lg text-center cursor-pointer select-none uppercase tracking-wide w-full transition-all">
              POST YOUR AD
            </button>
          </div>

          {/* Countries select */}
          <div className="flex-1 max-w-md relative select-none">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Countries</h4>
            
            {/* Trigger */}
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

            {/* Dropdown Menu (Opens upwards) */}
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

        {/* Softell UK copyright info and Payment logos */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-12 select-none">
          {/* Softell text */}
          <div className="text-gray-400 text-xs font-medium max-w-2xl leading-relaxed">
            SOFTELL LIMITED - 42a Riverside workshops Pipe House Wharf Morfa Road The Strand SA1 2EN Swansea UK, Registration Number: 01726537
          </div>

          {/* Payment methods */}
          <div className="flex items-center gap-3">
            {/* Mastercard circles */}
            <div className="flex items-center">
              <svg width="36" height="22" viewBox="0 0 36 22" className="shrink-0" aria-label="Mastercard">
                <circle cx="11" cy="11" r="11" fill="#EB001B" />
                <circle cx="25" cy="11" r="11" fill="#F79E1B" fillOpacity="0.85" />
              </svg>
            </div>
            {/* Visa text */}
            <div className="flex items-center text-[#1A1F71]">
              <svg width="45" height="15" viewBox="0 0 45 15" className="shrink-0" fill="currentColor" aria-label="Visa">
                <path d="M18.2 0.3L15.9 14.7H12.3L10.1 2.8C9.5 1.5 8.9 1 7.6 0.9L5.4 0.8V0.3H11.2C12.5 0.3 13.5 1.2 13.7 2.5L14.7 9.8L18.4 0.3H18.2ZM24.5 10C24.5 6.3 19.3 6.1 19.3 4.4C19.3 3.9 19.8 3.3 20.9 3.2C21.4 3.1 22.9 3.1 24.5 3.8L25.1 0.7C23.6 0.2 21.8 0 19.8 0C16.3 0 13.8 1.9 13.8 5.1C13.8 8.8 19 9 19 11.2C19 11.9 18.2 12.3 17.2 12.5C16.2 12.7 14.6 12.5 13.2 11.8L12.6 14.9C14.3 15.6 16.5 15.8 18.5 15.8C22.1 15.8 24.5 13.9 24.5 10ZM31.1 0.3H28.3L22.9 14.7H26.3L27 12.7H31.1L31.5 14.7H34.5L31.1 0.3ZM27.9 9.8L29.7 4.1L30.7 9.8H27.9ZM5.6 0.3L0.2 14.7H3.6L9 0.3H5.6Z" />
              </svg>
            </div>
          </div>
        </div>
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
            Copyright 2026 © Oklute
          </div>
        </div>
      </div>
    </footer>
  );
}
