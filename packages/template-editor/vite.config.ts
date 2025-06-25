import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'tailwindcss'],
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]',
        globals: {
          react: 'React',
          'react-dom': 'React-dom',
          'react/jsx-runtime': 'react/jsx-runtime',
          tailwindcss: 'tailwindcss',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
