"use client";

import React, { useEffect, useRef } from "react";
import Experience from "@/components/Experience";
import Approach from "@/components/Approach";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import GraffitiBackground from "./ui/GraffitiBackground";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const CombinedSections = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const approachRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Store a reference to all main sections
    sectionsRef.current = [experienceRef.current, approachRef.current].filter(
      (section): section is HTMLElement => section !== null
    );

    // Create timeline for initial load animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial animation when page loads
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    // Animate in the first section
    tl.fromTo(
      experienceRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.5"
    );

    // Create scroll-triggered animations for each section
    sectionsRef.current.forEach((section, index) => {
      // Skip the first section as it's already animated in
      if (index === 0) return;

      // Create scroll animation for each subsequent section
      gsap.fromTo(
        section,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top bottom-=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
            // markers: true, // Uncomment for debugging
          },
        }
      );

      // Add parallax effect to section backgrounds
      const sectionBg = section.querySelector(".section-bg");
      if (sectionBg) {
        gsap.fromTo(
          sectionBg,
          { y: 0 },
          {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    });

    // Create header pinning effect if header exists
    const header = document.querySelector("header");
    if (header) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        endTrigger: "html",
        end: "bottom top",
        toggleClass: { targets: header, className: "sticky-header" },
      });
    }

    // Clean up all ScrollTriggers when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Function to handle smooth scrolling between sections
  const scrollToSection = (section: HTMLElement | null) => {
    if (section) {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: section,
          offsetY: 80, // Adjust for any fixed headers
        },
        ease: "power3.inOut",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center flex-col overflow-hidden bg-gradient-to-b from-[#141217] to-[#0c0a0f] min-h-screen"
    >
      <GraffitiBackground />
      {/* Gaming-themed golden light effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-400/20 blur-[100px] animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/15 blur-[120px] animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/2 w-64 h-64 rounded-full bg-cyan-300/10 blur-[80px] animate-pulse"
          style={{ animationDuration: "10s" }}
        ></div>
      </div>
      {/* Subtle overlay grid pattern */}
      {/* <div className="absolute inset-0 bg-[url('/bg-grid.png')] bg-repeat opacity-10 z-10"></div> */}
      <div className="max-w-7xl w-full">
        {/* Experience Section with animated elements */}
        <section ref={experienceRef} className="relative py-20 overflow-hidden">
          <div className="section-bg absolute inset-0 z-0 opacity-30 bg-[url('/bg-pattern.svg')]"></div>
          <Experience />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => scrollToSection(approachRef.current)}
              className="animate-bounce p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
              aria-label="Scroll to Approach section"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Approach Section with staggered animations */}
        <section ref={approachRef} className="relative py-20 overflow-hidden">
          <Approach />
        </section>
      </div>

      {/* Fixed navigation dots for section navigation */}
      <div className="fixed right-10 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {["Experience", "Approach"].map((section, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(sectionsRef.current[i])}
            className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
            aria-label={`Navigate to ${section} section`}
          />
        ))}
      </div>
    </div>
  );
};

export default CombinedSections;
