import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "./utils/CursorProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FluidAdaptiveCursor from "@/components/ui/BubbleCursor";
import PageGridBackground from "@/components/ui/AnimatedGridBackground";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import CustomCursor from "./utils/CustomCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Truedge Digital",
  description: "Modern & Minimal Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
        > */}
        {/* <CursorProvider> */}
        {/* Add the animated grid background */}
        {/* <PageGridBackground opacity={0.2} /> */}
        <AnimatedGrid />
        <CustomCursor
          color="#6d28d9" // Purple color
          size={50} // Larger size
          buttonFillColor="rgba(109, 40, 217, 0.4)" // Semi-transparent purple
          enableRipple={true} // Enable the global ripple effect
        />
        {/* Add the bubble cursor */}
        {/* <FluidAdaptiveCursor /> */}
        <Header />
        <div className="relative z-1">{children}</div>
        <Footer />
        {/* </CursorProvider> */}
      </body>
    </html>
  );
}
