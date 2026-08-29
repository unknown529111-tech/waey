import "./ArabicPromo.css";

const Svg = ({ children, ...p }: { children: React.ReactNode } & React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
    {children}
  </svg>
);

const IconHealth = () => <Svg><path d="M3 12h4l2 5 4-12 2 7h6" /></Svg>;
const IconFinance = () => <Svg><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></Svg>;
const IconEnvironment = () => <Svg><path d="M11 20A7 7 0 0 1 4 13C4 8 8 4 13 4c3 0 5 2 6 4-1 6-4 11-8 12Z" /><path d="M11 20c0-5 2-9 6-12" /></Svg>;
const IconEducation = () => <Svg><path d="M4 5h16M4 12h16M4 19h10" /></Svg>;
const IconTick = () => <Svg strokeWidth={2.4}><path d="M20 6 9 17l-5-5" /></Svg>;
const IconPlus = () => <Svg><path d="M12 3v18M3 12h18" /></Svg>;
const IconAward = () => <Svg><circle cx="12" cy="8" r="5" /><path d="M9 13l-1 8 4-3 4 3-1-8" /></Svg>;
const IconCalendar = () => <Svg><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h5" /></Svg>;
const IconChat = () => <Svg><path d="M4 5h16v11H7l-3 3z" /></Svg>;
const IconList = () => <Svg><path d="M5 7h14M5 12h14M5 17h9" /></Svg>;
const IconMoon = () => <Svg><path d="M12 3a9 9 0 1 0 9 9" /><path d="M3 12a9 9 0 0 1 9-9" /><path d="M12 7v5l3 2" /></Svg>;
const IconDownload = () => <Svg><path d="M12 3a9 9 0 1 0 9 9" /><path d="M3 12a9 9 0 0 1 9-9" /><path d="M12 7v5l3 2" /></Svg>;
const IconFile = () => <Svg><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></Svg>;
const IconShield = () => <Svg><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /></Svg>;

const fields = [
  { icon: <IconHealth />, title: "الصحة", desc: "تتبّع الماء والنوم والوزن، وحاسبة السكر مع نصائح يومية لأسلوب حياة أفضل." },
  { icon: <IconFinance />, title: "المال", desc: "سجّل المصروفات حسب التصنيف، خطّط لميزانيتك، وشارك في تحديات التوفير." },
  { icon: <IconEnvironment />, title: "البيئة", desc: "عادات بيئية يومية، نصائح لإعادة التدوير، وتحديات لخفض استهلاك الطاقة." },
  { icon: <IconEducation />, title: "التعليم", desc: "نصائح يومية للتعلّم، وخطط ثلاثين يومًا تبني عادة جديدة خطوة بخطوة." },
];

const caps = [
  { icon: <IconPlus />, title: "أيام متتالية مع تجميد", desc: "حافظ على سلسلة التزامك مع خيار تجميد يوم عند الحاجة." },
  { icon: <IconAward />, title: "نقاط وشارات وإنجازات", desc: "تقدير مرئي لتقدّمك يحفّزك على الاستمرار." },
  { icon: <IconCalendar />, title: "خطط ثلاثين يومًا", desc: "برامج قصيرة مركّزة تبني عادة واحدة بثبات." },
  { icon: <IconChat />, title: "مجلة مراجعة المساء", desc: "دوّن تفكيرك اليومي في مساحة هادئة قبل النوم." },
  { icon: <IconList />, title: "أولويات اليوم الكبرى", desc: "حدّد ثلاثة أشياء تهم فعلًا كل صباح." },
  { icon: <IconMoon />, title: "وضع ليلي وداكن", desc: "راحة للعين في المساء مع تبديل تلقائي للثيم." },
  { icon: <IconDownload />, title: "تطبيق ويب قابل للتثبيت", desc: "PWA يعمل دون اتصال مع مزامنة عند العودة." },
  { icon: <IconFile />, title: "تصدير تقرير PDF", desc: "لخّص تقدّمك بشهادة قابلة للمشاركة." },
  { icon: <IconShield />, title: "خصوصية وأمان", desc: "بياناتك محفوظة في حسابك مع تحكّم كامل بها." },
];

const aiFeatures = [
  "محادثة بالعربية تفهم سياق عاداتك.",
  "تذكيرات ذكية في الوقت المناسب لك.",
  "ملخّصات مسائية تربط مجالات يومك.",
];

const stats = [
  { num: "٤", label: "مجالات مدمجة في تطبيق واحد" },
  { num: "١٦+", label: "جدول في قاعدة البيانات" },
  { num: "٢١٥+", label: "اختبار تغطية مؤتمت" },
  { num: "RTL", label: "دعم كامل من اليمين لليسار" },
];

export default function ArabicPromo() {
  return (
    <div className="waey-promo" dir="rtl" lang="ar">
      <header className="nav">
        <div className="container nav-inner">
          <a className="nav-brand" href="#top" aria-label="وعي">وعي</a>
          <nav className="nav-links" aria-label="التنقل الرئيسي">
            <a href="#fields">المجالات</a>
            <a href="#ai">المساعد الذكي</a>
            <a href="#features">المميزات</a>
            <a href="#stats">المنصة</a>
          </nav>
          <div className="nav-cta">
            <a className="btn btn-pill" href="#cta">حمّل التطبيق</a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero" id="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">منصة الوعي الشاملة</p>
              <h1 className="display-xl">كل جوانب حياتك،<br />في مكان واحد.</h1>
              <p className="lead">وعي يجمع لك الصحة والمال والبيئة والتعليم — عادات يومية، تتبّع ذكي، وتحديات تجعل التغيّر أسهل من أن تبدأه وحدك.</p>
              <div className="hero-actions">
                <a className="btn btn-pill" href="#cta">ابدأ مجانًا</a>
                <a className="btn btn-ghost" href="#fields">تعرّف على المميزات</a>
              </div>
            </div>
            <div className="hero-media">
              <span className="hero-badge">دعم كامل بالعربية</span>
              <div className="media-ph">وعي</div>
            </div>
          </div>
        </section>

        <section className="section section--surface" id="fields">
          <div className="container">
            <p className="eyebrow">أربعة مجالات. روتين واحد.</p>
            <h2 className="section-title">ما تتبعه عادة في أربعة تطبيقات، وعي يجمعه لك.</h2>
            <p className="lead" style={{ marginBottom: "var(--space-12)" }}>صمّمت كل منطقة بأدواتها الخاصة، لكنها تشترك في نفس السجل وتجربة الاستخدام.</p>
            <div className="grid-4">
              {fields.map((f) => (
                <article className="card" key={f.title}>
                  <div className="card-media">{f.icon}</div>
                  <div className="card-body">
                    <div className="card-icon" aria-hidden="true">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--dark" id="ai">
          <div className="container split">
            <div>
              <p className="eyebrow">مساعد وعي الذكي</p>
              <h2 className="display-l">يسأل، يذكّر، ويتابع معك.</h2>
              <p className="lead" style={{ marginTop: "var(--space-4)" }}>مساعد مبني على ذكاء اصطناعي يفهم أهدافك بالعربية، ويبقى بجانبك حين تفقد الحافز.</p>
              <ul className="feature-list">
                {aiFeatures.map((t) => (
                  <li key={t}><span className="tick" aria-hidden="true"><IconTick /></span>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="media-ph">وعي · المساعد</div>
            </div>
          </div>
        </section>

        <section className="section" id="stats">
          <div className="container">
            <p className="eyebrow" style={{ textAlign: "center" }}>منصة مبنية بعناية</p>
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>أرقام حقيقية من بنية وعي.</h2>
            <div className="stats">
              {stats.map((s) => (
                <div className="stat" key={s.label}>
                  <div className="num">{s.num}</div>
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--surface" id="features">
          <div className="container">
            <p className="eyebrow">أدوات تجعل الاستمرار أسهل</p>
            <h2 className="section-title">كل ما تحتاجه لتبقى على المسار.</h2>
            <p className="lead" style={{ marginBottom: "var(--space-12)" }}>نظام مكافآت لطيف، وأدوات تخطيط عملية، تعمل أينما كنت — متصلًا أو دون اتصال.</p>
            <div className="grid-3">
              {caps.map((c) => (
                <div className="cap-card" key={c.title}>
                  <div className="cap-icon" aria-hidden="true">{c.icon}</div>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--dark cta" id="cta">
          <div className="container">
            <p className="eyebrow">ابدأ اليوم</p>
            <h2>ابدأ رحلتك نحو وعي أعمق.</h2>
            <p className="lead">حمّل تطبيق وعي، أو استكشف كيف يجمع أربعة مجالات في روتين واحد.</p>
            <div className="cta-actions">
              <a className="btn btn-pill" href="#top">حمّل تطبيق وعي</a>
              <a className="btn btn-ghost" href="#fields">استعرض المجالات</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="nav-brand" href="#top" aria-label="وعي">وعي</a>
          <nav className="footer-links" aria-label="روابط التذييل">
            <a href="#fields">المجالات</a>
            <a href="#ai">المساعد الذكي</a>
            <a href="#features">المميزات</a>
            <a href="#cta">التحميل</a>
          </nav>
          <span>© ٢٠٢٦ وعي — كل حقوقك في مكان واحد.</span>
        </div>
      </footer>
    </div>
  );
}
