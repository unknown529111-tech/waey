import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/contexts/useLanguage";

const Privacy = () => {
  const { t } = useLanguage();
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge={t('privacy.badge')}
          icon={<Shield className="size-4" />}
          title={t('privacy.title')}
          subtitle={t('privacy.subtitle')}
        />
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-8 space-y-6 text-sm leading-relaxed"
            dir={t('dir')}
          >
            <section>
              <h2 className="text-lg font-bold mb-2">{t('privacy.s1.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.s1.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('privacy.s2.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.s2.body')}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>{t('privacy.s2.item1')}</li>
                <li>{t('privacy.s2.item2')}</li>
                <li>{t('privacy.s2.item3')}</li>
                <li>{t('privacy.s2.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('privacy.s3.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.s3.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('privacy.s4.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.s4.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('privacy.s5.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.s5.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('privacy.s6.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.s6.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('privacy.s7.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.s7.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('privacy.s8.title')}</h2>
              <p className="text-muted-foreground">{t('privacy.s8.body')}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-2">{t('privacy.s9.title')}</h2>
              <p className="text-muted-foreground">
                {t('privacy.s9.body')} <a href="mailto:waey.official.mk@gmail.com" className="text-primary underline">waey.official.mk@gmail.com</a>
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
