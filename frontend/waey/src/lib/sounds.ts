// Study sounds are served from the public Supabase Storage bucket to keep
// the git repository lean (the full 25MB MP3s are no longer tracked).
// Falls back to the local /sounds/ path when Supabase is not configured
// (local dev without the env vars).
const SOUNDS_BASE = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/sounds`
  : "/sounds";

export const soundSrc = (file: string): string => `${SOUNDS_BASE}/${file}`;