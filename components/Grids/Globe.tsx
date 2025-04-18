"use client";
import React, { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3, Object3D } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: JSX.IntrinsicElements["object3D"] & {
      ref?: React.Ref<ThreeGlobe>;
    };
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings = [0];

export function Globe({ globeConfig, data }: WorldProps) {
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
        pointType?: "start" | "end";
      }[]
    | null
  >(null);

  const globeRef = useRef<ThreeGlobe>(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (globeRef.current) {
      _buildData();
      _buildMaterial();
    }
  }, [globeRef.current]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  };

  const _buildData = () => {
    // Validate arcs data first
    const validArcs = data.filter((arc) => {
      return (
        !isNaN(arc.startLat) &&
        !isNaN(arc.startLng) &&
        !isNaN(arc.endLat) &&
        !isNaN(arc.endLng) &&
        !isNaN(arc.arcAlt) &&
        typeof arc.color === "string"
      );
    });

    let points = [];
    for (let i = 0; i < validArcs.length; i++) {
      const arc = validArcs[i];
      // Ensure color is a valid string before processing
      const validColor = typeof arc.color === "string" ? arc.color : "#3b82f6";
      const rgb = hexToRgb(validColor);

      // Always ensure rgb is valid
      const safeRgb = rgb || { r: 59, g: 130, b: 246 };

      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) =>
          `rgba(${safeRgb.r}, ${safeRgb.g}, ${safeRgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
        pointType: "start" as "start",
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) =>
          `rgba(${safeRgb.r}, ${safeRgb.g}, ${safeRgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
        pointType: "end" as "end",
      });
    }

    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
          )
        ) === i
    );

    setGlobeData(filteredPoints);
  };

  // Add error handling for globe data parsing
  useEffect(() => {
    if (globeRef.current && globeData) {
      try {
        globeRef.current
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.7)
          .showAtmosphere(defaultProps.showAtmosphere)
          .atmosphereColor(defaultProps.atmosphereColor)
          .atmosphereAltitude(defaultProps.atmosphereAltitude)
          .hexPolygonColor((e) => {
            return defaultProps.polygonColor;
          });
        startAnimation();
      } catch (error) {
        console.error("Globe initialization error:", error);
      }
    }
  }, [globeData]);

  const startAnimation = () => {
    if (!globeRef.current || !globeData) return;

    // Validate data before using it
    const validArcs = data.filter((arc) => {
      // Check for NaN values
      return (
        !isNaN(arc.startLat) &&
        !isNaN(arc.startLng) &&
        !isNaN(arc.endLat) &&
        !isNaN(arc.endLng) &&
        !isNaN(arc.arcAlt)
      );
    });

    // Ensure we're not trying to display empty data
    if (validArcs.length === 0) {
      console.warn("No valid arc data to display");
      return;
    }

    try {
      globeRef.current
        .arcsData(validArcs)
        .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
        .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
        .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
        .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
        .arcColor((e: any) => {
          // First try to get the color from the data
          let color = (e as { color: any }).color;

          // If it's not a string, use a default color
          if (typeof color !== "string") {
            color = "#3b82f6";
          }

          // Extra safety - ensure it's a properly formatted color string
          if (!color.startsWith("#") && !color.startsWith("rgb")) {
            color = "#3b82f6";
          }

          return color;
        })
        .arcAltitude((e) => {
          return (e as { arcAlt: number }).arcAlt * 1;
        })
        .arcStroke((e) => {
          return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
        })
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap((e) => (e as { order: number }).order * 1)
        .arcDashGap(15)
        .arcDashAnimateTime((e) => defaultProps.arcTime);

      // Add this section for safety - prevent using points with NaN values
      const validPointsData = globeData.filter(
        (point) => !isNaN(point.lat) && !isNaN(point.lng)
      );

      globeRef.current
        // Remove points data configuration
        .pointsData([]);

      // Empty rings to start with
      globeRef.current
        .ringsData([])
        .ringColor((e: any) => (t: any) => {
          try {
            if (typeof e.color === "function") {
              return e.color(t);
            }
            return `rgba(59, 130, 246, ${1 - t})`;
          } catch (err) {
            return `rgba(59, 130, 246, ${1 - t})`;
          }
        })
        .ringMaxRadius(defaultProps.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(
          (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
        );
    } catch (error) {
      console.error("Error setting up globe animations:", error);
    }
  };

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData) return;
      try {
        // Generate random indices but don't exceed available data
        const maxIndex = Math.min(data.length - 1, globeData.length - 1);
        if (maxIndex < 0) return; // No valid data to show rings

        const count = Math.min(Math.floor((maxIndex * 4) / 5), maxIndex);
        numbersOfRings = genRandomNumbers(0, maxIndex, Math.max(1, count));

        // Filter valid ring data
        const ringsData = globeData.filter(
          (d, i) => numbersOfRings.includes(i) && !isNaN(d.lat) && !isNaN(d.lng)
        );

        globeRef.current.ringsData(ringsData);
      } catch (error) {
        console.error("Error updating rings:", error);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [globeRef.current, globeData]);

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  );
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, []);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: any) {
  // Check if hex is a string and has a valid format
  if (typeof hex !== "string" || !hex) {
    console.warn("Invalid hex color:", hex);
    return { r: 59, g: 130, b: 246 }; // Default to #3b82f6
  }

  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 59, g: 130, b: 246 }; // Default to #3b82f6
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  // Safety check to prevent infinite loop
  if (max - min + 1 < count) {
    // Not enough unique numbers in range
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }

  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
