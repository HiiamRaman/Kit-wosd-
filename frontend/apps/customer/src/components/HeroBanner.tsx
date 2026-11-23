import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import khalti1 from "../assets/Home-khalti/khalti1.webp";
import khalti2 from "../assets/Home-khalti/khalti2.webp";
import khalti3 from "../assets/Home-khalti/khalti3.webp";
import khalti4 from "../assets/Home-khalti/khalti4.webp";
import khalti5 from "../assets/Home-khalti/khalti5.webp";
import khalti6 from "../assets/Home-khalti/khalti6.webp";
import khalti7 from "../assets/Home-khalti/khalti7.webp";
import khalti8 from "../assets/Home-khalti/khalti8.webp";

const banners = [
  { id: 1, title: "KHALTI88 WELCOME REWARD", image: khalti1 },
  { id: 2, title: "DAILY LIVE CASINO YIELD", image: khalti2 },
  { id: 3, title: "CRASH & JETX TOURNAMENT", image: khalti3 },
  { id: 4, title: "MEGA FORTUNE SPINS", image: khalti4 },
  { id: 5, title: "GLOBAL LEAGUE ODDS", image: khalti5 },
  { id: 6, title: "OCEAN KING MULTIPLIERS", image: khalti6 },
  { id: 7, title: "PRO TOURNAMENT STREAMS", image: khalti7 },
  { id: 8, title: "LIGHTSPEED SETTLEMENTS", image: khalti8 },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative h-[400px] lg:h-[480px] bg-[#0d0d0d] border-b border-zinc-800/80 overflow-hidden w-full group mb-10">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full h-full px-4 sm:px-6 lg:px-8 relative z-10">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 inset-y-0 transition-all duration-700 ease-in-out flex items-center ${
              index === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 pointer-events-none scale-95"
            }`}
          >
            <div className="absolute inset-0 z-0 lg:rounded-3xl overflow-hidden border-x border-zinc-800/80 shadow-2xl bg-[#111]">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover object-center" />
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center cursor-pointer">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center cursor-pointer">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
