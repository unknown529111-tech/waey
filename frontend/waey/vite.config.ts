import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      host: "localhost",
      port: 8080,
      protocol: "ws",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('@radix-ui') || id.includes('@tanstack/react-query')) return 'vendor-radix-query';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('lucide-react') || id.includes('embla-carousel-react') || id.includes('date-fns') || id.includes('zod') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority') || id.includes('react-hook-form') || id.includes('@hookform/resolvers')) return 'vendor-ui';
            return 'vendor';
          }
          const pagesMatch = id.match(/src[/\\]pages[/\\]([^/\\]+)\.tsx$/);
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
