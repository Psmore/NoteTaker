import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // React plugin for SWC
import vitePluginSitemap from 'vite-plugin-sitemap'; // Sitemap plugin
import { resolve, dirname } from 'path'; // Import 'resolve' and 'dirname' from 'path'
import { fileURLToPath } from 'url'; // For converting import.meta.url to a path

// Resolve the directory path of the current file (vite.config.js)
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    vitePluginSitemap({
      hostname: 'http://localhost:3000/',
      dynamicRoutes: [
        '/login',  // Example dynamic routes
        '/signup',
        '/',
      ],
    }),
  ],
  build: {
    outDir: 'dist', // Output directory
    assetsDir: 'assets', // Directory for assets
    chunkSizeWarningLimit: 1000, // Set chunk size limit for warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor libraries into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor'; // Bundle all third-party libraries into a 'vendor' chunk
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Path alias for the 'src' directory
    },
  },
  server: {
    port: 3000, // Port for the development server
    open: true, // Open the browser automatically
  },
});
