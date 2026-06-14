import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "GTM Intelligence Swarm",
  description: "AI-powered GTM Swarm: buyer personas, intent scouting, adjacent markets, and outreach sequences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[#0A0A0A] text-[#0A0A0A] antialiased selection:bg-[#FCD116] selection:text-[#0A0A0A] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

