"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import GridGlobe with SSR disabled
const GridGlobe = dynamic(() => import("./GridGlobe"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#04071d]"></div>,
});

export default function ClientGlobe() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-[#04071d]"></div>;
  }

  return <GridGlobe />;
}
