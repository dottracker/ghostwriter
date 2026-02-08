import { Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "The Cozy Scribe",
  description: "Freshly baked insights for a rainy day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${quicksand.variable} font-sans bg-[#FDF8F5] text-[#483434] selection:bg-[#E2C799]`}
      >
        {/* Subtle texture overlay for that paper/cottage feel */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
        
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
