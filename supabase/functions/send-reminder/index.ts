import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RATE_LIMIT_KEY = "waey_reminder_sent";

function wasSentToday(email: string): boolean {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const key = `${RATE_LIMIT_KEY}_${email}_${today}`;
    const raw = localStorage.getItem(key);
    return raw === "true";
  } catch {
    return false;
  }
}

function markSentToday(email: string) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const key = `${RATE_LIMIT_KEY}_${email}_${today}`;
    localStorage.setItem(key, "true");
  } catch { /* ignore */ }
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

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("email, name, streak_count, last_streak_date")
      .not("email", "is", null);

    if (error) {
      console.error("Failed to fetch profiles:", error.message);
      return new Response(
        JSON.stringify({ error: "Database error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const results = { total: 0, sent: 0, skipped: 0, errors: 0 };

    for (const profile of (profiles || [])) {
      results.total++;

      if (wasSentToday(profile.email)) {
        results.skipped++;
        continue;
      }

      const lastActive = profile.last_streak_date || "";
      const alreadyCheckedInToday = lastActive === today;
      if (alreadyCheckedInToday) {
        results.skipped++;
        continue;
      }

      const name = profile.name || profile.email.split("@")[0];
      const streakCount = profile.streak_count || 0;

      const subject = streakCount > 0
        ? `وعي — سلسلتك ${streakCount} يوم! لا تفوتها 🔥`
        : "وعي — ابدأ يومك بوعي 🌿";

      const html = `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #FDFCF8; border-radius: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #5D7052; font-size: 24px; margin: 0;">وعي</h1>
            <p style="color: #78786C; font-size: 14px; margin: 4px 0 0;">منصة التوازن الشامل</p>
          </div>

          <div style="background: #FEFEFA; border: 1px solid #DED8CF; border-radius: 32px; padding: 24px;">
            <p style="font-size: 16px; color: #2C2C24; margin: 0 0 16px;">
              مرحباً ${name} 👋
            </p>
            ${streakCount > 0 ? `
            <p style="font-size: 14px; color: #2C2C24; line-height: 1.9; margin: 0 0 12px;">
              سلسلتك الحالية <strong style="color: #C18C5D;">${streakCount} يوم</strong> — حافظ عليها وسجل حضورك النهارده!
            </p>
            ` : `
            <p style="font-size: 14px; color: #2C2C24; line-height: 1.9; margin: 0 0 12px;">
              ابدأ يومك مع وعي — سجّل حضورك، تابع عاداتك، وابنِ سلسلة نجاحك يوم ورا يوم.
            </p>
            `}
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://waey-m7.com/dashboard"
                 style="display: inline-block; background: #5D7052; color: #F3F4F1; text-decoration: none;
                        font-size: 14px; font-weight: bold; padding: 12px 32px; border-radius: 9999px;">
                سجّل حضورك الآن 🔥
              </a>
            </div>
            <p style="font-size: 12px; color: #78786C; line-height: 1.8; margin: 0; text-align: center;">
              تضغط مرة واحدة في اليوم عشان تحافظ على سلسلتك وتكسب نقاط وأوسمة.
            </p>
          </div>

          <div style="text-align: center; margin-top: 16px;">
            <p style="font-size: 11px; color: #A8A89C;">
              إذا ما عاوز تستقبل التذكير اليومي، غير الإعدادات من لوحة التحكم.
              <br>© ${new Date().getFullYear()} Waey — وعي
            </p>
          </div>
        </div>
      `;

      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Waey <onboarding@resend.dev>",
            to: [profile.email],
            subject,
            html,
          }),
        });

        if (resendRes.ok) {
          markSentToday(profile.email);
          results.sent++;
        } else {
          const errText = await resendRes.text();
          console.error(`Failed to send to ${profile.email}:`, resendRes.status, errText);
          results.errors++;
        }
      } catch (err) {
        console.error(`Error sending to ${profile.email}:`, err);
        results.errors++;
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-reminder error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
