import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@funnymath/content/src': path.resolve(__dirname, '../../packages/content/src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  optimizeDeps: {
    exclude: [],
  },
  server: {
    port: 3000,
    open: true,
  },
});
