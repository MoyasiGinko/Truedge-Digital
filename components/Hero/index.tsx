"use client";
import { FaLocationArrow } from "react-icons/fa6";
import { motion } from "framer-motion";
import MagicButton from "@/components/ui/MagicButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import HeroGlobe from "@/components/Hero/HeroClientGlobe";

const Hero = () => {
  return (
    <div className="relative w-full px-5 sm:px-10 flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 blur-3xl backdrop-blur-3xl bg-gradient-to-t from-black/5 via-indigo-950 to-purple-950 opacity-50" />

      {/* Hero content - Left side */}
      <div className="relative z-18  flex flex-col justify-center w-full max-w-7xl min-h-screen mx-auto">
        <div className="w-full z-20 md:w-1/2 mt-20 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[89vw] sm:max-w-3xl"
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
              className="text-[30px] md:text-[32px] lg:text-[40px] font-extrabold"
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
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] mr-0 ">
            <HeroGlobe />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
