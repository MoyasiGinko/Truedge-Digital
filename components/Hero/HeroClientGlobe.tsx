"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Import GridGlobe with SSR disabled
const HeroGlobe = dynamic(() => import("@/components/Hero/HeroGridGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-transparent rounded-full opacity-20 border border-blue-500/30"></div>
    </div>
  ),
});

export default function ClientGlobe() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1023px)");

  // Determine globe size based on screen size
  const size = isMobile ? 300 : isTablet ? 500 : 600;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[100%] lg:h-[100%] bg-transparent rounded-full opacity-20 border border-blue-500/30"></div>
      </div>
    );
  }

  return <HeroGlobe size={size} />;
}
