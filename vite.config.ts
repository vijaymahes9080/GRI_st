import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: '/',
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
    global: 'globalThis'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /.*\/academics\/calendar.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'academic-calendar-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /.*\/contact.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'contact-directory-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'GRI Digital Univ',
        short_name: 'GRI Univ',
        description: 'The Gandhigram Rural Institute (Deemed to be University)',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      'expo-secure-store': path.resolve(__dirname, './src/core/storage/mock-secure-store.ts'),
      'react-native-mmkv': path.resolve(__dirname, './src/core/storage/mock-mmkv.ts'),
      'react-native': 'react-native-web',
      'lucide-react-native': 'lucide-react',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: false,
  },
});
