import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend port
    proxy: {
      "/api": {
        target: "http://localhost:3001", // ✅ Correct backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
