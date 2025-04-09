"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

// Create a deterministic pseudo-random number generator
// This will ensure consistent values between server and client
function createSeededRandom(seed = 42) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Create a seeded random function
const seededRandom = createSeededRandom();

const GraffitiBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graffitiBgRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const charactersRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Define paths for characters to follow
  const paths = [
    "M0,100 C100,0 400,300 500,100 C600,0 800,200 1000,100",
    "M0,300 C200,150 300,450 500,300 C700,150 800,400 1000,300",
    "M1000,200 C800,350 600,50 500,200 C400,350 200,50 0,200",
  ];

  // Initialize on client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const container = containerRef.current;
    const graffitiBg = graffitiBgRef.current;
    const particles = particlesRef.current;
    const characters = charactersRef.current;

    if (!container || !graffitiBg || !particles || !characters) return;

    // Create master timeline
    const masterTl = gsap.timeline();

    // Initialize background
    gsap.set(graffitiBg, {
      opacity: 0.3,
      scale: 1.1,
    });

    // Initialize particles
    const particleElements = particles.querySelectorAll(".particle");
    gsap.set(particleElements, {
      opacity: 0,
      scale: 0,
      y: 100,
    });

    // Initialize characters
    const characterElements = characters.querySelectorAll(
      ".graffiti-character"
    );
    gsap.set(characterElements, {
      opacity: 0,
      scale: 0.7,
      y: 50,
    });

    // Initial animation
    const initTl = gsap.timeline();

    initTl
      .to(graffitiBg, {
        opacity: 0.6,
        scale: 1,
        duration: 2,
        ease: "power3.out",
      })
      .to(
        particleElements,
        {
          opacity: 0.7,
          scale: 1,
          y: 0,
          stagger: 0.05,
          duration: 1.2,
          ease: "back.out(1.7)",
        },
        "-=1.5"
      )
      .to(
        characterElements,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
        },
        "-=1"
      );

    masterTl.add(initTl);

    // Create scroll-driven animations

    // 1. Parallax effect for background
    gsap.to(graffitiBg, {
      y: "-30%",
      scale: 1.2,
      opacity: 0.8,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    // 2. Characters floating and following paths on scroll
    characterElements.forEach((character, i) => {
      // Select the path for this character
      const pathIndex = i % paths.length;

      // Create animation along path
      gsap.to(character, {
        motionPath: {
          path: paths[pathIndex],
          align: "self",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        ease: "none",
        duration: 10,
      });

      // Add additional rotation and scaling based on scroll
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(character, {
            rotation: progress * 360,
            scale: 0.8 + Math.sin(progress * Math.PI) * 0.5,
            duration: 0.5,
          });
        },
      });
    });

    // 3. Particles floating effect with scroll acceleration
    particleElements.forEach((particle, index) => {
      // Base floating animation
      gsap.to(particle, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        rotation: `random(-180, 180)`,
        repeat: -1,
        yoyo: true,
        duration: 3 + (index % 5),
        ease: "sine.inOut",
      });

      // Scroll-based acceleration
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          // Speed up particles when scrolling faster
          const velocity = Math.abs(self.getVelocity() / 2000);
          const cappedVelocity = Math.min(velocity, 5);
          gsap.to(particle, {
            duration: 0.1,
            scale: 0.8 + cappedVelocity * 0.2,
            opacity: 0.5 + cappedVelocity * 0.1,
            ease: "none",
          });
        },
      });
    });

    // 4. Final scene animation at the end of scroll
    const endSceneTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "bottom bottom-=200",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    endSceneTl
      .to(characterElements, {
        duration: 2,
        scale: 1.5,
        opacity: 0.9,
        stagger: 0.1,
        y: -50,
        ease: "power2.inOut",
      })
      .to(
        particleElements,
        {
          duration: 2,
          scale: 2,
          opacity: 0.8,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        "-=1.5"
      )
      .to(
        graffitiBg,
        {
          duration: 2,
          opacity: 0.9,
          scale: 1.3,
          filter: "saturate(1.5) brightness(1.2)",
          ease: "power2.inOut",
        },
        "-=2"
      );

    // Interactive hover and mouse movement effects
    // Define types for event handler
    interface MousePosition {
      clientX: number;
      clientY: number;
    }

    const handleMouseMove = (
      e: React.MouseEvent<HTMLDivElement> | MouseEvent
    ): void => {
      if (!hasInteracted) setHasInteracted(true);

      const { clientX, clientY } = e;
      const xPos = clientX / window.innerWidth - 0.5;
      const yPos = clientY / window.innerHeight - 0.5;

      // Move background slightly in opposite direction of mouse
      gsap.to(graffitiBg, {
        x: xPos * -30,
        y: yPos * -30,
        duration: 1,
        ease: "power2.out",
      });

      // Make particles follow mouse with varying intensity
      particleElements.forEach((particle: Element, i: number) => {
        const factor = (i % 5) + 1;
        gsap.to(particle, {
          x: xPos * 100 * factor,
          y: yPos * 100 * factor,
          duration: 1 + (i % 3),
          ease: "power1.out",
          overwrite: "auto",
        });
      });

      // Make characters slightly rotate toward mouse position
      characterElements.forEach((character: Element, i: number) => {
        gsap.to(character, {
          rotation: xPos * 15,
          skewX: xPos * 5,
          skewY: yPos * 5,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    // Click effects for more interactivity
    // Interface for click event handling
    interface ClickPosition {
      clientX: number;
      clientY: number;
    }

    // Interface for character animation properties
    interface CharacterAnimationData {
      distX: number;
      distY: number;
      distance: number;
      normalizedDist: number;
      delay: number;
    }

    const handleClick = (e: MouseEvent): void => {
      const { clientX, clientY }: ClickPosition = e;

      // Create a ripple effect
      const ripple: HTMLDivElement = document.createElement("div");
      ripple.classList.add("click-ripple");
      ripple.style.position = "absolute";
      ripple.style.left = `${clientX}px`;
      ripple.style.top = `${clientY}px`;
      ripple.style.background =
        "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)";
      ripple.style.width = "10px";
      ripple.style.height = "10px";
      ripple.style.borderRadius = "50%";
      ripple.style.pointerEvents = "none";
      ripple.style.zIndex = "100";
      document.body.appendChild(ripple);

      gsap.to(ripple, {
        scale: 40,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        onComplete: () => {
          document.body.removeChild(ripple);
        },
      });

      // Make characters jump toward the click
      characterElements.forEach((character: Element, i: number) => {
        const delay: number = i * 0.1;
        const distX: number = clientX - character.getBoundingClientRect().left;
        const distY: number = clientY - character.getBoundingClientRect().top;
        const distance: number = Math.sqrt(distX * distX + distY * distY);
        const normalizedDist: number = Math.min(1, 300 / distance);

        gsap
          .timeline()
          .to(character, {
            x: `+=${distX * normalizedDist * 0.2}`,
            y: `+=${distY * normalizedDist * 0.2}`,
            scale: 1.3,
            duration: 0.4,
            delay: delay,
            ease: "power2.out",
          })
          .to(character, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)",
          });
      });
    };

    // Add event listeners
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    // Clean up event listeners and ScrollTriggers when component unmounts
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([graffitiBg, particleElements, characterElements]);
    };
  }, [hasInteracted, isClient]);

  // Generate pre-calculated fixed particles data
  const particlesData = React.useMemo(() => {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        width: (seededRandom() * 20 + 5).toFixed(2),
        height: (seededRandom() * 20 + 5).toFixed(2),
        backgroundColor: `hsla(${(seededRandom() * 360).toFixed(
          2
        )}, 100%, 70%, 0.6)`,
        borderRadius:
          seededRandom() > 0.5
            ? "50%"
            : `${(seededRandom() * 5 + 2).toFixed(2)}px`,
        top: `${(seededRandom() * 100).toFixed(2)}%`,
        left: `${(seededRandom() * 100).toFixed(2)}%`,
        boxShadow: `0 0 10px hsla(${(seededRandom() * 360).toFixed(
          2
        )}, 100%, 70%, 0.8)`,
      });
    }
    return particles;
  }, []);

  // Create particles with pre-computed values
  const createParticles = (): React.ReactNode[] => {
    return particlesData.map((particle, i) => (
      <div
        key={`particle-${i}`}
        className="particle absolute"
        style={{
          width: `${particle.width}px`,
          height: `${particle.height}px`,
          backgroundColor: particle.backgroundColor,
          borderRadius: particle.borderRadius,
          filter: "blur(1px)",
          top: particle.top,
          left: particle.left,
          boxShadow: particle.boxShadow,
        }}
      />
    ));
  };

  // Create graffiti characters
  const createCharacters = () => {
    const characters = [
      { shape: "M5,20 L15,5 L25,20 Z", color: "#ff2a6d" }, // Triangle
      { shape: "M5,5 L25,5 L25,25 L5,25 Z", color: "#05d9e8" }, // Square
      { shape: "M15,5 L25,15 L15,25 L5,15 Z", color: "#ffd319" }, // Diamond
      { shape: "M15,5 A10,10 0 1,1 15,25 A10,10 0 1,1 15,5", color: "#d1f7ff" }, // Circle
    ];

    return characters.map((char, i) => (
      <div
        key={`char-${i}`}
        className="graffiti-character absolute"
        style={{
          width: "30px",
          height: "30px",
          top: `${20 + i * 15}%`,
          left: `${15 + i * 20}%`,
          zIndex: 10,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 30 30">
          <path d={char.shape} fill={char.color} />
        </svg>
      </div>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        mixBlendMode: "overlay",
        perspective: "1000px",
      }}
    >
      {/* Semi-transparent graffiti background */}
      <div
        ref={graffitiBgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: "url('/path/to/transparent-graffiti.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }}
      />

      {/* Floating particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      >
        {createParticles()}
      </div>

      {/* Graffiti characters */}
      <div
        ref={charactersRef}
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      >
        {createCharacters()}
      </div>
    </div>
  );
};

export default GraffitiBackground;
