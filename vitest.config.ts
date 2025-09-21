import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        'src/services/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        'src/store/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/test/**',
        '**/*.config.{ts,js}',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/assets/**',
        'src/types/**',
        '**/*.d.ts',
        'e2e/**',
        'playwright/**',
        'coverage/**',
        'storybook-static/**',
        '.storybook/**',
      ],
    },
  },
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
      '@store': path.resolve(__dirname, './src/store'),
    },
  },
});