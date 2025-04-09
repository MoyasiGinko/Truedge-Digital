"use client";
import { FaLocationArrow } from "react-icons/fa6";
import { motion } from "framer-motion";
import MagicButton from "@/components/ui/MagicButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import HeroGlobe from "@/components/Hero/HeroClientGlobe";

const Hero = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Spotlights for background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 bg-transparent dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]">
        {/* Radial gradient mask */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-transparent [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* Hero content - Left side */}
      <div className="relative z-18  flex flex-col justify-center w-full min-h-screen px-6 md:px-12 lg:px-20">
        <div className="w-full z-20 md:w-1/2 mt-20 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[89vw] md:max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-2"
            >
              <img src="/logo.svg" alt="Logo" className="w-44 h-22" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="uppercase tracking-widest text-xs text-blue-100 max-w-80 mb-2"
            >
              Crafting Excellence with Modern Tech
            </motion.p>

            {/* Enhanced TextGenerateEffect with word-by-word hover effects */}
            <TextGenerateEffect
              words="Transforming Concepts into Seamless User Experiences"
              className="text-[30px] md:text-4xl lg:text-5xl font-extrabold"
              hoverEffects={true}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="md:tracking-wider mt-6 mb-8 text-sm md:text-lg lg:text-xl text-gray-300"
            >
              Elevating your online presence with cutting-edge web solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3, duration: 0.5, type: "spring" }}
            >
              <a href="#about">
                <MagicButton
                  title="Get in touch"
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </a>
            </motion.div>
          </motion.div>
        </div>
        {/* Globe - Positioned in background */}
        <div className="absolute z-19 top-0 right-0 w-full md:w-1/2 h-full flex items-center justify-end pointer-events-none">
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] mr-0 md:mr-8">
            <HeroGlobe />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
