"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

// Register the Draggable plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<"left" | "right">(
    direction
  );
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const isDragging = useRef(false);
  const startDragX = useRef(0);

  // State to track the last drag direction
  const [lastDragDirection, setLastDragDirection] = useState<
    "left" | "right" | null
  >(null);

  // Convert speed to duration in seconds
  const getSpeedDuration = (): number => {
    switch (speed) {
      case "fast":
        return 5;
      case "normal":
        return 20;
      case "slow":
        return 40;
      default:
        return 20;
    }
  };

  // Initialize the animation
  const initAnimation = () => {
    if (!scrollerRef.current || !containerRef.current) return;

    // Add items to the scroller
    setupItems();

    // Set up the draggable
    setupDraggable();

    // Start the animation
    startAnimation();
  };

  // Set up the items in the carousel
  const setupItems = () => {
    if (!scrollerRef.current) return;

    // Clear the scroller
    scrollerRef.current.innerHTML = "";

    // Create the original items
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className =
        "w-[90vw] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-800 p-5 md:p-16 md:w-[60vw]";
      li.style.background = "rgb(4,7,29)";
      li.style.backgroundImage =
        "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)";

      li.innerHTML = `
        <blockquote>
          <div
            aria-hidden="true"
            class="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
          ></div>
          <span class="relative z-20 text-sm md:text-lg leading-[1.6] text-white font-normal">
            ${item.quote}
          </span>
          <div class="relative z-20 mt-6 flex flex-row items-center">
            <div class="me-3">
              <img src="/profile.svg" alt="profile" />
            </div>
            <span class="flex flex-col gap-1">
              <span class="text-xl font-bold leading-[1.6] text-white">
                ${item.name}
              </span>
              <span class="text-sm leading-[1.6] text-white-200 font-normal">
                ${item.title}
              </span>
            </span>
          </div>
        </blockquote>
      `;

      if (scrollerRef.current) {
        scrollerRef.current.appendChild(li);
      }
    });

    // Calculate how many clones we need
    const originals = Array.from(scrollerRef.current.children);
    const firstItem = originals[0] as HTMLElement;
    const itemWidth = firstItem.offsetWidth;
    const containerWidth = containerRef.current!.offsetWidth;
    const itemsNeeded = Math.ceil(containerWidth / itemWidth) * 3;

    // Create clones to fill the space
    const numClones = Math.max(
      itemsNeeded - originals.length,
      originals.length * 2
    );

    // Add clones
    for (let i = 0; i < numClones; i++) {
      const clone = originals[i % originals.length].cloneNode(true);
      scrollerRef.current.appendChild(clone);
    }

    // Position the scroller initially
    const scrollWidth = scrollerRef.current.scrollWidth;
    const viewWidth = scrollWidth / 3;
    gsap.set(scrollerRef.current, { x: -viewWidth });
  };

  // Set up draggable
  const setupDraggable = () => {
    if (!scrollerRef.current) return;

    // Clean up existing draggable
    if (draggableRef.current) {
      draggableRef.current.kill();
    }

    draggableRef.current = Draggable.create(scrollerRef.current, {
      type: "x",
      inertia: true,
      onDragStart: function () {
        // Pause the animation
        if (tweenRef.current) {
          tweenRef.current.pause();
        }

        isDragging.current = true;
        startDragX.current = this.x;
      },
      onDragEnd: function () {
        isDragging.current = false;

        // Calculate drag distance and direction
        const endX = this.x;
        const dragDelta = endX - startDragX.current;
        const dragThreshold = 10; // Minimum pixels to consider it a directional drag

        // Only change direction if the drag was significant
        if (Math.abs(dragDelta) > dragThreshold) {
          // Determine drag direction (the physical direction user dragged)
          const draggedDirection = dragDelta < 0 ? "left" : "right";

          // Update the last drag direction
          setLastDragDirection(draggedDirection);

          // Set the carousel direction to match the drag direction
          setCurrentDirection(draggedDirection);

          console.log(
            `Drag detected: ${draggedDirection}, changing carousel direction to: ${draggedDirection}`
          );
        }

        // Restart animation from current position
        startAnimation();
      },
    })[0];
  };

  // Start or restart the animation
  const startAnimation = () => {
    if (!scrollerRef.current) return;

    // Clean up existing animation
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    // Get current position
    const currentX = gsap.getProperty(scrollerRef.current, "x") as number;

    // Calculate animation parameters
    const scrollWidth = scrollerRef.current.scrollWidth;
    const viewWidth = scrollWidth / 3;

    // Target position based on direction
    // If direction is "left", move content to the left (negative)
    // If direction is "right", move content to the right (positive)
    const targetX =
      currentDirection === "left" ? currentX - viewWidth : currentX + viewWidth;

    // Duration based on speed
    const duration = getSpeedDuration() * (viewWidth / 1000);

    console.log(
      `Animation starting - Direction: ${currentDirection}, ` +
        `Current position: ${currentX}, Target position: ${targetX}`
    );

    // Create animation
    tweenRef.current = gsap.to(scrollerRef.current, {
      x: targetX,
      duration,
      ease: "none",
      onComplete: handleAnimationComplete,
    });
  };

  // Handle animation completion
  const handleAnimationComplete = () => {
    if (!scrollerRef.current) return;

    // Get current position
    const currentX = gsap.getProperty(scrollerRef.current, "x") as number;

    // Calculate wrap position
    const scrollWidth = scrollerRef.current.scrollWidth;
    const viewWidth = scrollWidth / 3;

    // Determine if we need to wrap
    let resetX = currentX;

    if (currentDirection === "left" && currentX <= -viewWidth * 2) {
      // If going left and reached left boundary, reset to one viewWidth left
      resetX = -viewWidth;
    } else if (currentDirection === "right" && currentX >= 0) {
      // If going right and reached right boundary, reset to one viewWidth right
      resetX = -viewWidth;
    }

    // Reset position instantly if needed
    if (resetX !== currentX) {
      gsap.set(scrollerRef.current, { x: resetX });
    }

    // Continue animation
    startAnimation();
  };

  // Set up event listeners for hover pause
  useEffect(() => {
    const container = containerRef.current;

    if (container && pauseOnHover) {
      const handleMouseEnter = () => {
        if (tweenRef.current && !isDragging.current) {
          tweenRef.current.pause();
        }
      };

      const handleMouseLeave = () => {
        if (tweenRef.current && !isDragging.current) {
          tweenRef.current.play();
        }
      };

      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  // Initialize on load
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStart(true);
      initAnimation();
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
      if (draggableRef.current) {
        draggableRef.current.kill();
      }
    };
  }, []);

  // Monitor and debug drag directions and carousel direction
  useEffect(() => {
    // This effect monitors changes in drag and carousel direction
    const handleDragDirectionChange = (
      dragDirection: "left" | "right" | null
    ): void => {
      // The carousel direction should always match the drag direction
      // This ensures:
      // 1. If carousel is moving right and user drags right → continue right
      // 2. If carousel is moving left and user drags left → continue left
      // 3. If carousel is moving right and user drags left → switch to left
      // 4. If carousel is moving left and user drags right → switch to right
      console.log(
        `Drag direction: ${dragDirection}, Setting carousel direction to: ${dragDirection}`
      );
    };

    // We could add additional logging or debugging here if needed
    return () => {
      // Cleanup if needed
    };
  }, [currentDirection]);

  // Update when direction changes
  useEffect(() => {
    if (start && !isDragging.current) {
      startAnimation();
    }
  }, [currentDirection, start]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (start) {
        initAnimation();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [start]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-screen overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap cursor-grab",
          start && "transition-transform"
        )}
      />
    </div>
  );
};
