import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
      },
      colors: {
        wedding: {
          alabaster: "#FBF9F6",
          oatmeal: "#F0EBE1",
          charcoal: "#2A2726",
          warmGrey: "#7A7571",
          taupe: "#D4C4B7",
          gold: "#D4A574",
          goldHover: "#C29260",
        },
      },
    },
  },
  plugins: [],
});

export default config;
