"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronDown, ChevronRight, Globe, Flag, Smile, MapPin, Eye, User, Sparkles } from "lucide-react";
import { getCategories } from "@/server/actions/admin";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  initialCity?: string;
}

interface CategoryOption {
  slug: string;
  title: string;
}

const FALLBACK_CATEGORIES: CategoryOption[] = [
  { slug: "call-girls", title: "Call Girls" },
  { slug: "massage", title: "Massage" },
  { slug: "male-escorts", title: "Male Escorts" },
  { slug: "transsexual", title: "Transsexual" },
  { slug: "adult-meetings", title: "Adult Meetings" },
];

const REGIONS = [
  "Andaman And Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra And Nagar Haveli",
  "Daman And Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu And Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
].sort();

const CITIES_BY_REGION: Record<string, string[]> = {
  "Karnataka": ["Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Navi Mumbai", "Solapur", "Mira-Bhayandar", "Aurangabad"],
  "Delhi": ["Delhi", "Gurgaon", "Noida", "Ghaziabad", "Faridabad"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Meerut", "Varanasi", "Aligarh", "Moradabad", "Bareilly"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Udaipur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior", "Jabalpur"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur"],
  "Odisha": ["Bhubaneswar", "Cuttack"],
  "Assam": ["Guwahati"],
  "Chandigarh": ["Chandigarh"]
};

const AREAS_BY_CITY: Record<string, string[]> = {
  "Bangalore": ["Indiranagar", "Koramangala", "Jayanagar", "HSR Layout", "Whitefield", "Marathahalli", "BTM Layout"],
  "Mumbai": ["Bandra", "Andheri", "Colaba", "Juhu", "Powai", "Worli", "Dadar"],
  "Delhi": ["Connaught Place", "Karol Bagh", "South Extension", "Dwarka", "Vasant Kunj", "Saket"],
  "Hyderabad": ["Gachibowli", "Jubilee Hills", "Banjara Hills", "Madhapur", "Secunderabad", "Kondapur"],
  "Pune": ["Viman Nagar", "Koregaon Park", "Kothrud", "Hinjewadi", "Baner", "Kalyani Nagar"]
};

const ETHNICITIES = ["African", "Indian", "Asian", "Arab", "Latin", "Caucasian"];
const NATIONALITIES = ["Indian", "Brazilian", "Russian", "German", "Italian", "Spanish", "Colombian", "Thai"];
const BREAST_TYPES = ["Natural", "Silicone", "Small", "Medium", "Large"];
const HAIR_COLORS = ["Black", "Brown", "Blonde", "Red", "Shaved", "Long", "Short"];
const BODY_TYPES = ["Slim", "Athletic", "Average", "Curvy", "Plump"];
const SERVICES = ["Oral", "Anal", "Girlfriend experience", "French kiss", "Role play", "Threesome", "Sexting", "Videocall", "Nuru Massage"];
const ATTENTIONS = ["Men", "Women", "Couples", "Disabled"];
const PLACES = ["At home", "Events and parties", "Hotel / Motel", "Clubs", "Outcall"];

export default function FilterModal({ isOpen, onClose, initialCategory, initialCity }: FilterModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Primary drop-down states
  const [category, setCategory] = useState("call-girls");
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(FALLBACK_CATEGORIES);
  const [searchText, setSearchText] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  // Load categories from DB on mount
  useEffect(() => {
    getCategories().then((cats: any[]) => {
      if (cats && cats.length > 0) {
        setCategoryOptions(cats.map((c) => ({ slug: c.slug, title: c.title })));
      }
    }).catch(() => {
      // Keep fallback on error
    });
  }, []);

  // Accordion filter states
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Selected sub-pills states
  const [selectedEthnicity, setSelectedEthnicity] = useState<string[]>([]);
  const [selectedNationality, setSelectedNationality] = useState<string[]>([]);
  const [selectedBreast, setSelectedBreast] = useState<string[]>([]);
  const [selectedHair, setSelectedHair] = useState<string[]>([]);
  const [selectedBodyType, setSelectedBodyType] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAttention, setSelectedAttention] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<string[]>([]);

  // Sync with URL params on mount or when URL changes
  useEffect(() => {
    if (!isOpen) return;

    // Category resolution
    const cat = initialCategory || searchParams.get("category") || "call-girls";
    setCategory(cat);

    // Text search
    const searchVal = searchParams.get("search") || "";
    setSearchText(searchVal);

    // City & Region resolution
    const urlCity = initialCity || "";
    if (urlCity) {
      // Find region of this city
      const foundRegion = Object.keys(CITIES_BY_REGION).find(r => 
        CITIES_BY_REGION[r].some(c => c.toLowerCase() === urlCity.toLowerCase())
      );
      if (foundRegion) {
        setRegion(foundRegion);
        // Find exact city capitalization
        const match = CITIES_BY_REGION[foundRegion].find(c => c.toLowerCase() === urlCity.toLowerCase());
        setCity(match || urlCity);
      } else {
        setCity(urlCity);
      }
    } else {
      setCity("");
      setRegion("");
    }

    // Set Area
    setArea(searchParams.get("area") || "");

    // Load URL filter lists
    const loadParam = (key: string) => searchParams.get(key)?.split(",").filter(Boolean) || [];
    setSelectedEthnicity(loadParam("ethnicity"));
    setSelectedNationality(loadParam("nationality"));
    setSelectedBreast(loadParam("breast"));
    setSelectedHair(loadParam("hair"));
    setSelectedBodyType(loadParam("bodyType"));
    setSelectedServices(loadParam("services"));
    setSelectedAttention(loadParam("attentionTo"));
    setSelectedPlace(loadParam("placeOfService"));

  }, [isOpen, searchParams, initialCategory, initialCity]);

  // Dynamically compute cities based on selected region
  const citiesList = useMemo(() => {
    if (!region) {
      // Return all cities flat
      return Object.values(CITIES_BY_REGION).flat().sort();
    }
    return CITIES_BY_REGION[region] || [];
  }, [region]);

  // Dynamically compute areas based on selected city
  const areasList = useMemo(() => {
    if (!city) return [];
    return AREAS_BY_CITY[city] || ["Central Area", "Main Town", "Airport Road", "High Street"];
  }, [city]);

  // Handle region changes (resets selected city if incompatible)
  const handleRegionChange = (newReg: string) => {
    setRegion(newReg);
    if (newReg && city) {
      const isCityInRegion = CITIES_BY_REGION[newReg]?.includes(city);
      if (!isCityInRegion) {
        setCity("");
        setArea("");
      }
    }
  };

  // Toggle selection lists
  const togglePill = (val: string, list: string[], setList: (arr: string[]) => void) => {
    if (list.includes(val)) {
      setList(list.filter(x => x !== val));
    } else {
      setList([...list, val]);
    }
  };

  // Reset all filters
  const handleDeleteAll = () => {
    setSearchText("");
    setRegion("");
    setCity("");
    setArea("");
    setSelectedEthnicity([]);
    setSelectedNationality([]);
    setSelectedBreast([]);
    setSelectedHair([]);
    setSelectedBodyType([]);
    setSelectedServices([]);
    setSelectedAttention([]);
    setSelectedPlace([]);
  };

  // Trigger search submission
  const handleSearchSubmit = () => {
    // 1. Build category slug
    const catSlug = category.toLowerCase().replace(/\s+/g, "-");

    // 2. Build city slug
    const targetCitySlug = city ? city.toLowerCase() : "";

    // 3. Build path
    const path = targetCitySlug ? `/${catSlug}/${targetCitySlug}` : `/${catSlug}`;

    // 4. Build query parameters
    const params = new URLSearchParams();
    if (searchText.trim()) params.set("search", searchText.trim());
    if (area) params.set("area", area);

    const appendParam = (key: string, arr: string[]) => {
      if (arr.length > 0) params.set(key, arr.join(","));
    };

    appendParam("ethnicity", selectedEthnicity);
    appendParam("nationality", selectedNationality);
    appendParam("breast", selectedBreast);
    appendParam("hair", selectedHair);
    appendParam("bodyType", selectedBodyType);
    appendParam("services", selectedServices);
    appendParam("attentionTo", selectedAttention);
    appendParam("placeOfService", selectedPlace);

    // 5. Route to new path
    const queryStr = params.toString();
    router.push(`${path}${queryStr ? "?" + queryStr : ""}`);
    onClose();
  };

  if (!isOpen) return null;

  const renderSectionHeader = (title: string, icon: React.ReactNode, key: string) => {
    const isExpanded = expandedSection === key;
    return (
      <div 
        onClick={() => setExpandedSection(isExpanded ? null : key)}
        className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 px-2 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-400">{icon}</span>
          <span className="text-[#202e4d] font-bold text-sm sm:text-base">{title}</span>
        </div>
        <ChevronRight className={`w-5 h-5 text-[#cf4f41] transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs transition-opacity duration-300">
      
      {/* Modal Backdrop Click */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Modal Dialog Content Container */}
      <div className="bg-white w-full max-w-3xl rounded-2xl flex flex-col max-h-[90vh] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 shrink-0 select-none">
          <h2 className="text-[#202e4d] font-extrabold text-lg sm:text-xl flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 bg-gray-50 hover:bg-gray-100 rounded-full cursor-pointer active:scale-90"
            aria-label="Close search filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Block */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          
          {/* Category Selector and Search Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 select-none">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-gray-300 transition-colors outline-none appearance-none cursor-pointer"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.slug} value={opt.slug}>
                      {opt.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Search keyword input */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 select-none">Search keyword</label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search here..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-gray-300 transition-colors outline-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Region, City and Area Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Regions Selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 select-none">Region</label>
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-gray-300 transition-colors outline-none appearance-none cursor-pointer"
                >
                  <option value="">All the regions</option>
                  {REGIONS.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Cities Selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 select-none">City</label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setArea("");
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-gray-300 transition-colors outline-none appearance-none cursor-pointer"
                >
                  <option value="">All the cities</option>
                  {citiesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Areas Selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 select-none">Area</label>
              <div className="relative">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  disabled={!city}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:border-gray-300 transition-colors outline-none appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-100"
                >
                  <option value="">All Areas</option>
                  {areasList.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Accordion Filter Section */}
          <div className="border-t border-gray-100 pt-4">
            
            {/* Header Title */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 select-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </div>

            {/* Accordion rows */}
            <div className="flex flex-col">
              
              {/* Ethnicity */}
              {renderSectionHeader("Ethnicity", <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5" />, "ethnicity")}
              {expandedSection === "ethnicity" && (
                <div className="bg-gray-50/30">
                  <div className="flex flex-wrap gap-2 pt-3.5 pb-4 px-2 select-none border-b border-gray-100">
                    {ETHNICITIES.map(opt => {
                      const isSelected = selectedEthnicity.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => togglePill(opt, selectedEthnicity, setSelectedEthnicity)}
                          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#cf4f41] text-white border-[#cf4f41]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nationality */}
              {renderSectionHeader("Nationality", <Flag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />, "nationality")}
              {expandedSection === "nationality" && (
                <div className="bg-gray-50/30">
                  <div className="flex flex-wrap gap-2 pt-3.5 pb-4 px-2 select-none border-b border-gray-100">
                    {NATIONALITIES.map(opt => {
                      const isSelected = selectedNationality.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => togglePill(opt, selectedNationality, setSelectedNationality)}
                          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#cf4f41] text-white border-[#cf4f41]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Breast */}
              {renderSectionHeader("Breast", <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />, "breast")}
              {expandedSection === "breast" && (
                <div className="bg-gray-50/30">
                  <div className="flex flex-wrap gap-2 pt-3.5 pb-4 px-2 select-none border-b border-gray-100">
                    {BREAST_TYPES.map(opt => {
                      const isSelected = selectedBreast.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => togglePill(opt, selectedBreast, setSelectedBreast)}
                          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#cf4f41] text-white border-[#cf4f41]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hair */}
              {renderSectionHeader("Hair", <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />, "hair")}
              {expandedSection === "hair" && (
                <div className="bg-gray-50/30">
                  <div className="flex flex-wrap gap-2 pt-3.5 pb-4 px-2 select-none border-b border-gray-100">
                    {HAIR_COLORS.map(opt => {
                      const isSelected = selectedHair.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => togglePill(opt, selectedHair, setSelectedHair)}
                          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#cf4f41] text-white border-[#cf4f41]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Body Type */}
              {renderSectionHeader("Body Type", <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />, "bodyType")}
              {expandedSection === "bodyType" && (
                <div className="bg-gray-50/30">
                  <div className="flex flex-wrap gap-2 pt-3.5 pb-4 px-2 select-none border-b border-gray-100">
                    {BODY_TYPES.map(opt => {
                      const isSelected = selectedBodyType.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => togglePill(opt, selectedBodyType, setSelectedBodyType)}
                          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#cf4f41] text-white border-[#cf4f41]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Services */}
              {renderSectionHeader("Services", <Smile className="w-4 h-4 sm:w-4.5 sm:h-4.5" />, "services")}
              {expandedSection === "services" && (
                <div className="bg-gray-50/30">
                  <div className="flex flex-wrap gap-2 pt-3.5 pb-4 px-2 select-none border-b border-gray-100">
                    {SERVICES.map(opt => {
                      const isSelected = selectedServices.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => togglePill(opt, selectedServices, setSelectedServices)}
                          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#cf4f41] text-white border-[#cf4f41]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Attention To */}
              {renderSectionHeader("Attention To", <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />, "attention")}
              {expandedSection === "attention" && (
                <div className="bg-gray-50/30">
                  <div className="flex flex-wrap gap-2 pt-3.5 pb-4 px-2 select-none border-b border-gray-100">
                    {ATTENTIONS.map(opt => {
                      const isSelected = selectedAttention.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => togglePill(opt, selectedAttention, setSelectedAttention)}
                          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#cf4f41] text-white border-[#cf4f41]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Place Of Service */}
              {renderSectionHeader("Place Of Service", <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5" />, "place")}
              {expandedSection === "place" && (
                <div className="bg-gray-50/30">
                  <div className="flex flex-wrap gap-2 pt-3.5 pb-4 px-2 select-none border-b border-gray-100">
                    {PLACES.map(opt => {
                      const isSelected = selectedPlace.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => togglePill(opt, selectedPlace, setSelectedPlace)}
                          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#cf4f41] text-white border-[#cf4f41]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4.5 shrink-0 bg-white select-none">
          {/* Delete All button */}
          <button
            onClick={handleDeleteAll}
            className="text-[#cf4f41] hover:underline font-bold text-xs sm:text-sm cursor-pointer select-none bg-transparent border-0 active:scale-95 transition-transform"
          >
            DELETE ALL
          </button>

          {/* Red Search Submit button */}
          <button
            onClick={handleSearchSubmit}
            className="bg-[#cf4f41] hover:bg-[#b03d31] active:scale-98 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            SEARCH
          </button>
        </div>

      </div>
    </div>
  );
}
