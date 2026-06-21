import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server proxies /api → the Express backend on :4000,
// so the frontend can just fetch("/api/...") with no CORS headaches.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000"
    }
  }
});
