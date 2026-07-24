import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Hospital,
  Building2,
  Search,
  AlertCircle,
} from "lucide-react";
import { hospitalsData } from "@/data/hospitals";
import { useT } from "@/contexts/useLanguage";

const HospitalFinder = () => {
  const t = useT();

  const typeColor: Record<string, string> = {
    جامعي: "bg-primary/10 text-primary",
    حكومي: "bg-accent/15 text-accent",
    تعليمي: "bg-primary/10 text-primary",
    خاص: "bg-destructive/10 text-destructive",
    عام: "bg-muted text-foreground",
  };

  const typeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      جامعي: t('hospital.typeUniversity'),
      حكومي: t('hospital.typeGovernment'),
      تعليمي: t('hospital.typeEducational'),
      خاص: t('hospital.typePrivate'),
      عام: t('hospital.typePublic'),
    };
    return labels[type] ?? type;
  };

  const [governorate, setGovernorate] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const [totalHospitals, governorates] = useMemo(() => {
    const govs = hospitalsData.map((g) => ({
      name: g.name,
      count: g.cities.reduce((acc, c) => acc + c.hospitals.length, 0),
    }));
    const total = govs.reduce((sum, g) => sum + g.count, 0);
    return [total, govs];
  }, []);

  const cities = useMemo(() => {
    const gov = hospitalsData.find((g) => g.name === governorate);
    return gov?.cities ?? [];
  }, [governorate]);

  const hospitals = useMemo(() => {
    if (!governorate) return [];
    let list = !city ? cities.flatMap((c) => c.hospitals) : cities.find((c) => c.city === city)?.hospitals ?? [];
    if (typeFilter) list = list.filter((h) => h.type === typeFilter);
    return list;
  }, [governorate, city, cities, typeFilter]);

  return (
    <section id="hospitals" className="bg-background px-6 md:px-12 py-20">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <Hospital className="size-4" />
            {t('hospital.badge')}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight mb-4">
            {t('hospital.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-[60ch] mx-auto leading-relaxed">
            {t('hospital.subtitleBefore')}
            <span className="font-bold text-primary">{totalHospitals} {t('hospital.hospitalUnit')}</span>
            {t('hospital.subtitleAfter')}
            <span className="font-bold">{t('hospital.egypt')}</span>.
          </p>
        </motion.div>

        {/* Selectors */}
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">
                {t('hospital.governorate')}
              </label>
              <select
                value={governorate}
                onChange={(e) => {
                  setGovernorate(e.target.value);
                  setCity("");
                }}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t('hospital.selectGovernorate')}</option>
                {governorates.map((g) => (
                  <option key={g.name} value={g.name}>
                    {g.name} ({g.count} {t('hospital.hospitalUnit')})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">
                {t('hospital.city')}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!governorate}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{t('hospital.allCities')}</option>
                {cities.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city} ({c.hospitals.length})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">
                نوع المستشفى
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">الكل</option>
                <option value="جامعي">جامعي</option>
                <option value="حكومي">حكومي</option>
                <option value="تعليمي">تعليمي</option>
                <option value="خاص">خاص</option>
                <option value="عام">عام</option>
              </select>
            </div>
          </div>

          {governorate && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              {t('hospital.results')}{" "}
              <span className="font-bold text-primary">{hospitals.length}</span>{" "}
              {t('hospital.hospitalUnit')}
            </p>
          )}
        </div>

        {/* Empty state */}
        {!governorate && (
          <div className="text-center py-12 bg-card rounded-3xl border border-dashed border-border">
            <Search className="size-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {t('hospital.empty')}
            </p>
          </div>
        )}

        {/* No results */}
        {governorate && hospitals.length === 0 && (
          <div className="text-center py-10 bg-card rounded-3xl border border-dashed border-border">
            <Hospital className="size-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {t('hospital.noResults')}
            </p>
          </div>
        )}

        {/* Hospital list */}
        <AnimatePresence mode="popLayout">
          {hospitals.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {hospitals.map((h, i) => (
                <motion.article
                  key={h.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  className="bg-card rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground leading-tight mb-1">
                        {h.name}
                      </h3>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          typeColor[h.type] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {typeLabel(h.type)}
                      </span>
                    </div>
                  </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4 mt-0.5 shrink-0 text-primary/70" />
                      <span className="leading-relaxed">{h.address}</span>
                    </div>
                </motion.article>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="mt-8 bg-destructive/5 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3 max-w-[60ch] mx-auto">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('hospital.disclaimer').replace('{0}', '123')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HospitalFinder;
