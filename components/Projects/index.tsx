"use client";

import { FaLocationArrow } from "react-icons/fa6";

import { projects } from "@/data";
import { PinContainer } from "./Pin";

const RecentProjects = () => {
  return (
    <div className="py-20">
      <a href="#projects" id="projects" />
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map((item) => (
          <div
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center lg:w-[32rem] md:w-[28rem] sm:w-96 w-[80vw] relative group"
            key={item.id}
          >
            {/* Intense blur effect behind the card */}
            <div className="absolute inset-0 bg-black/40 rounded-3xl blur-3xl opacity-50 group-hover:opacity-90 transition-opacity duration-300"></div>

            <PinContainer
              title="/ui.aceternity.com"
              href="https://twitter.com/mannupaaji"
            >
              <div className="relative flex items-center justify-center lg:w-[30rem] md:w-[26rem] sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                <div
                  className="relative w-full h-full overflow-hidden lg:rounded-3xl backdrop-blur-3xl"
                  style={{ backgroundColor: "#13162D" }}
                >
                  <img
                    src="/bg.png"
                    alt="bgimg"
                    className="mix-blend-overlay"
                  />

                  {/* Heavy blur gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple/30 to-transparent backdrop-blur-3xl opacity-80"></div>
                </div>
                <img
                  src={item.img}
                  alt="cover"
                  className="z-10 absolute bottom-0 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {item.title}
              </h1>

              <p
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {item.des}
              </p>

              <div className="flex items-center justify-between mt-7 mb-3">
                <div className="flex items-center">
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center relative group"
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      {/* Small glow effect on icons */}
                      <div className="absolute inset-0 rounded-full bg-purple/50 blur-3xl opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img
                        src={icon}
                        alt={`icon-${index}`}
                        className="p-2 relative z-10"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center group/link">
                  <p className="flex lg:text-xl md:text-xs text-sm text-purple group-hover/link:text-purple/80 transition-colors duration-300">
                    Check Live Site
                  </p>
                  <FaLocationArrow className="ms-3 text-purple group-hover/link:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
