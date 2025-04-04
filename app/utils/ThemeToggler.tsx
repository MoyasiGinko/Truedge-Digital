"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect } from "react";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  // useEffect(() => {
  //   if (theme === "dark") {
  //     setTheme("light");
  //   } else setTheme("light");
  // }, [setTheme, theme]);

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-gray-2 dark:bg-dark-bg relative mr-1.5 flex cursor-pointer items-center justify-center rounded-full text-black dark:text-white lg:static"
    >
      <Image
        src="/images/icons/icon-moon.svg"
        alt="logo"
        width={21}
        height={21}
        className="dark:hidden"
      />

      <Image
        src="/images/icons/icon-sun.svg"
        alt="logo"
        width={22}
        height={22}
        className="hidden dark:block"
      />
    </button>
  );
};

export default ThemeToggler;
