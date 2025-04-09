import React from "react";

type HeadingProps = {
  text?: string; // Non-highlighted text
  highlightedText?: string; // Highlighted text
  className?: string;
};

const Heading: React.FC<HeadingProps> = ({
  text = "A small selection of",
  highlightedText = "recent projects",
  className = "",
}) => {
  return (
    <h1
      className={`heading text-center text-3xl lg:text-5xl font-bold ${className}`}
    >
      {text} <span className="text-purple-400/80">{highlightedText}</span>
    </h1>
  );
};

export default Heading;
