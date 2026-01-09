import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", {}]],
      },
    }),
  ],
  build: {
    sourcemap: false, // Desactiva source maps en producción
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Elimina console.log en producción
        drop_debugger: true, // Elimina debugger
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"], // Elimina console y debugger
  },
});
