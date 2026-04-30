import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: colors.zinc[950],
        foreground: colors.zinc[50],
        primary: {
          DEFAULT: colors.orange[600],
          foreground: colors.zinc[50],
          hover: colors.orange[500],
        },
        card: {
          DEFAULT: colors.zinc[900],
          foreground: colors.zinc[100],
          border: colors.zinc[800],
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
