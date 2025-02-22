import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Optional: Set a custom port
  },
  base: "/", // Ensure correct routing
});
