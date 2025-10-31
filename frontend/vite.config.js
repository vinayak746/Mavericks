import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Ensure common public assets are included in the generated precache.
      // This helps make images/logo/manifest available offline when previewing.
      includeAssets: [
        "logo-no-bg.png",
        "robots.txt",
        "icons/*.png",
        "logo.png",
        "manifest.json",
        "assets/*",
      ],
      manifest: {
        name: "Mavericks",
        short_name: "Mavericks",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // Ensure the service worker takes control as soon as possible and
        // provides a navigation fallback to the app shell.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        // Runtime caching rules to serve images and API responses while offline.
        runtimeCaching: [
          {
            // Cache built static assets (images) served from the app origin
            urlPattern: /\/assets\/.*\.(?:png|jpg|jpeg|svg|webp|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "assets-images",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache API responses from the backend so product lists can be available offline
            // Adjust origin/port if your backend runs elsewhere.
            urlPattern: /^https?:\/\/localhost:8080\/api\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
