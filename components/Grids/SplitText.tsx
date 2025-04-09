"use client";

import React, { useRef, useEffect } from "react";

// A custom SplitText component that splits text into characters, words, or lines
export const SplitText = ({
  children,
  type = "chars", // chars, words, lines, or any combination like "chars, words"
  className = "",
  childClassName = "",
  as: Tag = "div",
  onSplit = null, // callback function that returns split elements
}) => {
  const textRef = useRef(null);
  const splitTypesArray = type.split(",").map((t) => t.trim());

  useEffect(() => {
    const splitText = () => {
      if (!textRef.current) return;

      // Clear previous content first
      while (textRef.current.firstChild) {
        textRef.current.removeChild(textRef.current.firstChild);
      }

      const text = children;
      const types = {};

      // Create containers for each type
      splitTypesArray.forEach((type) => {
        types[type] = [];
      });

      // Split by words and chars
      if (
        splitTypesArray.includes("words") ||
        splitTypesArray.includes("chars")
      ) {
        const words = text.split(" ");

        words.forEach((word, wordIndex) => {
          const wordWrapper = document.createElement("span");
          wordWrapper.classList.add("word");
          wordWrapper.classList.add(childClassName);
          wordWrapper.dataset.wordIndex = wordIndex;

          if (splitTypesArray.includes("chars")) {
            const chars = word.split("");

            chars.forEach((char, charIndex) => {
              const charWrapper = document.createElement("span");
              charWrapper.classList.add("char");
              charWrapper.classList.add(childClassName);
              charWrapper.dataset.charIndex = charIndex;
              charWrapper.dataset.wordIndex = wordIndex;
              charWrapper.textContent = char;

              if (splitTypesArray.includes("chars")) {
                types.chars.push(charWrapper);
              }

              wordWrapper.appendChild(charWrapper);
            });
          } else {
            wordWrapper.textContent = word;
          }

          if (splitTypesArray.includes("words")) {
            types.words.push(wordWrapper);
          }

          textRef.current.appendChild(wordWrapper);

          // Add space between words except for the last word
          if (wordIndex < words.length - 1) {
            const space = document.createElement("span");
            space.innerHTML = " ";
            space.classList.add("space");
            textRef.current.appendChild(space);
          }
        });
      }

      // Split by lines (requires rendering first to detect line breaks)
      if (splitTypesArray.includes("lines")) {
        const lineElements = [];
        let currentLine = 0;
        let previousTop = -1;

        // Get all word elements
        const wordElements = textRef.current.querySelectorAll(".word");

        wordElements.forEach((wordElement) => {
          const top = wordElement.offsetTop;

          if (previousTop !== -1 && top !== previousTop) {
            currentLine++;
          }

          if (!lineElements[currentLine]) {
            lineElements[currentLine] = [];
          }

          lineElements[currentLine].push(wordElement);
          previousTop = top;
          wordElement.dataset.lineIndex = currentLine;
        });

        // Create line wrappers
        lineElements.forEach((words, lineIndex) => {
          const lineWrapper = document.createElement("div");
          lineWrapper.classList.add("line");
          lineWrapper.classList.add(childClassName);
          lineWrapper.dataset.lineIndex = lineIndex;

          types.lines.push(lineWrapper);
        });
      }

      // Call callback with split elements if provided
      if (onSplit) {
        onSplit(types);
      }

      return types;
    };

    const split = splitText();

    // Cleanup function
    return () => {
      if (textRef.current) {
        textRef.current.textContent = children;
      }
    };
  }, [children, type, childClassName, onSplit]);

  return (
    <Tag ref={textRef} className={className}>
      {children}
    </Tag>
  );
};

// Helper hook to use with GSAP
export const useSplitText = (ref, options = {}) => {
  const [splitTextElements, setSplitTextElements] = React.useState(null);

  useEffect(() => {
    if (!ref.current) return;

    const node = ref.current;
    const text = node.textContent;
    const { type = "chars, words" } = options;

    // Clear existing content
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    // Split the text
    const chars = [];
    const words = [];
    const lines = [];
    const wordsArray = text.split(" ");

    wordsArray.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("split-word");
      wordSpan.style.display = "inline-block";
      words.push(wordSpan);

      // Split into characters
      if (type.includes("chars")) {
        const wordChars = word.split("");
        wordChars.forEach((char, charIndex) => {
          const charSpan = document.createElement("span");
          charSpan.classList.add("split-char");
          charSpan.style.display = "inline-block";
          charSpan.textContent = char;
          chars.push(charSpan);
          wordSpan.appendChild(charSpan);
        });
      } else {
        wordSpan.textContent = word;
      }

      node.appendChild(wordSpan);

      // Add space after word (except last word)
      if (wordIndex < wordsArray.length - 1) {
        const space = document.createElement("span");
        space.innerHTML = " ";
        node.appendChild(space);
      }
    });

    // Detect lines
    if (type.includes("lines")) {
      let currentLine = 0;
      let previousTop = -1;

      // Group words by lines
      words.forEach((word) => {
        const rect = word.getBoundingClientRect();
        if (previousTop !== -1 && rect.top !== previousTop) {
          currentLine++;
        }

        if (!lines[currentLine]) {
          lines[currentLine] = document.createElement("div");
          lines[currentLine].classList.add("split-line");
        }

        previousTop = rect.top;
      });
    }

    setSplitTextElements({ chars, words, lines });

    // Cleanup
    return () => {
      node.textContent = text;
    };
  }, [ref, options]);

  return splitTextElements;
};

export default SplitText;
