import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: false, // Ensure it exports named components
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
