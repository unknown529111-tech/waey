// Edge function: Admin authentication for وعي platform
// POST { password }          -> { token }   (login)
// POST { token, verify:true } -> { valid }   (verify)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TOKEN_EXPIRY_MS = 4 * 60 * 60 * 1000; // 4 hours

// HMAC-SHA256 using Web Crypto API (Deno-compatible)
async function hmacSign(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

async function generateToken(secret: string): Promise<string> {
  const exp = Date.now() + TOKEN_EXPIRY_MS;
  const payload = JSON.stringify({ exp });
  const sig = await hmacSign(secret, payload);
  return btoa(JSON.stringify({ exp, sig }));
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(atob(token));
    const { exp, sig } = parsed;
    if (typeof exp !== "number" || typeof sig !== "string") return false;
    if (Date.now() > exp) return false;
    const payload = JSON.stringify({ exp });
    const expected = await hmacSign(secret, payload);
    return sig === expected;
  } catch {
    return false;
  }
}

// Rate limiting
const rateMap = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || entry.reset < now) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (!checkRate(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    const TOKEN_SECRET = Deno.env.get("ADMIN_TOKEN_SECRET") || "waey-default-secret-change-me";

    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD not configured");
      return new Response(
        JSON.stringify({ error: "Admin auth not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify mode
    if (body.verify && typeof body.token === "string") {
      const valid = await verifyToken(body.token, TOKEN_SECRET);
      return new Response(JSON.stringify({ valid }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Login mode
    if (typeof body.password === "string") {
      if (body.password !== ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: "كلمة المرور غير صحيحة" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const token = await generateToken(TOKEN_SECRET);
      return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Missing password or token" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-auth error:", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
