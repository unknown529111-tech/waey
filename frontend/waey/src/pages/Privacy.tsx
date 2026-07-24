import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import PageHero from "@/components/PageHero";

const Privacy = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge="الخصوصية"
          icon={<Shield className="size-4" />}
          title="سياسة الخصوصية"
          subtitle="كيف نحمي بياناتك ونحافظ على خصوصيتك في منصة وعي"
        />
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-8 space-y-6 text-sm leading-relaxed"
            dir="rtl"
          >
            <section>
              <h2 className="text-lg font-bold mb-2">١. مقدمة</h2>
              <p className="text-muted-foreground">
                في منصة وعي، خصوصيتك هي أولويتنا. هذه السياسة تشرح كيفية جمع، استخدام، وحماية معلوماتك عند استخدام المنصة.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٢. البيانات التي نجمعها</h2>
              <p className="text-muted-foreground">
                وعي لا تجمع أي بيانات شخصية دون موافقتك. جميع بيانات المستخدم (العادات اليومية، التتبع، الإنجازات) تُخزَّن محلياً على جهازك فقط باستخدام التخزين المحلي (localStorage).
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>بيانات الاستخدام اليومي (المياه، النوم، النشاط، المزاج)</li>
                <li>المصروفات المالية (اختياري)</li>
                <li>المفضلة والعلامات المرجعية</li>
                <li>سلسلة الإنجازات والنقاط</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٣. كيف نستخدم بياناتك</h2>
              <p className="text-muted-foreground">
                تُستخدم بياناتك فقط لعرض لوحة متابعتك اليومية وتقديم تحليلات وإحصائيات داخل التطبيق. لا نشارك بياناتك مع أي طرف ثالث.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٤. نموذج التواصل</h2>
              <p className="text-muted-foreground">
                عند استخدام نموذج التواصل، نجمع اسمك وبريدك الإلكتروني ورسالتك فقط للرد عليك. هذه البيانات تُحذف بعد ٩٠ يوماً.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٥. ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-muted-foreground">
                لا نستخدم ملفات تعريف الارتباط للتتبع. نستخدم ملفات تقنية محلية فقط لتشغيل التطبيق (حفظ الثيم، اللغة).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٦. الأمان</h2>
              <p className="text-muted-foreground">
                جميع البيانات مخزنة محلياً على جهازك. لا توجد خوادم خارجية تخزن بياناتك الشخصية. التطبيق يعمل بدون اتصال بالإنترنت بشكل كامل.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٧. حقوقك</h2>
              <p className="text-muted-foreground">
                لك الحق في حذف جميع بياناتك في أي وقت من خلال خاصية النسخ الاحتياطي أو مسح بيانات التصفح. جميع بياناتك ملك لك وحدك.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٨. تحديثات السياسة</h2>
              <p className="text-muted-foreground">
                قد نحدث هذه السياسة من وقت لآخر. سنُعلمك بأي تغييرات جوهرية عبر شاشة الترحيب. تاريخ آخر تحديث: يوليو ٢٠٢٦.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٩. التواصل</h2>
              <p className="text-muted-foreground">
                للاستفسار عن سياسة الخصوصية، راسلنا على: <a href="mailto:waey.official.mk@gmail.com" className="text-primary underline">waey.official.mk@gmail.com</a>
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;