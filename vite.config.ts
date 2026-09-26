import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler')) return 'react-vendor';
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('@radix-ui') || id.includes('next-themes')) return 'ui-vendor';
            if (id.includes('react-force-graph') || id.includes('@xyflow') || id.includes('recharts')) return 'graph-vendor';
            if (id.includes('react-markdown') || id.includes('react-syntax-highlighter') || id.includes('remark') || id.includes('rehype')) return 'markdown-vendor';
            if (id.includes('zustand') || id.includes('axios') || id.includes('@tanstack')) return 'state-vendor';
            if (id.includes('i18next') || id.includes('react-i18next')) return 'i18n-vendor';
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: { hmr: { overlay: false } },
  cacheDir: 'node_modules/.vite',
  logLevel: 'warn',
  clearScreen: false,
});