"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import GridGlobe with SSR disabled
const HeroGlobe = dynamic(() => import("@/components/Hero/HeroGridGlobe"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent"></div>,
});

export default function ClientGlobe() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-transparent"></div>;
  }

  return <HeroGlobe />;
}
