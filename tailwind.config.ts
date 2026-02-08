import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // These connect to the variables we set in layout.tsx
        sans: ["var(--font-quicksand)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      // This adds a custom "warm" color palette
      colors: {
        cozy: {
          cream: "#FDF8F5",
          sage: "#94A684",
          brown: "#483434",
          paper: "#F2E3DB",
          accent: "#E2C799",
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;