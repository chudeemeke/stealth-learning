import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === 'production' ? '/stealth-learning/' : '/';

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],

        // Comprehensive PWA configuration for production
        injectRegister: 'auto',
        filename: 'sw.js',
        manifestFilename: 'manifest.json',
        strategies: 'generateSW',

        // Development options
        devOptions: {
          enabled: false // Disable in dev to avoid conflicts
        },

        // Manifest configuration
        manifest: {
          name: 'Stealth Learning Games',
          short_name: 'LearnPlay',
          description: 'Educational games for children aged 3-9',
          theme_color: '#4A90E2',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'any',
          scope: base,
          start_url: base,
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png'
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },

        // Workbox configuration
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          navigateFallback: mode === 'production' ? '/stealth-learning/index.html' : '/index.html',
          navigateFallbackDenylist: [/^\/(api|__)/, /\/[^/?]+\.[^/]+$/],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,

          // Runtime caching strategies
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\./,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 5 * 60 // 5 minutes
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                }
              }
            },
            {
              urlPattern: /\.(?:js|css)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
              }
            },
            {
              urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'font-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
                }
              }
            }
          ]
        }
      })
    ],

    // Path resolution
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@features': path.resolve(__dirname, './src/features'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@services': path.resolve(__dirname, './src/services'),
        '@store': path.resolve(__dirname, './src/store')
      }
    },

    // Development server configuration
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      strictPort: false
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development', // Only sourcemaps in development for security
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'es2015',
      chunkSizeWarningLimit: 1000,

      // Rollup options for code splitting
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
            'ui-vendor': ['framer-motion', 'clsx'],
            'game-vendor': ['howler', 'canvas-confetti'],
            'crypto-vendor': ['crypto-js']
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const extType = info[info.length - 1];
            if (/\.(png|jpe?g|svg|gif|webp|ico)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js'
        }
      },

      // Terser options for production
      terserOptions: mode === 'production' ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        mangle: {
          safari10: true
        }
      } : undefined
    },

    // Environment variable configuration
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.BASE_URL': JSON.stringify(base)
    },

    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@reduxjs/toolkit',
        'framer-motion',
        'crypto-js'
      ],
      exclude: ['@vite/client', '@vite/env']
    }
  };
});