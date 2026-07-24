import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import PageHero from "@/components/PageHero";

const Terms = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge="الشروط"
          icon={<Scale className="size-4" />}
          title="شروط الاستخدام"
          subtitle="القواعد والإرشادات لاستخدام منصة وعي للتوعية الشاملة"
        />
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-8 space-y-6 text-sm leading-relaxed"
            dir="rtl"
          >
            <section>
              <h2 className="text-lg font-bold mb-2">١. قبول الشروط</h2>
              <p className="text-muted-foreground">
                باستخدام منصة وعي، أنت توافق على شروط الاستخدام هذه. إذا كنت لا توافق، يُرجى عدم استخدام المنصة.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٢. وصف الخدمة</h2>
              <p className="text-muted-foreground">
                وعي هي منصة توعوية شاملة تهدف لمساعدة المستخدمين على تتبع عاداتهم اليومية في الصحة، المال، البيئة، والتعليم. جميع الأدوات مقدمة "كما هي" للاستخدام الشخصي.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٣. المسؤولية</h2>
              <p className="text-muted-foreground">
                المحتوى المقدم في وعي هو لأغراض توعوية فقط ولا يُعتبر بديلاً عن الاستشارة الطبية أو المالية أو القانونية المتخصصة. استشر المختصين المؤهلين للحصول على نصائح شخصية.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٤. الملكية الفكرية</h2>
              <p className="text-muted-foreground">
                جميع حقوق الملكية الفكرية للمنصة ومحتواها محفوظة لصاحب العمل. لا يُسمح بنسخ أو توزيع أو تعديل المحتوى دون إذن خطي.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٥. الاستخدام المسموح</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>استخدام المنصة للأغراض الشخصية فقط</li>
                <li>عدم إساءة استخدام الخدمة أو محاولة اختراقها</li>
                <li>عدم نشر محتوى مسيء أو مخالف للقانون</li>
                <li>احترام خصوصية المستخدمين الآخرين</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٦. التعديلات</h2>
              <p className="text-muted-foreground">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنُعلمك بالتغييرات الجوهرية عبر المنصة.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٧. إنهاء الخدمة</h2>
              <p className="text-muted-foreground">
                لك الحق في التوقف عن استخدام المنصة في أي وقت. جميع بياناتك تبقى محفوظة على جهازك ويمكنك حذفها يدوياً.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٨. القانون المطبق</h2>
              <p className="text-muted-foreground">
                تخضع هذه الشروط للقوانين المصرية. أي نزاع يُحل وديّاً أولاً، ثم عبر القضاء المختص.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">٩. تواصل معنا</h2>
              <p className="text-muted-foreground">
                للاستفسار عن الشروط: <a href="mailto:waey.official.mk@gmail.com" className="text-primary underline">waey.official.mk@gmail.com</a>
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Terms;