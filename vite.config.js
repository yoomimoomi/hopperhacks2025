import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173, // Ensure it's set correctly
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Ensure `@` maps to `src/`
    },
  },
});
