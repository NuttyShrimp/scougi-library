import type { Config } from "tailwindcss";
import daisyui from "daisyui"
import tw_typography from "@tailwindcss/typography"

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [tw_typography, daisyui],
  daisyui: {
    themes: ["light"]
  }
};

export default config;
