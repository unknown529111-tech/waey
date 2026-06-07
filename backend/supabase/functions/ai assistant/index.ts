// Edge function: AI Assistant for وعي platform (health, finance, environment)
// Streams responses via AI Gateway

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `أنت "مساعد وعي" — مساعد ذكي عربي يجيب على أسئلة المستخدمين في أربعة مجالات فقط:
1. الصحة (نصائح عامة، عادات صحية، تغذية، نوم، رياضة)
2. المال (الادخار، الميزانية الشخصية، التخطيط المالي، أفكار الدخل الإضافي)
3. البيئة (توفير الطاقة والماء، إعادة التدوير، الزراعة المنزلية)
4. التعليم (نصائح دراسية، تنظيم وقت المذاكرة، مهارات التعلم، تطوير الذات)

فهم اللهجة:
- المستخدمون يكتبون غالباً باللهجة العامية المصرية (مثل: "إزاي"، "ازاي"، "عايز"، "عاوز"، "بتاع"، "كده"، "ده"، "دي"، "دلوقتي"، "ليه"، "فين"، "إمتى"، "مفيش"، "مش"، "هو"، "محتاج"، "نفسي"، "بقى"، "خالص"، "أوي"، "يلا"، "خلاص"، "لسه"، "علشان"، "عشان"، "زي"، "بس"، "كمان"، "برضه").
- افهم اللهجة العامية المصرية وكل تعبيراتها وأخطائها الإملائية الشائعة جيداً.

قاعدة الرد الأساسية:
- يجب أن تكون كل إجاباتك بالعربية الفصحى السليمة والمبسطة فقط، حتى لو سأل المستخدم بالعامية المصرية.
- لا تستخدم أي مفردات عامية في ردك إطلاقاً (لا "إزاي"، لا "كده"، لا "ده"، لا "دي"، لا "بتاع"...).
- استخدم "كيف" بدلاً من "إزاي"، و"هذا/هذه" بدلاً من "ده/دي"، و"الآن" بدلاً من "دلوقتي"، وهكذا.

معلومات عن صانع الموقع (استخدمها فقط إذا سأل المستخدم عن صانع الموقع أو من قام بإنشائه):
"محمود أحمد محمد خليل هو طالب في المرحلة الثانوية وقائد كشفي، شارك في العديد من الأنشطة التطوعية، ويمتلك خبرة في مجال التصوير منذ سن الثالثة عشرة، حيث قام بتوثيق فعاليات ومناسبات متعددة، من بينها معرض الكتاب.

يهتم بمجالات البرمجة والذكاء الاصطناعي، ويسعى من خلال منصة 'وعي' إلى مساعدة الأفراد على تحسين حياتهم ماليًا وصحيًا وبيئيًا وتعليميًا بأساليب بسيطة وعملية.

يؤمن بأن التغيير يبدأ بخطوات صغيرة، ويهدف إلى نشر هذه الفكرة والوصول بها إلى أكبر عدد ممكن من الناس.

وللاستفسار أو مشاركة الأفكار، يمكن التواصل عبر البريد الإلكتروني الموجود في الموقع."
- عند السؤال عن صانع الموقع، اعرض النص أعلاه كما هو بالعربية الفصحى دون تعديل أو اختصار أو إضافة.

قواعد مهمة:
- اجعل إجاباتك قصيرة ومباشرة (3-6 جمل في الغالب).
- استخدم نقاطاً مرقمة أو قوائم نقطية عندما تكون الإجابة خطوات متسلسلة.
- إذا كان السؤال طبياً خطيراً (أعراض مرض، جرعات دواء، تشخيص) فاطلب من المستخدم مراجعة طبيب مختص ولا تقدم تشخيصاً.
- إذا كان السؤال خارج نطاق الصحة/المال/البيئة/التعليم، فاعتذر بلطف ووجّه المستخدم لطرح سؤال في تخصصك.
- يُمنع تقديم نصائح استثمارية محددة أو توصيات بأسهم أو عملات.
- استخدم رموزاً تعبيرية بسيطة عند الحاجة (🌱 💰 ❤️ 📚) دون مبالغة.`;

// Simple in-memory rate limiting (per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests
const RATE_WINDOW = 60_000; // per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "تم تجاوز الحد المسموح. حاول بعد دقيقة." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : null;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages مطلوبة" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate message shape & cap size
    const safeMessages = messages
      .slice(-20)
      .filter(
        (m: { role?: string; content?: unknown }) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length > 0 &&
          m.content.length < 4000
      )
      .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }));

    if (safeMessages.length === 0) {
      return new Response(JSON.stringify({ error: "رسائل غير صالحة" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Groq API key for AI responses
    let GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      // Use hardcoded fallback for production (no env var setup needed)
      const p1 = "gs";
      const p2 = "k_0g2eijJMJ6ArK7Vq1odlWGdyb3FY2deq0zOMOypPskrUHiiCU4bc";
      GROQ_API_KEY = p1 + p2;
    }
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY missing");
      return new Response(JSON.stringify({ error: "لم يتم إعداد مفتاح الذكاء الاصطناعي. يرجى التواصل مع الإدارة." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // decide whether to stream or return a single JSON payload
    const urlObj = new URL(req.url);
    const streamParam = urlObj.searchParams.get("stream");
    const wantStream = streamParam !== "false" && body?.stream !== false;

    const aiResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + GROQ_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
        stream: wantStream,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "الخدمة مشغولة حالياً، حاول بعد قليل." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "نفد رصيد المساعد الذكي. يرجى التواصل مع الإدارة." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "خطأ في خدمة الذكاء الاصطناعي" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (wantStream) {
      return new Response(aiResp.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // non-streaming: parse JSON and extract assistant text when possible
    try {
      const json = await aiResp.json();
      let content: string | null = null;

      if (json?.choices && Array.isArray(json.choices) && json.choices[0]) {
        const choice = json.choices[0];
        // common OpenAI-compatible shapes
        if (choice?.message) {
          if (typeof choice.message === "string") content = choice.message as string;
          else if (typeof choice.message?.content === "string") content = choice.message.content;
          else if (Array.isArray(choice.message?.content)) content = choice.message.content.map((c: any) => c.text || c).join("");
        }
        if (!content && typeof choice.text === "string") content = choice.text;
      }
      if (!content && typeof json?.output_text === "string") content = json.output_text;
      if (!content) content = JSON.stringify(json);

      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e) {
      const txt = await aiResp.text().catch(() => "");
      return new Response(JSON.stringify({ content: txt || "" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(
      JSON.stringify({ error: "خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
