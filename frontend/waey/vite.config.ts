import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // 127.0.0.1 only. `host: "::"` binds every interface, which the box's
    // standing rules forbid for a service on this machine. Playwright's baseURL
    // uses 127.0.0.1 for the same reason: `localhost` can resolve to ::1,
    // which nothing is listening on.
    host: "127.0.0.1",
    // 8080 is the contract: CI starts `npm run dev` with no port flag and the
    // Playwright baseURL points here. Pass --port to move it.
    port: 8080,
    // No hardcoded `hmr` block. Pinning the HMR socket to a fixed port made
    // the client dial a port the server was not on, so the page hard-reloaded
    // every few seconds and any browser assertion lost its context. Leaving
    // the HMR port to Vite ties it to the server's own port, whatever that is.
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('@radix-ui') || id.includes('@tanstack/react-query')) return 'vendor-radix-query';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('lucide-react') || id.includes('zod') || id.includes('clsx') || id.includes('tailwind-merge')) return 'vendor-ui';
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify') || id.includes('canvg')) return 'vendor-pdf';
            if (id.includes('xlsx')) return 'vendor-xlsx';
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
