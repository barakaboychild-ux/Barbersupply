import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:'#06162C',   // Midnight Navy,
        sky:'#0EA5E9',    // Electric Blue,
        ice:'#E0F2F1',    // Frost Blue,
      },
    },
  },
  plugins: [],
};
export default config;