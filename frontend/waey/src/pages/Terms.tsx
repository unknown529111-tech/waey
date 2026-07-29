import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/useLanguage";

const Terms = () => {
  const { t } = useLanguage();
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge={t('terms.badge')}
          icon={<Scale className="size-4" />}
          title={t('terms.title')}
          subtitle={t('terms.subtitle')}
        />
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-8 space-y-6 text-sm leading-relaxed"
            dir={t('dir')}
          >
            <section>
              <h2 className="text-lg font-bold mb-2">{t('terms.s1.title')}</h2>
              <p className="text-muted-foreground">{t('terms.s1.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('terms.s2.title')}</h2>
              <p className="text-muted-foreground">{t('terms.s2.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('terms.s3.title')}</h2>
              <p className="text-muted-foreground">{t('terms.s3.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('terms.s4.title')}</h2>
              <p className="text-muted-foreground">{t('terms.s4.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('terms.s5.title')}</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>{t('terms.s5.item1')}</li>
                <li>{t('terms.s5.item2')}</li>
                <li>{t('terms.s5.item3')}</li>
                <li>{t('terms.s5.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('terms.s6.title')}</h2>
              <p className="text-muted-foreground">{t('terms.s6.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('terms.s7.title')}</h2>
              <p className="text-muted-foreground">{t('terms.s7.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('terms.s8.title')}</h2>
              <p className="text-muted-foreground">{t('terms.s8.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('terms.s9.title')}</h2>
              <p className="text-muted-foreground">
                {t('terms.s9.body')} <a href="mailto:waey.official.mk@gmail.com" className="text-primary underline">waey.official.mk@gmail.com</a>
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
