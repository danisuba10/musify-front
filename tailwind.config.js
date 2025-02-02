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
    },
  },
  plugins: [scrollbarHide],
};
