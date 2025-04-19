"use client";
import { useState, ReactNode } from "react";
import Button from "../utils/Button";
import RippleButton from "../utils/RippleButton";

export default function Home() {
  const [activeColor, setActiveColor] = useState("#3b82f6"); // Default blue
  const [count, setCount] = useState(0);

  const colors = {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    green: "#10b981",
    pink: "#ec4899",
    amber: "#f59e0b",
  };

  const handleColorChange = (color: string) => {
    setActiveColor(color);
  };

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-8">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-60 backdrop-blur-md rounded-xl shadow-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Custom Cursor Demo
        </h1>

        <p className="mb-6 text-gray-300 text-center">
          The custom cursor follows your mouse and morphs into buttons when
          hovering them. The default cursor remains visible throughout.
        </p>

        <Button>Click Me</Button>

        <div className="mb-8 p-4 bg-gray-700 bg-opacity-40 rounded-lg text-center">
          <p className="text-xl text-gray-200">
            Count:{" "}
            <span className="text-2xl font-bold" style={{ color: activeColor }}>
              {count}
            </span>
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-300 mb-3 text-center">
            Cursor Color
          </h2>
          <div className="flex justify-center gap-4">
            {Object.entries(colors).map(([name, value]) => (
              <button
                key={name}
                className="w-10 h-10 rounded-full shadow-lg cursor-btn"
                style={{
                  backgroundColor: value,
                  transform: activeColor === value ? "scale(1.15)" : "scale(1)",
                  boxShadow:
                    activeColor === value
                      ? `0 0 15px ${value}`
                      : "0 0 5px rgba(0,0,0,0.3)",
                }}
                onClick={() => handleColorChange(value)}
                aria-label={`${name} color`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex justify-center">
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium cursor-btn"
              onClick={handleIncrement}
              style={{
                backgroundImage: `linear-gradient(to right, ${activeColor}, ${activeColor}dd)`,
              }}
            >
              Increment Counter
            </button>
          </div>

          <div className="flex justify-center">
            <button
              className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg font-medium cursor-btn"
              onClick={handleIncrement}
            >
              Secondary Button
            </button>
          </div>

          <div className="flex justify-center">
            <button
              className="px-6 py-3 bg-transparent border-2 text-gray-200 rounded-lg font-medium cursor-btn"
              onClick={handleIncrement}
              style={{
                borderColor: activeColor,
                color: `${activeColor}ee`,
              }}
            >
              Outline Button
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              className="p-3 bg-gray-700 bg-opacity-50 rounded-lg text-gray-300 hover:bg-gray-600 cursor-btn"
              onClick={handleIncrement}
            >
              Button 1
            </button>

            <button
              className="p-3 bg-gray-700 bg-opacity-50 rounded-lg text-gray-300 hover:bg-gray-600 cursor-btn"
              onClick={handleIncrement}
            >
              Button 2
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Try hovering over buttons to see the morphing effect</p>
          <p>
            The custom cursor disappears while the default cursor remains
            visible
          </p>
        </div>
      </div>
    </div>
  );
}
