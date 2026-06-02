import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react';
            if (id.includes('node_modules/framer-motion')) return 'vendor-framer';
            if (id.includes('node_modules/@tanstack')) return 'vendor-tanstack';
            if (id.includes('node_modules/recharts')) return 'vendor-recharts';
            if (id.includes('node_modules/lucide-react')) return 'vendor-lucide';
            return 'vendor';
          }
          const pagesMatch = id.match(/src\/pages\/([^\/]+)\.tsx$/);
          if (pagesMatch) return `page-${pagesMatch[1]}`;
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
