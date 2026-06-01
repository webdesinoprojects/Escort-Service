"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SearchBar from "@/components/site/SearchBar";
import { getHeroSettings, getCategories, getCities } from "@/server/actions/admin";

interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  icon_name?: string;
}

interface City {
  id: string;
  slug: string;
  name: string;
  state_name: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    slug: "call-girls",
    title: "Call Girls",
    description: "Call girls and Escorts adult classified to help you locate independent call girls and escorts to fulfill your sensual desires. Enjoy the call girl services to satisfy your fantasies. The adult ads will help you find out hot girls with high-class erotic services.",
    image_url: "/images/categories/call-girls.png"
  },
  {
    id: "cat-2",
    slug: "massage",
    title: "Massage",
    description: "The best erotic massage ads with all erotic services. The sexy massage girls give you a soothing hot full body massage to stimulate your genitals. Full body massage includes many sensual services that will excite your desires for sex.",
    image_url: "/images/categories/massage.png"
  },
  {
    id: "cat-3",
    slug: "male-escorts",
    title: "Male Escorts",
    description: "Best adult classified for male escort services, hot male escorts, call boys, and gigolos. Find the most sensual sexy male escorts for top-class adult services and satisfy your hidden fantasies to the fullest. Explore the adult ads to find out your favorite male escorts.",
    image_url: "/images/categories/male-escorts.png"
  },
  {
    id: "cat-4",
    slug: "transsexual",
    title: "Transsexual",
    description: "Transsexual escorts let you enjoy a new kind of sexual services. You will have some unusual experiences with transsexual escort, shemale, and lady boy who have mastered in erotic sex services. Compare and find the best one based on your preferences.",
    image_url: "/images/categories/transsexual.png"
  },
  {
    id: "cat-5",
    slug: "adult-meetings",
    title: "Adult Meetings",
    description: "Reliable classified ads for enjoying sexy companionship with local boys and girls. Locate your true love to enjoy stimulating adult meetings. The adult ads include many love seekers who are looking for sexy partners for their sexual satisfaction.",
    image_url: "/images/categories/adult-meetings.png"
  }
];

const DEFAULT_CITIES = ["Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune"];

export default function Home() {
  const router = useRouter();

  // Settings states loaded from Supabase DB
  const [hero, setHero] = useState({
    hero_title: "Flying Solo? No Worries\nEscort is made for all.",
    hero_subtitle: "Search or Post Your Adult Advertisement",
    hero_image_url: "/hero-anime.png"
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHeroSettings(),
      getCategories(),
      getCities()
    ]).then(([heroData, catsData, citiesData]) => {
      setHero(heroData);
      if (catsData && catsData.length > 0) setCategories(catsData);
      else setCategories(DEFAULT_CATEGORIES);

      if (citiesData && citiesData.length > 0) setCities(citiesData);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load storefront metrics:", err);
      setCategories(DEFAULT_CATEGORIES);
      setLoading(false);
    });
  }, []);

  const handleLocationClick = (category: string, city: string) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    const citySlug = city.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${categorySlug}/${citySlug}`);
  };

  const renderCategoryIcon = (slug: string) => {
    if (slug === "call-girls") {
      return (
        <svg className="w-6 h-6 mr-2 filter drop-shadow" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 18.5c-3.15 0-6.22-1.24-8.63-3.48a1 1 0 0 1 1.36-1.46c2.02 1.88 4.6 2.94 7.27 2.94s5.25-1.06 7.27-2.94a1 1 0 1 1 1.36 1.46c-2.41 2.24-5.48 3.48-8.63 3.48zM12 5.5c2.3 0 4.3 1.13 5.42 2.92.51.83.18 1.9-.71 2.3A9.9 9.9 0 0 1 12 12c-1.7 0-3.32-.42-4.71-1.28-.9-.4-1.22-1.47-.71-2.3C7.7 6.63 9.7 5.5 12 5.5z"/>
        </svg>
      );
    }
    if (slug === "massage") {
      return (
        <svg className="w-6 h-6 mr-2 filter drop-shadow" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-4.5 7.5A3.5 3.5 0 0 0 4 13v2.5A1.5 1.5 0 0 0 5.5 17h13a1.5 1.5 0 0 0 1.5-1.5V13a3.5 3.5 0 0 0-3.5-3.5h-9z"/>
        </svg>
      );
    }
    if (slug === "male-escorts") {
      return (
        <svg className="w-6 h-6 mr-2 filter drop-shadow" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15c-1.5-.7-3.3-1-5.3-.8-1.5.1-2.9.8-3.7 1.8-.4.5-.9 0-.8-.5.5-2.2 2.2-3.8 4.3-3.8 1.8 0 3.3.9 4.3 2.3.2.3.5.3.7 0 1-1.4 2.5-2.3 4.3-2.3 2.1 0 3.8 1.6 4.3 3.8.1.5-.4 1-.8.5-.8-1-2.2-1.7-3.7-1.8-2-.2-3.8.1-5.3.8z" />
        </svg>
      );
    }
    if (slug === "transsexual") {
      return (
        <svg className="w-6 h-6 mr-2 filter drop-shadow" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18h3.5l1.5-4c.4-1 1.3-1.7 2.4-1.7h3.2c1.3 0 2.4.8 2.8 2l1.6 4H21a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2.3z M18.5 12h-1v6h1v-6z" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 mr-2 filter drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2H2v2l9 9v7H7v2h10v-2h-4v-7l9-9V2z" />
      </svg>
    );
  };

  const getCityPillsForCategory = () => {
    if (cities.length > 0) {
      return cities.slice(0, 3).map(c => c.name);
    }
    return DEFAULT_CITIES.slice(0, 3);
  };

  const getBottomSectionCities = () => {
    if (cities.length > 0) {
      return cities.slice(0, 5).map(c => c.name);
    }
    return DEFAULT_CITIES;
  };

  const activeCategoryCards = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const activeCityPills = getCityPillsForCategory();
  const bottomCitiesList = getBottomSectionCities();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      <Suspense fallback={<div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sm:px-12 w-full shrink-0">Loading...</div>}>
        <Header />
      </Suspense>

      {/* ── HERO ── */}
      <section className="relative w-full h-[520px] overflow-hidden">
        {hero.hero_image_url.startsWith("/") ? (
          <Image
            src={hero.hero_image_url}
            alt="Escort Hero Background"
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
        ) : (
          <Image
            src={hero.hero_image_url}
            alt="Escort Hero Background"
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
            unoptimized // Disable optimization for external ImageKit uploads in dev
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#cf4f41]/85 via-[#cf4f41]/45 to-transparent pointer-events-none" />

        <div className="absolute inset-0 flex flex-col justify-between px-6 sm:px-16 py-12">
          <div className="max-w-xl mt-6">
            <h1 
              className="text-white font-display font-extrabold text-4xl sm:text-5xl lg:text-[52px] leading-[1.2] drop-shadow-sm select-none whitespace-pre-line"
            >
              {hero.hero_title}
            </h1>
          </div>

          <div className="w-full flex justify-center mb-4">
            <Suspense fallback={<div className="w-full max-w-4xl h-16 bg-white rounded-full animate-pulse flex items-center px-6 font-semibold text-gray-400">Loading search...</div>}>
              <SearchBar variant="home" />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ── INFO BAND ── */}
      <section className="bg-white pt-16 pb-8 px-6 text-center select-none">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#202e4d]">
          {hero.hero_subtitle}
        </h2>
        <p className="mt-3 text-gray-500 font-sans text-base sm:text-lg">
          Search or Post Your Adult Advertisement
        </p>
      </section>

      {/* ── CARDS SECTION ── */}
      <section className="bg-white pb-24 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeCategoryCards.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div 
                onClick={() => router.push(`/${cat.slug}`)}
                className="relative aspect-[4/3] w-full cursor-pointer group/img overflow-hidden"
              >
                {cat.image_url.startsWith("/") ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 420px"
                    className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Image
                    src={cat.image_url}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 420px"
                    className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-5 flex items-center text-white select-none">
                  {renderCategoryIcon(cat.slug)}
                  <span className="text-xl sm:text-2xl font-bold tracking-tight drop-shadow">{cat.title}</span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-4">
                  {cat.description}
                </p>
                <div className="space-y-3">
                  {activeCityPills.map((city) => (
                    <div
                      key={city}
                      onClick={() => handleLocationClick(cat.title, city)}
                      className="border border-gray-100 rounded-xl p-3.5 flex flex-col items-start hover:border-[#f06e2e] hover:shadow-sm transition-all cursor-pointer bg-white"
                    >
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{cat.title}</span>
                      <span className="text-sm font-extrabold text-[#f06e2e] mt-0.5">{city}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WELCOME & LOCATIONS SECTION ── */}
      <section className="bg-gray-50/60 py-20 px-6 sm:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Text */}
          <div className="max-w-5xl mx-auto text-center mb-16 select-none">
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-sans text-justify md:text-center max-w-4xl mx-auto">
              Welcome to Escort – Your trusted brand for adult classified ads in India. Do you want to relish some erotic and sensual escort services? Rely on Escort, a portal of real classified ads for independent call girls Bangalore, sexual meeting, massage services, VIP escort services in Delhi, Mumbai, and other cities. Browse all categories to locate call boys, transsexual, swinger meeting, gay escorts, and adult meeting. Escort also publishes the ads for Video Sex Service. Find it all on Escort in just a one click. Looking for clients for your services? Post your profiles and classified ads absolutely FREE.
            </p>
          </div>

          {/* Location Cards */}
          <div className="space-y-8">
            {activeCategoryCards.map((cat, idx) => (
              <div 
                key={cat.id} 
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 max-w-5xl mx-auto flex flex-col items-center select-none"
              >
                <div className="flex items-center text-[#cf4f41] font-extrabold text-[22px] sm:text-[26px] tracking-tight">
                  {renderCategoryIcon(cat.slug)}
                  <span>{cat.title}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3.5 mt-6">
                  {bottomCitiesList.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleLocationClick(cat.title, city)}
                      className="rounded-full border border-[#cf4f41] px-6 py-2.5 text-sm sm:text-base font-semibold text-[#cf4f41] hover:bg-[#cf4f41]/5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer bg-white"
                    >
                      {city}
                    </button>
                  ))}
                  {/* Append All Cities for the first category */}
                  {idx === 0 && (
                    <button
                      onClick={() => handleLocationClick(cat.title, "all-cities")}
                      className="rounded-full border border-[#cf4f41] px-6 py-2.5 text-sm sm:text-base font-semibold text-[#cf4f41] hover:bg-[#cf4f41]/5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer bg-white"
                    >
                      All cities
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
