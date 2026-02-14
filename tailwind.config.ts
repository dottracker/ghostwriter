import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // This is crucial for dark mode support
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-quicksand)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        study: {
          light: "#F0F7FF", 
          accent: "#3B82F6", // Brighter blue for better contrast
          ink: "#1E293B",   
          // High-Contrast Dark Mode
          darkBg: "#0F172A",   // Deep midnight blue
          darkCard: "#1E293B", // Slightly lighter slate for cards
          darkText: "#F8FAFC", // Almost white for maximum readability
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;