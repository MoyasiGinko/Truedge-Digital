"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import sampleArcs from "@/data/sampleArcs"; // Adjust the path as necessary

// Dynamic import for performance
const World = dynamic(() => import("./HeroGlobe").then((m) => m.World), {
  ssr: false,
});

// Add interface for component props
interface GridGlobeProps {
  size?: number;
}

// Update component to accept props
const GridGlobe = ({ size = 600 }: GridGlobeProps) => {
  const [globeReady, setGlobeReady] = useState(false);

  // Globe configuration
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

  // Sample arcs data - using the provided structure

  // Set globe ready on component mount
  useEffect(() => {
    setGlobeReady(true);
  }, []);

  if (!globeReady) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div
          style={{ width: size, height: size }}
          className="bg-transparent rounded-full opacity-20 border border-blue-500/30"
        ></div>
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }} className="mx-auto">
      <World globeConfig={globeConfig} data={sampleArcs} />
    </div>
  );
};

export default GridGlobe;
