import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircleQuestion, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { sanitizeString, sanitizeEmail } from "@/lib/sanitize";
import { useT } from "@/contexts/useLanguage";

const createContactSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(1, t('ask.nameRequired')).max(100, t('ask.nameTooLong')),
    email: z
      .string()
      .trim()
      .email(t('ask.invalidEmail'))
      .max(255, t('ask.emailTooLong')),
    message: z
      .string()
      .trim()
      .min(1, t('ask.messageRequired'))
      .max(2000, t('ask.messageTooLong')),
  });

const FORM_URL = "https://formsubmit.co/ajax/waey.official.mk@gmail.com";

const AskSection = () => {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    const parsed = createContactSchema(t).safeParse({ name, email, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? t('ask.invalidData'));
      return;
    }

    // sanitize validated input before sending
    const nameClean = sanitizeString(parsed.data.name, 100);
    const emailClean = sanitizeEmail(parsed.data.email);
    const messageClean = sanitizeString(parsed.data.message, 2000);

    setSending(true);
    try {
      const res = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameClean,
          email: emailClean,
          message: messageClean,
          _subject: t('ask.emailSubject').replace('{name}', nameClean),
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSent(true);
      toast.success(t('ask.success'));
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error("send failed:", err);
      toast.error(t('ask.error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="ask"
      className="px-6 md:px-12 py-24 bg-gradient-to-b from-background to-card"
    >
      <div className="max-w-[600px] mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <MessageCircleQuestion className="size-6 text-primary" />
            <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">
              {t('ask.title')}
            </h2>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('ask.subtitle')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl p-8 border border-border space-y-5"
        >
          <div>
            <label className="text-sm font-bold mb-2 block">{t('ask.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder={t('ask.namePlaceholder')}
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block">{t('ask.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block">{t('ask.message')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={2000}
              rows={5}
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
              placeholder={t('ask.messagePlaceholder')}
            />
          </div>
          <button
            type="submit"
            disabled={sending || sent}
            className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {sending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t('ask.sending')}
              </>
            ) : sent ? (
              t('ask.sent')
            ) : (
              <>
                <Send className="size-4" />
                {t('ask.send')}
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default AskSection;
