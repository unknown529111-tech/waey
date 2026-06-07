import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { sanitizeString } from "@/lib/sanitize";
import { useLanguage } from "@/contexts/LanguageContext";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "waey_ai_chat";
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || "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";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const AI_PROXY = import.meta.env.VITE_AI_PROXY_URL;

const SYSTEM_PROMPT_AR = `أنت "مساعد وعي" — مساعد ذكي عربي يجيب على أسئلة المستخدمين في أربعة مجالات فقط:
1. الصحة (نصائح عامة، عادات صحية، تغذية، نوم، رياضة)
2. المال (الادخار، الميزانية الشخصية، التخطيط المالي، أفكار الدخل الإضافي)
3. البيئة (توفير الطاقة والماء، إعادة التدوير، الزراعة المنزلية)
4. التعليم (نصائح دراسية، تنظيم وقت المذاكرة، مهارات التعلم، تطوير الذات)

قواعد مهمة:
- اجعل إجاباتك قصيرة ومباشرة (3-6 جمل).
- استخدم نقاطاً مرقمة أو قوائم نقطية عند الحاجة.
- إذا كان السؤال طبياً خطيراً فاطلب مراجعة طبيب مختص.
- إذا كان السؤال خارج نطاق الصحة/المال/البيئة/التعليم، فاعتذر بلطف.
- استخدم رموزاً تعبيرية بسيطة (🌱 💰 ❤️ 📚) دون مبالغة.
- الردود بالعربية الفصحى المبسطة.

- إذا سأل المستخدم عن صانع الموقع أو مالكه، أجب حرفياً بما يلي:
صانع الموقع هو محمود احمد محمد خليل طالب في الصف الاول الثانوي و مهتم بالبرمجه و الذكاء الاصطناعي و التطوع , متطوع مع برنامج انا متطوع في قسم الميديا و قائد في مجموعه مركز تنمية شبابية الكشفية و الارشادية و متطوع مع مؤسسه اخلاق مصريه في قسم التصوير و مبرمج و مصمم في منصه متلقي الكشافة العربية , و هدف محمود من هذا الموقع هو نشر الوعي بين كل الناس`;

const SYSTEM_PROMPT_EN = `You are "Waey Assistant" — an intelligent assistant that answers users' questions in only four areas:
1. Health (general tips, healthy habits, nutrition, sleep, exercise)
2. Finance (saving, personal budget, financial planning, extra income ideas)
3. Environment (energy & water conservation, recycling, home gardening)
4. Education (study tips, time management, learning skills, self-development)

Important rules:
- Keep your answers short and direct (3-6 sentences).
- Use numbered lists or bullet points when needed.
- If the question is a serious medical concern, advise consulting a specialist.
- If the question is outside health/finance/environment/education, politely decline.
- Use simple emojis sparingly (🌱 💰 ❤️ 📚).
- Respond in simple, clear English.

- If the user asks about the site's creator or owner, answer literally as follows:
The site creator is Mahmoud Ahmed Mohamed Khalil, a first-year high school student interested in programming, artificial intelligence, and volunteering. He volunteers with the "Ana Motawe" program in the media department, is a leader in a scouting and guiding youth center group, volunteers with "Akhlaq Masreya" foundation in the photography department, and is a programmer and designer for the Arab Scouts platform (Motaqi). Mahmoud's goal from this site is to spread awareness among all people.`;

const BATCH_INTERVAL_MS = 80;

async function tryGroq(history: Msg[], signal: AbortSignal, systemPrompt: string): Promise<Response | null> {
  if (!GROQ_KEY) return null;
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];
  try {
    return await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal,
    });
  } catch {
    return null;
  }
}

async function tryProxy(history: Msg[], signal: AbortSignal, systemPrompt: string): Promise<string | null> {
  if (!AI_PROXY) return null;
  try {
    const resp = await fetch(`${AI_PROXY}?stream=false`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: systemPrompt,
        messages: history.map((m) => ({ role: m.role, content: m.content }))
      }),
      signal,
    });
    if (!resp.ok) return null;
    const j = await resp.json().catch(() => null);
    if (!j) return null;
    return (j.content || j.text || j.answer || j.output || (j.choices && j.choices[0] && (j.choices[0].message?.content || j.choices[0].text)) || null) as string | null;
  } catch (e) {
    return null;
  }
}

async function tryDeepSeek(history: Msg[], signal: AbortSignal, systemPrompt: string): Promise<Response | null> {
  if (!DEEPSEEK_KEY) return null;
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];
  try {
    return await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal,
    });
  } catch {
    return null;
  }
}

function parseOpenaiSSE(line: string): string | null {
  if (!line.startsWith("data: ")) return null;
  const jsonStr = line.slice(6).trim();
  if (jsonStr === "[DONE]") return null;
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.choices?.[0]?.delta?.content ?? null;
  } catch {
    return null;
  }
}

async function streamResponse(
  resp: Response,
  onToken: (token: string) => void,
  signal: AbortSignal,
): Promise<void> {
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

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIndex).replace(/\r$/, "");
        buffer = buffer.slice(newlineIndex + 1);
        if (!line.trim()) continue;
        const token = parseOpenaiSSE(line);
        if (token) onToken(token);
      }
    }
  } catch (err) {
    console.error("Stream read error:", err);
  }
}

const AIChat = () => {
  const { t, lang } = useLanguage();
  const SUGGESTIONS = [
    t('chat.suggestion1'),
    t('chat.suggestion2'),
    t('chat.suggestion3'),
    t('chat.suggestion4'),
  ];
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<"groq" | "deepseek" | "proxy" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch { /* ignore */ }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const systemPrompt = lang === 'ar' ? SYSTEM_PROMPT_AR : SYSTEM_PROMPT_EN;

  const send = async (text: string) => {
    const trimmed = sanitizeString(text, 2000);
    if (!trimmed || isLoading) return;
    if (trimmed.length > 2000) {
      toast.error(t('chat.tooLong'));
      return;
    }

    const userMsg: Msg = { role: "user", content: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setIsLoading(true);
    setProvider(null);

    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
      toast.error(t('chat.timeout'));
    }, 30_000);

    let assistantSoFar = "";
    let flushTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleFlush = () => {
      if (flushTimer) return;
      flushTimer = setTimeout(() => {
        flushTimer = null;
        const content = assistantSoFar;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content } : m
            );
          }
          return [...prev, { role: "assistant", content }];
        });
      }, BATCH_INTERVAL_MS);
    };

    let usedProvider: "groq" | "deepseek" | null = null;
    const sp = systemPrompt;

    try {
      const proxyText = await tryProxy(nextHistory, controller.signal, sp);
      if (proxyText) {
        setProvider("proxy");
        setMessages((prev) => [...prev, { role: "assistant", content: proxyText }]);
        clearTimeout(timeoutId);
        setIsLoading(false);
        return;
      }

      let resp: Response | null = await tryGroq(nextHistory, controller.signal, sp);
      if (resp && resp.ok) {
        usedProvider = "groq";
      } else {
        if (resp && !resp.ok) {
          const body = await resp.text().catch(() => "");
          console.warn("Groq failed:", resp.status, body.slice(0, 200));
        }
        resp = await tryDeepSeek(nextHistory, controller.signal, sp);
        if (resp && resp.ok) {
          usedProvider = "deepseek";
        }
      }

      if (!resp) {
        clearTimeout(timeoutId);
        controller.abort();
        toast.error(t('chat.noProvider'));
        return;
      }

      if (!resp.ok) {
        clearTimeout(timeoutId);
        controller.abort();
        if (resp.status === 429) {
          toast.error(t('chat.busy'));
        } else if (resp.status === 401 || resp.status === 403) {
          toast.error(t('chat.invalidKey'));
        } else if (resp.status === 402) {
          toast.error(t('chat.outOfCredit'));
        } else {
          toast.error(t('chat.unknownError') + ` (${resp.status})`);
        }
        setMessages(nextHistory);
        return;
      }

      setProvider(usedProvider);

      await streamResponse(resp, (token) => {
        assistantSoFar += token;
        scheduleFlush();
      }, controller.signal);

      if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = null;
      }
      if (assistantSoFar) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
            );
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      } else {
        setMessages(nextHistory);
        toast.error(t('chat.noResponse'));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        console.error(e);
        toast.error(t('chat.connectionError'));
        setMessages(nextHistory);
      }
    } finally {
      clearTimeout(timeoutId);
      if (flushTimer) clearTimeout(flushTimer);
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const clearChat = () => {
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
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
                  <motion.span
                    key={lang}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    {provider === "groq"
                      ? "Groq (Llama 3.3)"
                      : provider === "deepseek"
                      ? "DeepSeek"
                      : provider === "proxy"
                      ? t('chat.proxy')
                      : t('chat.scope')}
                  </motion.span>
                </AnimatePresence>
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-secondary"
              aria-label={t('chat.clear')}
            >
              <Trash2 className="size-4" />
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
                <p className="text-muted-foreground text-sm max-w-[40ch] mx-auto leading-relaxed">
                  {t('chat.greetingText')}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 max-w-[480px] mx-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-right text-sm p-3 rounded-2xl border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  m.role === "user" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2 prose-strong:text-foreground">
                      <ReactMarkdown>{sanitizeString(m.content || "", 5000)}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-end">
                <div className="bg-secondary rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={lang}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      {t('chat.typing')}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border p-3 md:p-4 bg-background"
        >
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={t('chat.placeholder')}
              rows={1}
              maxLength={2000}
              disabled={isLoading}
              className="flex-1 resize-none bg-secondary/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-32 disabled:opacity-50"
              style={{ minHeight: "48px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="size-12 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label={t('chat.send')}
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Send className="size-5 -scale-x-100" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {t('chat.disclaimer')}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AIChat;