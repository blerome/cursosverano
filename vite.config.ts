import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'api',
        replacement: path.resolve(__dirname, 'src/api'),
      },
      {
        find: 'core',
        replacement: path.resolve(__dirname, 'src/core'),
      },
      {
        find: 'features',
        replacement: path.resolve(__dirname, 'src/features'),
      },
      {
        find: 'generated',
        replacement: path.resolve(__dirname, 'src/generated'),
      },
      {
        find: 'static',
        replacement: path.resolve(__dirname, 'src/static'),
      },
    ],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    open: true,
  },
  assetsInclude: ['**/*.xlsx', '**/*.pdf', '**/*.md'],
  optimizeDeps: {
    exclude: ['js-big-decimal'],
  },
});