import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyWebhook } from "https://esm.sh/@clerk/clerk-sdk-node@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
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
    const webhookSecret = Deno.env.get("CLERK_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET not set");
      return new Response(JSON.stringify({ error: "Server config error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");
    const payload = await req.text();

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response(JSON.stringify({ error: "Missing Svix headers" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let event;
    try {
      event = verifyWebhook(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }, webhookSecret);
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { type, data } = event;

    switch (type) {
      case "user.created":
      case "user.updated": {
        const user = data;
        const primaryEmail = user.email_addresses.find((e: any) => e.id === user.primary_email_address_id)?.email_address;
        if (!primaryEmail) break;

        const { error } = await supabase
          .from("profiles")
          .upsert({
            email: primaryEmail,
            name: user.full_name || user.username || primaryEmail.split("@")[0],
            clerk_user_id: user.id,
            updated_at: new Date().toISOString(),
          }, { onConflict: "email" });

        if (error) console.error("Upsert profile error:", error);
        break;
      }

      case "user.deleted": {
        const user = data;
        const primaryEmail = user.email_addresses.find((e: any) => e.id === user.primary_email_address_id)?.email_address;
        if (!primaryEmail) break;

        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("email", primaryEmail);

        if (error) console.error("Delete profile error:", error);
        break;
      }

      case "session.created":
      case "session.ended": {
        // Optional: track active sessions in a separate table
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});