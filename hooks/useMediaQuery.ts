"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") return;

    // Create a media query
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create listener function
    const listener = () => {
      setMatches(media.matches);
    };

    // Listen for changes
    media.addEventListener("change", listener);

    // Remove listener on cleanup
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
