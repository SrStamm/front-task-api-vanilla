import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Versión más simple que definitivamente funciona
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
