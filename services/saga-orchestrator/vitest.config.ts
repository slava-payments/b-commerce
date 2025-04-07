import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
});
