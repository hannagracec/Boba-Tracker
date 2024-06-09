import { Rubik, Rubik_Mono_One } from "next/font/google";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "off-white": "#FEFCEB",
        "coral-pink": "#FF908F",
        "pastel-pink": "#FFCBCB",
        "medium-pink": "#FFA1AB",
        "deep-coral": "#F56776",
        "pink-pink": "#FFC4C3",
        "white-ish": "#FFFEF5",
        "black-ish": "#222222",
        "light-black": "#333333",
        "slight-grey": "#EEEDE9",
      },
      boxShadow: {
        b: "0 7px 0 0 #222222",
      },
      transitionProperty: {
        "box-shadow": "box-shadow",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["active", "focus"],
    },
  },
  plugins: [],
};
export default config;
