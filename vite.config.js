import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import sitemapPlugin from "vite-plugin-sitemap";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemapPlugin({
      hostname: "https://sea.uofk.com",
      dynamicRoutes: ["/about", "/events", "/posts"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 2. Add the @ alias pointing to /src
    },
  },
  // server: {
  //   proxy: {
  //     // Any request starting with /api will be forwarded to your backend
  //     '/api': {
  //       target: 'https://cd80.duckdns.org',
  //       changeOrigin: true,
  //       secure: false, // If the backend SSL is self-signed or has issues
  //     },
  //   },
  // },
});
