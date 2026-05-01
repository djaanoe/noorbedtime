import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0F1B2D",
        "navy-light": "#162035",
        "navy-lighter": "#1C2A45",
        gold: "#D4A853",
        "gold-light": "#E8C97A",
        cream: "#FFF8EC",
        teal: "#2A9D8F",
        rose: "#C97B7B",
        lavender: "#B8A9C9",
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2.5s ease-in-out infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(212,168,83,.3)" },
          "50%": { boxShadow: "0 0 25px rgba(212,168,83,.5)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
