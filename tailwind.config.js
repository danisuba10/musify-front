import scrollbarHide from "tailwind-scrollbar-hide";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./src/**/*.{css}",
    "./index.html",
  ],
  theme: {
    extend: {
      minHeight: {
        250: "250px",
      },
      colors: {
        menuGrey: "rgb(40,36,36)",
        svgGrey: "#b1b1b1",
        displayBlack: "#201c1c",
      },
      screens: {
        sm: "600px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [scrollbarHide],
};
