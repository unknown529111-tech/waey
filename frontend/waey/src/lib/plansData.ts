export type PlanDef = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  area: "health" | "finance" | "environment";
  titleEn?: string;
  descriptionEn?: string;
  days: string[]; // 30 daily tasks
};

export const PLANS: PlanDef[] = [
  {
    id: "save30",
    title: "30 يوم ادخار",
    emoji: "💰",
    description: "تحدّيات يومية بسيطة توفّر لك مئات الجنيهات في الشهر.",
    titleEn: "30-Day Savings",
    descriptionEn: "Simple daily challenges that save you hundreds of pounds monthly.",
    area: "finance",
    days: [
      "اكتب كل مصاريف اليوم بدقة.",
      "حضّر وجبتك في البيت بدل الطلب.",
      "اشتري قائمة محددة من السوبر ماركت بدون زيادة.",
      "ألغِ اشتراك واحد لا تستخدمه.",
      "وفّر 20 ج بعدم شراء قهوة جاهزة.",
      "قارن أسعار 3 محلات قبل أي شراء النهاردة.",
      "استخدم مواصلات عامة بدل التاكسي مرة.",
      "اطبخ لمدة يومين دفعة واحدة لتوفير الوقت والمال.",
      "اسحب 100 ج كاش وحاول ما تنفقش غيرهم.",
      "اعمل جرد لخزانتك قبل أي شراء ملابس.",
      "حوّل 5% من دخلك لحساب توفير منفصل.",
      "بِع غرض واحد لا تستخدمه.",
      "اشتري عبوة كبيرة بدل صغيرة (وفر للوحدة).",
      "اطفئ الأجهزة من الكهرباء وفّر 5%.",
      "كلّم الإنترنت/الموبايل وفاوض على باقة أرخص.",
      "اعمل ميزانية مكتوبة للأسبوع الجاي.",
      "تخطّى وجبة خارج البيت اليوم.",
      "أصلح غرض بدل ما تشتري بديل.",
      "تجنّب التسوق الإلكتروني اليوم تماماً.",
      "حدد سقف يومي لمصروف الكافيهات.",
      "اشتري خضار من سوق الجملة بدل السوبر.",
      "خصص يوم بدون أي مصروف نهائي.",
      "راجع فواتير الشهر وحدد أكبر بند مبذّر.",
      "احسب فوائد قرض/تقسيط قبل أي التزام جديد.",
      "اطلب من البائع خصم—جرّب فعلاً.",
      "ادّخر فكّتك (الفراطة) كل يوم في برطمان.",
      "خطط ميزانية الشهر الجاي بالكامل.",
      "خصص هدف ادخاري واضح لـ 3 شهور.",
      "احسب صافي ثروتك (الأصول - الديون).",
      "احتفل! حوّل ما ادخرته لحساب الهدف.",
    ],
  },
  {
    id: "health30",
    title: "30 يوم صحة",
    emoji: "💪",
    description: "خطوات بسيطة لجسد أقوى ونوم أعمق وطاقة أعلى.",
    titleEn: "30-Day Health",
    descriptionEn: "Simple steps for a stronger body, deeper sleep, and higher energy.",
    area: "health",
    days: [
      "اشرب 8 أكواب مياه اليوم.",
      "امشِ 20 دقيقة متواصلة.",
      "نَم 7 ساعات الليلة.",
      "استبدل وجبة سناك بفاكهة.",
      "10 دقائق تمدد صباحاً.",
      "قلل السكر في المشروبات.",
      "كُل خضار في وجبتين على الأقل.",
      "ابتعد عن الموبايل ساعة قبل النوم.",
      "5 دقائق تنفس عميق.",
      "20 دقيقة مشي + 10 تمارين بسيطة.",
      "وجبة فطور صحية كاملة.",
      "قلل الملح في طعامك اليوم.",
      "اشرب كوب مياه قبل كل وجبة.",
      "اصعد السلم بدل الأسانسير.",
      "20 جلسة قرفصاء (squats).",
      "اطبخ بدل ما تطلب جاهز.",
      "30 دقيقة نشاط بدني متواصل.",
      "تجنّب المقليات اليوم.",
      "افحص ضغطك / سكرك.",
      "10 دقائق تأمل أو هدوء تام.",
      "وجبة بدون لحم اليوم.",
      "قلل الكافيين بعد الظهر.",
      "20 دقيقة مشي بعد الغداء.",
      "اكتب 3 أشياء ممتن لها.",
      "قلل وقت الشاشات لساعتين.",
      "اطبخ وجبة جديدة صحية.",
      "تمارين قوة 15 دقيقة.",
      "خروجة في الطبيعة (نزهة).",
      "قيّم نومك ومزاجك خلال الشهر.",
      "احتفل وحدد عادة جديدة تكمّلها.",
    ],
  },
  {
    id: "eco30",
    title: "30 يوم بيئة",
    emoji: "🌱",
    description: "عادات يومية تقلل بصمتك الكربونية وتحمي كوكبنا.",
    titleEn: "30-Day Environment",
    descriptionEn: "Daily habits that reduce your carbon footprint and protect our planet.",
    area: "environment",
    days: [
      "افصل البلاستيك عن باقي القمامة.",
      "استخدم زجاجة مياه قابلة لإعادة الاستخدام.",
      "اطفئ كل لمبة في غرفة فاضية.",
      "قلّل وقت الاستحمام لـ 5 دقائق.",
      "تسوّق بكيس قماش بدل البلاستيك.",
      "ارفع التكييف درجة واحدة.",
      "افصل أي شاحن من الكهرباء.",
      "استخدم المواصلات العامة بدل العربية.",
      "اشتري منتج محلي بدل مستورد.",
      "اروِ نبتة أو ازرع بذرة.",
      "وجبة نباتية واحدة اليوم.",
      "أصلح غرض مكسور بدل رميه.",
      "اطبخ كمية محسوبة—لا هدر طعام.",
      "تبرّع بملابس لا تستخدمها.",
      "استخدم مناديل قماش بدل ورقية.",
      "اغسل الغسيل بمياه باردة.",
      "افصل بطاريات/إلكترونيات للتدوير.",
      "قلل استهلاك ورق في العمل.",
      "اشحن الموبايل لـ 100% فقط (لا تتركه مشحون).",
      "استخدم الدرج بدل الأسانسير.",
      "تجنّب أكواب القهوة الورقية.",
      "نظف فلاتر التكييف لتوفير طاقة.",
      "نشّف الغسيل في الشمس بدل المجفف.",
      "اشتري خضار بدون تغليف.",
      "علّم شخص عن إعادة التدوير.",
      "افصل الكرتون والورق للتدوير.",
      "قلل اللحوم الحمراء أسبوعياً.",
      "احسب استهلاك الكهرباء واخفضه 10%.",
      "راجع عاداتك الشهر اللي فات.",
      "احتفل وكمّل عادة بيئية للأبد.",
    ],
  },
];

import { getUserId, syncPlans } from "@/lib/supabaseStorage";

const KEY = (id: string) => `waey_plan_${id}`;
type PlanState = { startedAt: string; completed: number[] }; // day indexes 0..29

export const getPlanState = (id: string): PlanState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function syncPlansData() {
  const uid = getUserId();
  if (uid) syncPlans(uid);
}

export const startPlan = (id: string): PlanState => {
  const s: PlanState = { startedAt: new Date().toISOString(), completed: [] };
  localStorage.setItem(KEY(id), JSON.stringify(s));
  syncPlansData();
  return s;
};

export const togglePlanDay = (id: string, dayIdx: number): PlanState => {
  const s = getPlanState(id) ?? startPlan(id);
  const i = s.completed.indexOf(dayIdx);
  if (i >= 0) s.completed.splice(i, 1);
  else s.completed.push(dayIdx);
  localStorage.setItem(KEY(id), JSON.stringify(s));
  syncPlansData();
  return s;
};

export const resetPlan = (id: string) => {
  localStorage.removeItem(KEY(id));
  syncPlansData();
};
