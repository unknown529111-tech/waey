# Waey — Repo Layout

This repository was reorganized to separate frontend, backend, and database artifacts for clarity.

- `frontend/waey/` — Vite + React app (source, scripts, build)
- `backend/supabase/` — Supabase functions and config
- `database/supabase-migration/` — Database migration files

Quick commands (from repo root):

```bash
cd "frontend/waey"
npm install
npm run dev -- --host      # start dev server (accessible on LAN)
npm run build             # production build
npm run test              # run unit tests with Vitest
```

Notes:
- The dev server binds to all interfaces; use the machine LAN IP (e.g. `http://192.168.1.4:8080`) to open from other devices.
- I added a simple Vite `manualChunks` config to improve chunking. Rebuild to check bundle sizes.
- If you want a public shareable URL, I can start a tunnel using `localtunnel`.
