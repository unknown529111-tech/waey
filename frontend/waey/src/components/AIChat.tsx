import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Trash2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { sanitizeString } from "@/lib/sanitize";
import { useLanguage } from "@/contexts/useLanguage";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "waey_ai_chat";
const DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const AI_PROXY = import.meta.env.VITE_AI_PROXY_URL;

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const NVIDIA_KEY = import.meta.env.VITE_NVIDIA_API_KEY;
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODEL = "meta/llama-3.1-70b-instruct";

const SYSTEM_PROMPT_AR = `أنت "مساعد وعي الذكي" (Waey AI) — المساعد التفاعلي الرسمي لمنصة "وعي".
مهمتك الأساسية هي تقديم إجابات دقيقة، عملية، وملهمة للمستخدمين باللغة العربية في أربعة أركان أساسية للحياة:

1. 🌿 الصحة: (العادات الصحية اليومية، شرب المياه، التغذية المتوازنة، تحسين جودة النوم، التمارين الرياضية، والصحة النفسية والاسترخاء).
2. 💰 المال: (إدارة الميزانية الشخصية، حيل التوفير والادخار، التخطيط المالي الذكي، أفكار لزيادة الدخل والتصرف المالي الحكيم).
3. 🌱 البيئة: (ترشيد استهلاك الكهرباء والماء، إعادة التدوير المنزلي، استبدال البلاستيك، الزراعة المنزلية، والحفاظ على الطبيعة).
4. 📚 التعليم: (مهارات الاستذكار، تنظيم وقت الدراسة، تقنيات التركيز مثل البومودورو، التطوير الذاتي، وبناء الشغف التعلمي).

قواعد وأخلاقيات العمل:
- افهم اللهجة المصرية والعامية العربية بشكل ممتاز، واكتب إجاباتك دائماً بلغة عربية فصحى سلسة، واضحة، ومبسطة.
- صغ الإجابة في نقاط مرقمة أو منظمة (3 إلى 6 جمل)، واجعل أسلوبك مشجعاً وإيجابياً.
- استخدم الرموز التعبيرية المناسبة لزيادة وضوح النص (🌱 💰 ❤️ 📚 💡 💧).
- إذا كان السؤال خارج التخصصات الأربعة (مثل البرمجة المعقدة، السيارات، السياسة، الرياضة التنافسية...)، اعتذر بلطف ووجه المستخدم لأسئلة الصحة والمال والبيئة والتعليم.
- في حالة الاستشارات الطبية أو التشخيصات والجرعات الأدوية، اطلب فوراً مراجعة طبيب أو مختص ولا تقدم تشخيصاً طبياً نائباً.

معلومات مؤسس وصانع المنصة (استخدمها فقط عند السؤال عن صانع الموقع):
"محمود أحمد محمد خليل — طالب في المرحلة الثانوية وقائد كشفي، مهتم بالبرمجة والذكاء الاصطناعي ومؤسس منصة وعي لنشر التوازن والوعي بين الأفراد بأساليب بسيطة وعملية."`;

const SYSTEM_PROMPT_EN = `You are "Waey Assistant" — an intelligent assistant that answers users' questions in only four areas:
1. Health (general tips, healthy habits, nutrition, sleep, exercise)
2. Finance (saving, personal budget, financial planning, extra income ideas)
3. Environment (energy & water conservation, recycling, home gardening)
4. Education (study tips, time management, learning skills, self-development)

Important rules:
- Keep your answers short and direct (3-6 sentences).
- Use numbered lists or bullet points when needed.
- If the question is a serious medical concern, advise consulting a specialist.
- DO NOT answer any question outside the four areas — strictly forbidden to answer about programming, technology, cars, politics, sports, or any other topic. Only health, finance, environment, education.
- Use simple emojis sparingly (🌱 💰 ❤️ 📚).
- Respond in simple, clear English.

- If the user asks about the site's creator or owner, answer literally as follows:
Mahmoud Ahmed Mohamed Khalil, a high school student interested in programming and artificial intelligence, founder of the Waey platform to spread awareness in health, finance, environment, and education.`;

import { getStreak, getDailyValue } from "@/lib/dailyStorage";

function getUserPersonalizedContext(): string {
  try {
    const s = getStreak();
    const water = getDailyValue("water");
    const parts: string[] = [];
    if (s.count > 0) parts.push(`سلسلة الوعي الحالية: ${s.count} يوم/أيام`);
    if (water > 0) parts.push(`مجموع شرب المياه اليوم: ${water} كوب/أكواب`);
    if (parts.length === 0) return "";
    return `\n\nمعلومات عن إنجازات المستخدم الحالية في المنصة (استخدمها لتشجيعه وتخصيص الإجابة عند المناسبة): [${parts.join("، ")}]`;
  } catch {
    return "";
  }
}

const MAX_TOKENS = 1000;
const RENDER_INTERVAL_MS = 16;

async function tryOpenRouter(history: Msg[], signal: AbortSignal, sp: string): Promise<Response | null> {
  if (!OPENROUTER_KEY) return null;
  try {
    return await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "HTTP-Referer": "https://waey-m7.com",
        "X-Title": "Waey",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "system", content: sp }, ...history.map((m) => ({ role: m.role, content: m.content }))],
        stream: true,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
      }),
      signal,
    });
  } catch { return null; }
}

async function tryProxy(history: Msg[], signal: AbortSignal, sp: string): Promise<string | null> {
  if (!AI_PROXY) return null;
  try {
    const resp = await fetch(`${AI_PROXY}?stream=false`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: sp, messages: history.map((m) => ({ role: m.role, content: m.content })) }),
      signal,
    });
    if (!resp.ok) return null;
    const j = await resp.json().catch(() => null);
    if (!j) return null;
    return (j.content || j.text || j.answer || j.output || (j.choices && j.choices[0] && (j.choices[0].message?.content || j.choices[0].text)) || null) as string | null;
  } catch { return null; }
}

async function tryGroq(history: Msg[], signal: AbortSignal, sp: string): Promise<Response | null> {
  if (!GROQ_KEY) return null;
  try {
    return await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "system", content: sp }, ...history.map((m) => ({ role: m.role, content: m.content }))],
        stream: true,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
      }),
      signal,
    });
  } catch { return null; }
}

async function tryDeepSeek(history: Msg[], signal: AbortSignal, sp: string): Promise<Response | null> {
  if (!DEEPSEEK_KEY) return null;
  try {
    return await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: sp }, ...history.map((m) => ({ role: m.role, content: m.content }))],
        stream: true,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
      }),
      signal,
    });
  } catch { return null; }
}

async function tryNvidia(history: Msg[], signal: AbortSignal, sp: string): Promise<Response | null> {
  if (!NVIDIA_KEY) return null;
  try {
    return await fetch(NVIDIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_KEY}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [{ role: "system", content: sp }, ...history.map((m) => ({ role: m.role, content: m.content }))],
        stream: true,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
      }),
      signal,
    });
  } catch { return null; }
}

function generateSmartOfflineResponse(text: string, lang: string): string {
  const lower = text.toLowerCase();
  if (lang === 'ar') {
    if (lower.includes('ماء') || lower.includes('شرب') || lower.includes('كوب')) return "💧 لشرب الماء فوائد رائعة! حاول شرب 8 أكواب يومياً، وابدأ بكوب مع كل وجبة. يمكنك تتبع شربك للماء في صفحة الصحة.";
    if (lower.includes('نوم') || lower.includes('أرق')) return "😴 لتحسين النوم: حدد موعد نوم ثابت، ابتعد عن الشاشات قبل النوم بساعة، واجعل غرفتك مظلمة وهادئة. النوم الجيد يعزز تركيزك وصحتك.";
    if (lower.includes('رياض') || lower.includes('تمرين') || lower.includes('مش')) return "🏃 المشي 30 دقيقة يومياً يحسن المزاج والصحة. يمكنك تقسيمها إلى 3 فترات مشي سريع لمدة 10 دقائق. ابدأ بخطوات صغيرة!";
    return "🌿 وعي هو منصة للتوازن في أربعة مجالات: الصحة 💚، المال 💰، البيئة 🌱، والتعليم 📚. اطرح سؤالك في أي من هذه المجالات وسأجيبك بكل سرور!";
  }
  if (lower.includes('water') || lower.includes('drink')) return "💧 Aim for 8 cups of water daily! Try starting with a glass with each meal. Track your water intake on the Health page.";
  if (lower.includes('sleep') || lower.includes('insomnia')) return "😴 For better sleep: set a fixed bedtime, avoid screens 1 hour before bed, keep your room dark and quiet.";
  if (lower.includes('exercise') || lower.includes('walk') || lower.includes('workout')) return "🏃 Walking 30 minutes daily boosts mood and health! Split it into 3 brisk 10-minute walks.";
  return "🌿 Waey is a holistic-awareness platform covering: Health 💚, Finance 💰, Environment 🌱, and Education 📚. Ask me anything in these areas!";
}

function parseOpenaiSSE(line: string): string | null {
  if (!line.startsWith("data: ")) return null;
  const jsonStr = line.slice(6).trim();
  if (jsonStr === "[DONE]") return null;
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.choices?.[0]?.delta?.content ?? null;
  } catch { return null; }
}

async function streamResponse(resp: Response, onToken: (t: string) => void, signal: AbortSignal): Promise<void> {
  if (!resp.body) return;
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  signal.addEventListener("abort", () => reader.cancel(), { once: true });
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx).replace(/\r$/, "");
        buffer = buffer.slice(idx + 1);
        if (!line.trim()) continue;
        const token = parseOpenaiSSE(line);
        if (token) onToken(token);
      }
    }
  } catch (err) { console.error("Stream read error:", err); }
}

const AIChat = () => {
  const { t, lang } = useLanguage();
  const SUGGESTIONS = [t('chat.suggestion1'), t('chat.suggestion2'), t('chat.suggestion3'), t('chat.suggestion4')];
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<"groq" | "nvidia" | "deepseek" | "proxy" | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))); } catch { /* ignore */ }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Cursor blink effect while loading
  useEffect(() => {
    if (!isLoading) { setCursorVisible(false); return; }
    const id = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(id);
  }, [isLoading]);

  const systemPrompt = (lang === 'ar' ? SYSTEM_PROMPT_AR : SYSTEM_PROMPT_EN) + getUserPersonalizedContext();

  const send = async (text: string) => {
    const trimmed = sanitizeString(text, 2000);
    if (!trimmed || isLoading) return;
    if (trimmed.length > 2000) { toast.error(t('chat.tooLong')); return; }

    const userMsg: Msg = { role: "user", content: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setIsLoading(true);
    setProvider(null);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => { controller.abort(); toast.error(t('chat.timeout')); }, 30_000);

    let assistantSoFar = "";
    let renderTimer: ReturnType<typeof setInterval> | null = null;

    const startRenderLoop = () => {
      if (renderTimer) return;
      renderTimer = setInterval(() => {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      }, RENDER_INTERVAL_MS);
    };

    const stopRenderLoop = () => {
      if (renderTimer) {
        clearInterval(renderTimer);
        renderTimer = null;
      }
    };

    let usedProvider: "groq" | "nvidia" | "deepseek" | null = null;
    const sp = systemPrompt;

    try {
      // 1) Groq (primary — using user VITE_GROQ_API_KEY)
      let resp: Response | null = await tryGroq(nextHistory, controller.signal, sp);
      if (resp && resp.ok) { usedProvider = "groq"; }

      // 2) NVIDIA (fallback)
      if (!resp || !resp.ok) {
        if (resp && !resp.ok) { const body = await resp.text().catch(() => ""); console.warn("Groq failed:", resp.status, body.slice(0, 200)); }
        resp = await tryNvidia(nextHistory, controller.signal, sp);
        if (resp && resp.ok) usedProvider = "nvidia";
      }

      // 3) DeepSeek (last resort)
      if (!resp || !resp.ok) {
        if (resp && !resp.ok) { const body = await resp.text().catch(() => ""); console.warn("NVIDIA failed:", resp.status, body.slice(0, 200)); }
        resp = await tryDeepSeek(nextHistory, controller.signal, sp);
        if (resp && resp.ok) usedProvider = "deepseek";
      }

      // 4) Proxy (fallback)
      if (!resp || !resp.ok) {
        const proxyText = await tryProxy(nextHistory, controller.signal, sp);
        if (proxyText) { setProvider("proxy"); setMessages((prev) => [...prev, { role: "assistant", content: proxyText }]); clearTimeout(timeoutId); setIsLoading(false); return; }
      }

      if (!resp || !resp.ok) {
        clearTimeout(timeoutId);
        const fallbackText = generateSmartOfflineResponse(trimmed, lang);
        setMessages((prev) => [...prev, { role: "assistant", content: fallbackText }]);
        return;
      }

      setProvider(usedProvider);
      startRenderLoop();
      await streamResponse(resp, (token) => { assistantSoFar += token; }, controller.signal);
    } catch (e) {
      if ((e as Error).name !== "AbortError") { console.error(e); toast.error(t('chat.connectionError')); setMessages(nextHistory); }
    } finally {
      clearTimeout(timeoutId);
      stopRenderLoop();
      // Final flush to ensure complete message is saved
      if (assistantSoFar) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      } else { setMessages(nextHistory); toast.error(t('chat.noResponse')); }
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const clearChat = () => { setMessages([]); try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } };

  const providerLabel = () => {
    switch (provider) {
      case "groq": return "Groq";
      case "nvidia": return "NVIDIA";
      case "deepseek": return "DeepSeek";
      case "proxy": return t('chat.proxy');
      default: return t('chat.scope');
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8">
      <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">{t('chat.title')}</h2>
              <p className="text-xs text-muted-foreground">
                <AnimatePresence mode="wait">
                  <motion.span key={lang} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.15, ease: "easeOut" }}>
                    {providerLabel()}
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-secondary" aria-label={t('chat.clear')}>
              <Trash2 className="size-4" />
            </button>
          )}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <button onClick={() => abortRef.current?.abort()} className="text-destructive hover:text-destructive/80 transition-colors p-2 rounded-full hover:bg-destructive/10" aria-label="إيقاف التوليد">
              <X className="size-4" />
            </button>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-5 py-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-6">
              <div className="inline-flex size-16 rounded-full bg-primary/10 items-center justify-center">
                <Sparkles className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t('chat.greeting')}</h3>
                <p className="text-muted-foreground text-sm max-w-[40ch] mx-auto leading-relaxed">{t('chat.greetingText')}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 max-w-[480px] mx-auto">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="text-right text-sm p-3 rounded-2xl border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all">{s}</button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2 prose-strong:text-foreground flex items-start gap-1">
                      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{sanitizeString(m.content || "", 5000)}</ReactMarkdown>
                      {isLoading && i === messages.length - 1 && cursorVisible && <span className="text-primary animate-pulse">|</span>}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-end">
              <div className="bg-secondary rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <AnimatePresence mode="wait">
                  <motion.span key={lang} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.15, ease: "easeOut" }}>
                    {t('chat.typing')}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-border p-3 md:p-4 bg-background">
          <div className="flex items-end gap-2">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} placeholder={t('chat.placeholder')} rows={1} maxLength={2000} disabled={isLoading}
              className="flex-1 resize-none bg-secondary/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-32 disabled:opacity-50" style={{ minHeight: "48px" }} />
            <button type="submit" disabled={isLoading || !input.trim()} className="size-12 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all" aria-label={t('chat.send')}>
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5 -scale-x-100" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">{t('chat.disclaimer')}</p>
        </form>
      </div>
    </div>
  );
};

export default AIChat;