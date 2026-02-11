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
          light: "#F0F7FF", // Soft Pastel Blue
          accent: "#A5D7FF", // Bolder Pastel Blue
          ink: "#1E293B",   // Deep Slate for text
          paper: "#FFFFFF",
          // Dark Mode Palette
          darkBg: "#0F172A",
          darkCard: "#1E293B",
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;