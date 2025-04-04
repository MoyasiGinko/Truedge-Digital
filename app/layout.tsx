import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ThemeProvider } from "./utils/ThemeProvider";
import { CursorProvider } from "./utils/CursorProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FluidAdaptiveCursor from "@/components/ui/BubbleCursor";

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
        <CursorProvider>
          {/* Add the bubble cursor */}
          <FluidAdaptiveCursor />
          <Header />
          {children}
          <Footer />
        </CursorProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
