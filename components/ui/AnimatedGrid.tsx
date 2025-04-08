"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Fixed cell size in pixels - ensures consistent grid size across all screens
const CELL_SIZE = 80; // Each grid cell will be 80x80px

// Enhanced futuristic color gradients
const COLOR_GRADIENTS = [
  ["#00ffff", "#0077ff"], // cyan to blue
  ["#33ff99", "#00ccff"], // neon green to cyan
  ["#ff00cc", "#9900ff"], // neon pink to purple
  ["#ffcc00", "#ff3300"], // yellow to orange-red
  ["#00ff66", "#00ccff"], // neon green to cyan
  ["#ff3366", "#9933ff"], // hot pink to purple
  ["#00ffcc", "#0066ff"], // aqua to blue
];

// Code snippets focused on JS, TS, Tailwind, npm commands and deployment
const CODE_SNIPPETS = [
  // JavaScript
  "// Basic React component\nconst Button = ({ text }) => {\n  return (\n    <button onClick={() => alert('Clicked')}>\n      {text}\n    </button>\n  );\n};",

  // TypeScript
  "// Simple TypeScript interface\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nconst getUser = (id: string): User => {\n  return {\n    id,\n    name: 'John Doe',\n    email: 'john@example.com'\n  };\n};",

  // Tailwind
  '// Simple Tailwind component\nconst Card = ({ title }) => (\n  <div className="bg-white p-4 rounded shadow">\n    <h3 className="text-lg font-bold">\n      {title}\n    </h3>\n  </div>\n);',

  // Config
  "// Next.js config\nconst nextConfig = {\n  images: {\n    domains: ['example.com']\n  },\n  env: {\n    API_URL: 'https://api.example.com'\n  }\n};",

  // Terminal commands
  "$ npm install\n$ npm run dev\n\n> project@0.1.0 dev\n> next dev\n\n- ready started server on 0.0.0.0:3000, url: http://localhost:3000\n- event compiled client and server successfully in 248 ms (17 modules)\n- wait compiling...\n- event compiled client and server successfully in 132 ms (19 modules)",

  // Deployment process
  '$ git add .\n$ git commit -m "Ready for production"\n$ git push origin main\n\n> Deploying to production...\n> Running build step...\n> ✓ Build completed successfully\n> ✓ CDN assets optimized\n> ✓ Database migrations applied\n> ✓ Deployment complete!\n> 🚀 App is live at: https://your-app.com',

  // Services
  "🔧 OUR SERVICES:\n\n✓ Full-stack Development\n✓ UI/UX Design\n✓ Mobile App Development\n✓ API Integration\n✓ DevOps & CI/CD\n✓ Cloud Infrastructure\n✓ Performance Optimization\n✓ Security Auditing\n✓ 24/7 Maintenance\n✓ Technical Consulting",
];

const AnimatedGrid = () => {
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [codeSnippetIndex, setCodeSnippetIndex] = useState(0);

  // Interface definitions
  interface AnimatingLine {
    id: string;
    isHorizontal: boolean;
    position: number;
    gradient: string[];
    duration: number;
    delay: number;
    createdAt: number;
  }

  interface CodeSnippet {
    id: string;
    text: string;
    position: { x: number; y: number };
    currentText: string;
    isTyping: boolean;
    charIndex: number;
    opacity: number;
    scale: number;
    rotation: number;
    glowColor: string;
  }

  const [animatingLines, setAnimatingLines] = useState<AnimatingLine[]>([]);
  const [codeSnippet, setCodeSnippet] = useState<CodeSnippet | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextSnippetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // This ensures the component renders only on the client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);

    // Get initial window dimensions
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Update dimensions on resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate grid lines and animations
  useEffect(() => {
    if (!isClient) return;

    // Calculate how many cells can fit in the current viewport
    const numCols = Math.ceil(dimensions.width / CELL_SIZE) + 1;
    const numRows = Math.ceil(dimensions.height / CELL_SIZE) + 1;

    // Generate grid lines based on fixed cell size
    const horizontalLines = Array.from({ length: numRows }, (_, i) => ({
      id: `h${i}`,
      y: i * CELL_SIZE,
      index: i,
    }));

    const verticalLines = Array.from({ length: numCols }, (_, i) => ({
      id: `v${i}`,
      x: i * CELL_SIZE,
      index: i,
    }));

    // Function to add new random animated lines
    const addRandomAnimatedLine = () => {
      // Decide if horizontal or vertical line (50/50 chance)
      const isHorizontal = Math.random() > 0.5;

      // Random position
      const position = isHorizontal
        ? horizontalLines[Math.floor(Math.random() * horizontalLines.length)].y
        : verticalLines[Math.floor(Math.random() * verticalLines.length)].x;

      // Random color gradient
      const gradient =
        COLOR_GRADIENTS[Math.floor(Math.random() * COLOR_GRADIENTS.length)];

      // Random duration between 1.5 and 3 seconds
      const duration = 1.5 + Math.random() * 1.5;

      // Random delay before animation starts
      const delay = Math.random() * 0.5;

      // Create unique ID
      const id = `line-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      const newLine = {
        id,
        isHorizontal,
        position,
        gradient,
        duration,
        delay,
        createdAt: Date.now(),
      };

      // Add the new line to the state
      setAnimatingLines((prevLines) => [...prevLines, newLine]);

      // Schedule removal of the line after animation completes (duration + 0.5s buffer)
      setTimeout(() => {
        setAnimatingLines((prevLines) =>
          prevLines.filter((line) => line.id !== id)
        );
      }, (duration + delay + 0.5) * 1000);
    };

    // Start adding random lines
    const startRandomAnimation = () => {
      // Add initial batch of lines
      for (let i = 0; i < 5; i++) {
        addRandomAnimatedLine();
      }

      // Continue adding lines at random intervals
      const scheduleNextLine = () => {
        // Random interval between 200ms and 800ms
        const nextInterval = 200 + Math.random() * 600;

        animationRef.current = setTimeout(() => {
          addRandomAnimatedLine();
          scheduleNextLine();
        }, nextInterval);
      };

      scheduleNextLine();
    };

    startRandomAnimation();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isClient, dimensions]);

  // Calculate max width needed for a text snippet with very generous sizing
  const calculateTextDimensions = (text: string) => {
    // Estimate characters per line and line count
    const lines = text.split("\n");
    const maxLineLength = Math.max(...lines.map((line) => line.length));
    const lineCount = lines.length;

    // Extra generous width sizing to absolutely ensure text never overflows
    // Use 13px per character to account for bold text, wide characters, and syntax highlighting
    const width = Math.max(500, maxLineLength * 13 + 100);

    // Very generous height calculation with ample padding
    const height = lineCount * 25 + 100;

    // For longer text with many lines, add even more height padding
    const extraPadding = lineCount > 10 ? 50 : 0;

    return {
      width,
      height: height + extraPadding,
      textAreaWidth: width - 40, // Width of the actual text area (for clip path)
      textAreaHeight: height + extraPadding - 40, // Height of the actual text area (for clip path)
    };
  };

  // Code typing animation effect - show snippets in sequence
  useEffect(() => {
    if (!isClient) return;

    // Function to handle typing animation for a single snippet
    const startTypingAnimation = (snippet: CodeSnippet) => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }

      typingIntervalRef.current = setInterval(() => {
        setCodeSnippet((current) => {
          if (!current) return null;

          if (current.charIndex < current.text.length) {
            // Add next character
            return {
              ...current,
              currentText: current.text.substring(0, current.charIndex + 1),
              charIndex: current.charIndex + 1,
            };
          } else {
            // Typing finished
            clearInterval(typingIntervalRef.current as NodeJS.Timeout);

            // Schedule removal and addition of next snippet
            if (nextSnippetTimeoutRef.current) {
              clearTimeout(nextSnippetTimeoutRef.current);
            }

            nextSnippetTimeoutRef.current = setTimeout(() => {
              // First fade out
              setCodeSnippet((current) =>
                current ? { ...current, opacity: 0 } : null
              );

              // Then remove and add next
              setTimeout(() => {
                setCodeSnippet(null);

                // Move to next snippet in sequence
                setCodeSnippetIndex(
                  (prevIndex) => (prevIndex + 1) % CODE_SNIPPETS.length
                );

                setTimeout(addNewCodeSnippet, 500); // Small delay before next snippet
              }, 1000); // Transition duration for fade out
            }, 4000); // Keep visible for 4 seconds after typing completes

            return { ...current, isTyping: false };
          }
        });
      }, 30); // Slightly faster typing speed
    };

    // Function to add a new code snippet
    const addNewCodeSnippet = () => {
      // Use the current index to get the next snippet in sequence
      const snippetText = CODE_SNIPPETS[codeSnippetIndex];

      // Calculate dimensions for this specific snippet
      const textDimensions = calculateTextDimensions(snippetText);

      // Calculate a centered position with some randomness
      const centerX = dimensions.width / 2 - textDimensions.width / 2; // Center the code box
      const centerY = dimensions.height / 2 - textDimensions.height / 2;

      // Add less randomness to keep it more centered but still dynamic
      const randomOffsetX = (Math.random() - 0.5) * (dimensions.width * 0.2);
      const randomOffsetY = (Math.random() - 0.5) * (dimensions.height * 0.2);

      const x = centerX + randomOffsetX;
      const y = centerY + randomOffsetY;

      // Very slight rotation for better readability
      const rotation = (Math.random() - 0.5) * 3;

      // Match gradient color to the type of content
      let gradientIndex = codeSnippetIndex % COLOR_GRADIENTS.length;

      // Use specific colors for specific content types
      if (snippetText.includes("$ npm") || snippetText.includes("$ git")) {
        gradientIndex = 2; // Terminal commands - purple
      } else if (snippetText.includes("TypeScript")) {
        gradientIndex = 0; // TypeScript - cyan/blue
      } else if (snippetText.includes("Tailwind")) {
        gradientIndex = 1; // Tailwind - green/cyan
      } else if (snippetText.includes("OUR SERVICES")) {
        gradientIndex = 6; // Services - aqua/blue
      }

      const gradientChoice = COLOR_GRADIENTS[gradientIndex];
      const glowColor = gradientChoice[0]; // Use the first color from the gradient

      const id = `code-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      const newSnippet: CodeSnippet = {
        id,
        text: snippetText,
        position: { x, y },
        currentText: "",
        isTyping: true,
        charIndex: 0,
        opacity: 0, // Start with opacity 0 for fade-in
        scale: 1,
        rotation,
        glowColor,
      };

      // Add with initial opacity 0, then animate in
      setCodeSnippet(newSnippet);

      // Fade in
      setTimeout(() => {
        setCodeSnippet((current) =>
          current ? { ...current, opacity: 0.95 } : null
        );

        // Start typing after fade-in
        setTimeout(() => {
          startTypingAnimation(newSnippet);
        }, 300);
      }, 100);
    };

    // Start the code snippet cycle after a delay
    const initialTimeout = setTimeout(() => {
      addNewCodeSnippet();
    }, 1000); // Initial delay of 1 second

    return () => {
      clearTimeout(initialTimeout);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (nextSnippetTimeoutRef.current) {
        clearTimeout(nextSnippetTimeoutRef.current);
      }
    };
  }, [isClient, dimensions, codeSnippetIndex]);

  if (!isClient) return null;

  // Calculate how many cells can fit in the current viewport
  const numCols = Math.ceil(dimensions.width / CELL_SIZE) + 1;
  const numRows = Math.ceil(dimensions.height / CELL_SIZE) + 1;

  // Generate grid lines for the static base grid
  const horizontalLines = Array.from({ length: numRows }, (_, i) => ({
    id: `h${i}`,
    y: i * CELL_SIZE,
    index: i,
  }));

  const verticalLines = Array.from({ length: numCols }, (_, i) => ({
    id: `v${i}`,
    x: i * CELL_SIZE,
    index: i,
  }));

  // Animation variants for random lines
  interface LineVariantCustom {
    gradient: string[];
    duration: number;
    delay: number;
  }

  // Define variants object directly instead of using an interface
  const lineVariants = {
    initial: {
      pathLength: 0,
      opacity: 0.3,
    },
    animate: (custom: LineVariantCustom) => ({
      pathLength: [0, 1, 1],
      opacity: [0.3, 0.8, 0.3],
      stroke: [custom.gradient[0], custom.gradient[1], "#333333"],
      transition: {
        pathLength: {
          duration: custom.duration,
          times: [0, 0.6, 1],
          ease: "easeInOut",
          delay: custom.delay,
        },
        opacity: {
          duration: custom.duration,
          times: [0, 0.6, 1],
          ease: "easeInOut",
          delay: custom.delay,
        },
        stroke: {
          duration: custom.duration,
          times: [0, 0.6, 1],
          ease: "easeInOut",
          delay: custom.delay,
        },
      },
    }),
  };

  // FIXED: Enhanced function to render the code with improved syntax highlighting
  // This version creates actual tspan elements instead of using dangerouslySetInnerHTML
  const renderCode = (code: string): React.ReactNode => {
    if (!code) return null;

    // Special style for terminal output
    const isTerminal = code.startsWith("$") || code.includes("🔧 OUR SERVICES");

    // Process line by line for different styling based on content
    return code.split("\n").map((line, lineIndex) => {
      let segments = [];
      let lastIndex = 0;

      // Terminal command styling
      if (isTerminal) {
        // Command prompts
        if (line.startsWith("$ ")) {
          segments.push({
            text: "$ ",
            fill: "#00ffcc",
            fontWeight: "bold",
            index: 0,
          });
          segments.push({
            text: line.substring(2),
            fill: "#ffffff",
            index: 2,
          });
        }
        // Success messages with checkmark or rocket
        else if (line.match(/^(✓|🚀)\s.+$/)) {
          segments.push({
            text: line,
            fill: "#2ecc71",
            index: 0,
          });
        }
        // Service items with checkmark
        else if (line.match(/^✓\s.+$/)) {
          segments.push({
            text: line,
            fill: "#2ecc71",
            index: 0,
          });
        }
        // Section title
        else if (line.includes("🔧 OUR SERVICES:")) {
          segments.push({
            text: line,
            fill: "#ff66cc",
            fontWeight: "bold",
            index: 0,
          });
        }
        // URLs
        else if (line.includes("http")) {
          const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
          if (urlMatch && urlMatch.index !== undefined) {
            // Text before URL
            if (urlMatch.index > 0) {
              segments.push({
                text: line.substring(0, urlMatch.index),
                fill: "#ffffff",
                index: 0,
              });
            }

            // URL
            segments.push({
              text: urlMatch[0],
              fill: "#3498db",
              index: urlMatch.index,
            });

            // Text after URL
            if (urlMatch.index + urlMatch[0].length < line.length) {
              segments.push({
                text: line.substring(urlMatch.index + urlMatch[0].length),
                fill: "#ffffff",
                index: urlMatch.index + urlMatch[0].length,
              });
            }
          } else {
            segments.push({ text: line, fill: "#ffffff", index: 0 });
          }
        }
        // Default terminal output
        else {
          segments.push({ text: line, fill: "#ffffff", index: 0 });
        }
      }
      // Code syntax highlighting
      else {
        // Process keywords
        // Define interfaces for segment types
        interface TextSegment {
          text: string;
          fill: string;
          fontWeight?: string;
          index: number;
        }

        const processKeywords = (
          text: string,
          startIndex: number
        ): TextSegment[] => {
          const keywordRegex =
            /\b(const|let|var|function|interface|async|await|return|if|else|for|while|try|catch|import|from|export|default|Promise)\b/g;
          let match: RegExpExecArray | null;
          let lastKeywordIndex = 0;
          let keywordSegments: TextSegment[] = [];

          while ((match = keywordRegex.exec(text)) !== null) {
            // Text before keyword
            if (match.index > lastKeywordIndex) {
              keywordSegments.push({
                text: text.substring(lastKeywordIndex, match.index),
                fill: "#ffffff",
                index: startIndex + lastKeywordIndex,
              });
            }

            // Keyword itself
            keywordSegments.push({
              text: match[0],
              fill: "#00ffcc",
              fontWeight: "bold",
              index: startIndex + match.index,
            });

            lastKeywordIndex = match.index + match[0].length;
          }

          // Any remaining text
          if (lastKeywordIndex < text.length) {
            keywordSegments.push({
              text: text.substring(lastKeywordIndex),
              fill: "#ffffff",
              index: startIndex + lastKeywordIndex,
            });
          }

          return keywordSegments.length > 0
            ? keywordSegments
            : [{ text, fill: "#ffffff", index: startIndex }];
        };

        // Process TypeScript types
        const processTypes = (segments: TextSegment[]): TextSegment[] => {
          const newSegments: TextSegment[] = [];

          for (const segment of segments) {
            if (segment.fill === "#00ffcc") {
              // Don't process keywords
              newSegments.push(segment);
              continue;
            }

            const typeRegex =
              /(:)(\s*)(string|number|boolean|any|void|Promise|User|\[\])/g;
            let text = segment.text;
            let lastIndex = 0;
            let match;
            let typeSegments = [];

            while ((match = typeRegex.exec(text)) !== null) {
              // Text before type
              if (match.index > lastIndex) {
                typeSegments.push({
                  text: text.substring(
                    lastIndex,
                    match.index + match[1].length + match[2].length
                  ),
                  fill: "#ffffff",
                  index: segment.index + lastIndex,
                });
              } else {
                typeSegments.push({
                  text: match[1] + match[2],
                  fill: "#ffffff",
                  index: segment.index + match.index,
                });
              }

              // Type itself
              typeSegments.push({
                text: match[3],
                fill: "#ff66cc",
                index:
                  segment.index +
                  match.index +
                  match[1].length +
                  match[2].length,
              });

              lastIndex = match.index + match[0].length;
            }

            // Any remaining text
            if (lastIndex < text.length) {
              typeSegments.push({
                text: text.substring(lastIndex),
                fill: "#ffffff",
                index: segment.index + lastIndex,
              });
            }

            newSegments.push(
              ...(typeSegments.length > 0 ? typeSegments : [segment])
            );
          }

          return newSegments;
        };

        // Process strings
        const processStrings = (segments: TextSegment[]): TextSegment[] => {
          const newSegments: TextSegment[] = [];

          for (const segment of segments) {
            if (segment.fill !== "#ffffff") {
              // Don't process already colored text
              newSegments.push(segment);
              continue;
            }

            const stringRegex = /(["'`])(.*?)(?<!\\)(["'`])/g;
            let text = segment.text;
            let lastIndex = 0;
            let match;
            let stringSegments = [];

            while ((match = stringRegex.exec(text)) !== null) {
              // Text before string
              if (match.index > lastIndex) {
                stringSegments.push({
                  text: text.substring(lastIndex, match.index),
                  fill: "#ffffff",
                  index: segment.index + lastIndex,
                });
              }

              // String itself
              stringSegments.push({
                text: match[0],
                fill: "#ffcc00",
                index: segment.index + match.index,
              });

              lastIndex = match.index + match[0].length;
            }

            // Any remaining text
            if (lastIndex < text.length) {
              stringSegments.push({
                text: text.substring(lastIndex),
                fill: "#ffffff",
                index: segment.index + lastIndex,
              });
            }

            newSegments.push(
              ...(stringSegments.length > 0 ? stringSegments : [segment])
            );
          }

          return newSegments;
        };

        // Process comments
        const processComments = (segments: TextSegment[]): TextSegment[] => {
          const newSegments: TextSegment[] = [];

          for (const segment of segments) {
            if (segment.fill !== "#ffffff") {
              // Don't process already colored text
              newSegments.push(segment);
              continue;
            }

            const commentMatch = segment.text.match(/(\/\/.*$)/);
            if (commentMatch && commentMatch.index !== undefined) {
              // Text before comment
              if (commentMatch.index > 0) {
                newSegments.push({
                  text: segment.text.substring(0, commentMatch.index),
                  fill: "#ffffff",
                  index: segment.index,
                });
              }

              // Comment itself
              newSegments.push({
                text: commentMatch[0],
                fill: "#8899aa",
                index: segment.index + commentMatch.index,
              });
            } else {
              newSegments.push(segment);
            }
          }

          return newSegments;
        };

        // Apply all processors in sequence
        segments = processKeywords(line, 0);
        segments = processTypes(segments);
        segments = processStrings(segments);
        segments = processComments(segments);
      }

      // If no segments were created, use the whole line with default styling
      if (segments.length === 0) {
        segments.push({ text: line, fill: "#ffffff", index: 0 });
      }

      // Create tspan elements for each line with proper styling
      return (
        <tspan
          key={lineIndex}
          x="0"
          dy={lineIndex === 0 ? 0 : 20}
          className="code-line"
        >
          {segments.map((segment, segmentIndex) => (
            <tspan
              key={`${lineIndex}-${segmentIndex}-${segment.index}`}
              fill={segment.fill || "#ffffff"}
              fontWeight={segment.fontWeight || "normal"}
            >
              {segment.text}
            </tspan>
          ))}
        </tspan>
      );
    });
  };

  // Ensure the code stays within the viewport
  const clipToViewport = `0 0 ${dimensions.width} ${dimensions.height}`;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Base static grid - always visible gray grid */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        preserveAspectRatio="none"
        viewBox={clipToViewport}
      >
        {/* Horizontal base lines */}
        {horizontalLines.map((line) => (
          <path
            key={`base-${line.id}`}
            d={`M 0 ${line.y} H ${dimensions.width}`}
            stroke="#333333"
            strokeWidth="0.5"
            strokeOpacity="0.2"
            fill="none"
          />
        ))}

        {/* Vertical base lines */}
        {verticalLines.map((line) => (
          <path
            key={`base-${line.id}`}
            d={`M ${line.x} 0 V ${dimensions.height}`}
            stroke="#333333"
            strokeWidth="0.5"
            strokeOpacity="0.2"
            fill="none"
          />
        ))}
      </svg>

      {/* Animated random lines */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        preserveAspectRatio="none"
        viewBox={clipToViewport}
      >
        {animatingLines.map((line) => (
          <motion.path
            key={line.id}
            d={
              line.isHorizontal
                ? `M 0 ${line.position} H ${dimensions.width}`
                : `M ${line.position} 0 V ${dimensions.height}`
            }
            strokeWidth="1"
            fill="none"
            variants={lineVariants}
            initial="initial"
            animate="animate"
            custom={{
              gradient: line.gradient,
              duration: line.duration,
              delay: line.delay,
            }}
          />
        ))}
      </svg>

      {/* Code typing animation with enhanced futuristic styling */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        preserveAspectRatio="none"
        viewBox={clipToViewport}
      >
        <defs>
          {/* Enhanced glow effect for more futuristic look */}
          <filter
            id="futuristic-glow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="2.5"
              floodColor="#00ccff"
              floodOpacity="0.6"
            />
          </filter>

          {/* Text scanning effect */}
          <linearGradient
            id="scanning-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <animate
              attributeName="y1"
              from="0%"
              to="100%"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              from="20%"
              to="120%"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="45%" stopColor="#00ffff" stopOpacity="0.4" />
            <stop offset="55%" stopColor="#00ffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>

          {/* Stylized background gradient */}
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a192f" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#112240" stopOpacity="0.85" />
          </linearGradient>
          {codeSnippet && (
            <>
              <filter
                id={`glow-${codeSnippet.id}`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="2.5"
                  floodColor={codeSnippet.glowColor}
                  floodOpacity="0.6"
                />
              </filter>

              {/* Clip path for text to prevent overflow */}
              <clipPath id={`text-clip-${codeSnippet.id}`}>
                <rect
                  x="-10"
                  y="-10"
                  width={
                    calculateTextDimensions(codeSnippet.text).textAreaWidth
                  }
                  height={
                    calculateTextDimensions(codeSnippet.text).textAreaHeight
                  }
                />
              </clipPath>
            </>
          )}
        </defs>

        {codeSnippet && (
          <g
            key={codeSnippet.id}
            transform={`translate(${codeSnippet.position.x}, ${codeSnippet.position.y}) rotate(${codeSnippet.rotation}) scale(${codeSnippet.scale})`}
            filter={`url(#glow-${codeSnippet.id})`}
            style={{
              transition: "opacity 1s ease-in-out, transform 0.5s ease-out",
              opacity: codeSnippet.opacity,
            }}
          >
            {/* Calculate dimensions for this specific text */}
            {(() => {
              const textDimensions = calculateTextDimensions(codeSnippet.text);
              return (
                <>
                  {/* Code container background with naval slate color - dynamic sizing */}
                  <rect
                    x="-20"
                    y="-20"
                    width={textDimensions.width}
                    height={textDimensions.height}
                    fill="url(#bg-gradient)"
                    rx="8"
                    ry="8"
                    stroke={codeSnippet.glowColor}
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />

                  {/* Scanning line effect */}
                  <rect
                    x="-20"
                    y="-20"
                    width={textDimensions.width}
                    height={textDimensions.height}
                    fill="url(#scanning-gradient)"
                    rx="8"
                    ry="8"
                    opacity="0.3"
                  />

                  {/* Digital circuit-like decoration - scaled based on container width */}
                  <path
                    d={`M -10 -10 H ${textDimensions.width / 6} V 10 H ${
                      textDimensions.width / 3
                    } V -10 H ${textDimensions.width / 2}`}
                    stroke={codeSnippet.glowColor}
                    strokeWidth="1"
                    fill="none"
                    opacity="0.4"
                  />
                  <path
                    d={`M ${textDimensions.width - 40} -10 H ${
                      textDimensions.width - 90
                    } V 10 H ${textDimensions.width - 150} V -10 H ${
                      textDimensions.width - 200
                    }`}
                    stroke={codeSnippet.glowColor}
                    strokeWidth="1"
                    fill="none"
                    opacity="0.4"
                  />
                </>
              );
            })()}

            {/* Text content with proper clipping to ensure no overflow */}
            <g clipPath={`url(#text-clip-${codeSnippet.id})`}>
              <text
                fontFamily="'Fira Code', 'Courier New', monospace"
                fontSize="14"
                fill="#e0e0ff" // Light blue-white for main text
                style={{
                  whiteSpace: "pre",
                  fontWeight: "500",
                  letterSpacing: "0", // Removed letter spacing to save space
                  filter: "drop-shadow(0 0 1px #ffffff)",
                }}
              >
                {renderCode(codeSnippet.currentText)}
                {codeSnippet.isTyping && (
                  <tspan className="cursor">
                    <animate
                      attributeName="opacity"
                      values="1;0;1"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                    |
                  </tspan>
                )}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default AnimatedGrid;
