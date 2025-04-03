import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/ThemeProvider";
import { CursorProvider } from "./utils/CursorProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedBubbleCursor from "@/components/ui/BubbleCursor";

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
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
        >
          <CursorProvider>
            {/* Add the bubble cursor */}
            <EnhancedBubbleCursor
              size={80}
              followSpeed={0.2}
              primaryColor="rgba(56,189,248,0.7)"
              secondaryColor="rgba(99,102,241,0.3)"
              glowColor="rgba(56,189,248,0.5)"
              enablePulse={true}
              pulseIntensity={0.05}
              enableRotation={true}
              enableFloat={true}
              opacity={0.9}
              innerGlowOpacity={0.9}
            />
            <Header />
            {children}
            <Footer />
          </CursorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
