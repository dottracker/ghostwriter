// tailwind.config.ts
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
        sans: ["var(--font-quicksand)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        cozy: {
          cream: "#FDF8F5",
          sage: "#94A684",
          brown: "#483434",
          paper: "#F2E3DB",
          accent: "#E2C799",
        }
        
      },
      // THIS PART ADDS EXTRA SPACING
      typography: {
        DEFAULT: {
          css: {
            p: {
              marginTop: '1.5em',    // Adds more space above paragraphs
              marginBottom: '1.5em', // Adds more space below paragraphs
              lineHeight: '1.8',     // Makes the text feel more airy
            },
            h2: {
              marginTop: '2em',
              marginBottom: '1em',
              color: '#483434',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;