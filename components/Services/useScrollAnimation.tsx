// hooks/useScrollAnimation.ts
import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  threshold?: number;
  duration?: number;
  delay?: number;
  fromVars?: gsap.TweenVars;
  toVars?: gsap.TweenVars;
  scrub?: boolean | number;
  markers?: boolean;
  start?: string;
  end?: string;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

/**
 * Custom hook for creating scroll-triggered animations
 */
export const useScrollAnimation = <T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
): { current: T | null } => {
  const elementRef = useRef<T>(null);

  const {
    threshold = 0.3,
    duration = 0.8,
    delay = 0,
    fromVars = { opacity: 0, y: 50 },
    toVars = { opacity: 1, y: 0, ease: "power3.out" },
    scrub = false,
    markers = false,
    start = "top bottom-=100",
    end = "bottom center",
    toggleActions = "play none none reverse",
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = options;

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    // Create the timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
        markers,
        toggleActions,
        // threshold is not a valid ScrollTrigger property
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack,
      },
    });

    // Add animation to the timeline
    tl.fromTo(element, { ...fromVars }, { ...toVars, duration, delay });

    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [
    threshold,
    duration,
    delay,
    fromVars,
    toVars,
    scrub,
    markers,
    start,
    end,
    toggleActions,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  ]);

  return elementRef;
};

/**
 * Custom hook for animating elements with staggered delays
 */
export const useStaggerAnimation = <T extends HTMLElement>(
  options: ScrollAnimationOptions & {
    childSelector?: string;
    staggerAmount?: number;
  } = {}
): { current: T | null } => {
  const containerRef = useRef<T>(null);

  const {
    childSelector = ">*",
    staggerAmount = 0.1,
    threshold = 0.1,
    duration = 0.5,
    fromVars = { opacity: 0, y: 20 },
    toVars = { opacity: 1, y: 0, ease: "power2.out" },
    scrub = false,
    markers = false,
    start = "top bottom-=100",
    end = "bottom center",
    toggleActions = "play none none reverse",
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = options;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const elements = container.querySelectorAll(childSelector);

    if (elements.length === 0) return;

    // Create the timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start,
        end,
        scrub,
        markers,
        toggleActions,
        // threshold is not a valid ScrollTrigger property
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack,
      },
    });

    // Add staggered animations to the timeline
    tl.fromTo(
      elements,
      { ...fromVars },
      {
        ...toVars,
        duration,
        stagger: staggerAmount,
      }
    );

    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [
    childSelector,
    staggerAmount,
    threshold,
    duration,
    fromVars,
    toVars,
    scrub,
    markers,
    start,
    end,
    toggleActions,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  ]);

  return containerRef;
};

export default useScrollAnimation;
