"use client";
import { useState } from "react";
import { Button } from "../utils/Button";
import { Link } from "../utils/Link";
import { Card } from "../utils/Card";
import { useCursorInteraction } from "../utils/useCursorInteraction";
import { motion } from "framer-motion";

export default function Home() {
  // Specify the element types for each cursor hook
  const h1CursorProps = useCursorInteraction<HTMLHeadingElement>({
    blendMode: "normal",
  });
  const pCursorProps = useCursorInteraction<HTMLParagraphElement>({
    blendMode: "normal",
  });
  const h2CursorProps = useCursorInteraction<HTMLHeadingElement>({
    blendMode: "normal",
  });
  const divCursorProps = useCursorInteraction<HTMLDivElement>({
    blendMode: "difference",
    fillElement: true,
  });

  // Add some state for interactive demos
  const [activeTab, setActiveTab] = useState(1);
  const [hovered, setHovered] = useState(false);

  // For the tab buttons, don't use the cursor props directly
  // Define an interface for the mouse event
  interface TabMouseEvent {
    currentTarget: HTMLButtonElement;
  }

  const handleTabMouseEnter = (e: TabMouseEvent): void => {
    document.documentElement.style.setProperty(
      "--cursor-blend-mode",
      "difference"
    );
    e.currentTarget.style.background = "rgba(56,189,248,0.2)";
  };

  const handleTabMouseLeave = (e: TabMouseEvent): void => {
    document.documentElement.style.setProperty("--cursor-blend-mode", "normal");
    e.currentTarget.style.removeProperty("background");
  };

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen">
      <section className="max-w-4xl mx-auto mb-16">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          ref={h1CursorProps.ref}
          onMouseEnter={h1CursorProps.onMouseEnter}
          onMouseLeave={h1CursorProps.onMouseLeave}
        >
          Custom Cursor Experience
        </motion.h1>

        <motion.p
          className="text-xl mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          ref={pCursorProps.ref}
          onMouseEnter={pCursorProps.onMouseEnter}
          onMouseLeave={pCursorProps.onMouseLeave}
        >
          Move your cursor around to see the glassy bubble effect following it.
          Notice how it reacts differently when hovering over interactive
          elements.
        </motion.p>

        {/* Buttons have their own cursor handling built into the Button component */}
        <motion.div
          className="flex flex-wrap gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button variant="primary" size="lg">
            Primary Button
          </Button>
          <Button variant="secondary" size="lg">
            Secondary Button
          </Button>
          <Button variant="outline" size="lg">
            Outline Button
          </Button>
        </motion.div>

        {/* Links have their own cursor handling built into the Link component */}
        <motion.div
          className="flex flex-wrap gap-8 mb-12 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="#">Underlined Link</Link>
          <Link href="#" underline={false}>
            Plain Link
          </Link>
          <Link href="https://nextjs.org" external>
            External Link
          </Link>
        </motion.div>
      </section>

      {/* Interactive tabs section */}
      <section className="max-w-4xl mx-auto mb-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Cursor Interaction with Tabs
        </h2>

        <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
          {[1, 2, 3].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium text-lg transition-all ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab(tab)}
              onMouseEnter={handleTabMouseEnter}
              onMouseLeave={handleTabMouseLeave}
            >
              Tab {tab}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === 1 && (
            <div className="space-y-4">
              <p>
                This is the content for Tab 1. Notice how the cursor changes
                when hovering over text.
              </p>
              <p>
                Each interactive element has a different cursor interaction
                applied to it.
              </p>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              <p>
                This is the content for Tab 2. The custom cursor follows your
                mouse with a slight delay.
              </p>
              <p>
                When you click, it creates a subtle ripple effect from the
                cursor position.
              </p>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-4">
              <p>
                This is the content for Tab 3. The cursor bubble effect changes
                size based on the context.
              </p>
              <p>
                Try hovering over different types of elements to see how it
                reacts.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive cards grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card interactive>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Interactive Card</h3>
              <p>
                This card has the cursor interaction effect. Hover to see how
                the bubble fills the card.
              </p>
              <div className="mt-4">
                <Button variant="primary" size="sm">
                  Card Button
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card interactive>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Hover Effects</h3>
              <p>
                The cursor changes when interacting with different elements on
                the card.
              </p>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm">
                  Details
                </Button>
                <Button variant="secondary" size="sm">
                  View
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Regular Card</h3>
              <p>
                This card doesn't have the cursor interaction effect applied to
                the entire card.
              </p>
              <div className="mt-4">
                <Link href="#">Card Link</Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Circular hover demo */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2
          className="text-2xl font-bold mb-6 text-center"
          ref={h2CursorProps.ref}
          onMouseEnter={h2CursorProps.onMouseEnter}
          onMouseLeave={h2CursorProps.onMouseLeave}
        >
          Cursor Hover Demo
        </h2>

        <div className="flex justify-center">
          <motion.div
            className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-none"
            animate={{
              scale: hovered ? 1.1 : 1,
              boxShadow: hovered
                ? "0 0 30px rgba(59, 130, 246, 0.6)"
                : "0 0 0px rgba(59, 130, 246, 0.3)",
            }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            ref={divCursorProps.ref}
            onMouseMove={divCursorProps.onMouseEnter}
          >
            <p className="text-white font-medium text-center">
              Hover over me
              <br />
              to see the cursor change
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="max-w-2xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-4">
            Try Different Interactions
          </h2>
          <p className="mb-6">
            This glassy bubble cursor creates a modern, immersive experience.
            Try clicking and hovering over different elements to see all
            effects.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg">Large Button</Button>
            <Button variant="outline" size="lg">
              Try Me
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Cursor indicator */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/80 backdrop-blur-sm p-2 rounded-md">
        Custom cursor active
      </div>
    </main>
  );
}
