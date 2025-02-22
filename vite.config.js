
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
<<<<<<< Updated upstream
  tailwindcss(),
=======
  tailwindcss()
>>>>>>> Stashed changes
    ],
  server: {
    port: 3001, // Optional: Set a custom port
  },
  base: "/", // Ensure correct routing
});

