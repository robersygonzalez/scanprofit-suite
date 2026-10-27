import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/content/index.ts'),
      name: 'ScanProfitContentScript',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
  },
});
