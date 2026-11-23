// apps/admin/vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    // You can optionally set a fixed port here so it always runs on 5174
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Pointing to your local backend now!
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
