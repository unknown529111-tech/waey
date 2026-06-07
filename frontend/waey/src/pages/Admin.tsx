import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RECIPES, type Recipe } from "@/data/recipes";
import { CHALLENGES, QUOTES } from "@/lib/dailyStorage";
import { getAllStreaks, getPrizeInfo, resetPrize, getUsers } from "@/lib/streak";
import { getOnlineCount, getSignedInCount, getMinSessionDuration, getOnlineList } from "@/lib/presence";
import { PLANS } from "@/lib/plansData";
import {
  isAdminLoggedIn,
  adminLogin,
  adminLogout,
  getAdminRecipes,
  addAdminRecipe,
  deleteAdminRecipe,
  updateAdminRecipe,
  getAdminChallenges,
  addAdminChallenge,
  updateAdminChallenge,
  deleteAdminChallenge,
  getAdminQuotes,
  addAdminQuote,
  updateAdminQuote,
  deleteAdminQuote,
  exportAllData,
  resetAllData,
  type AdminItem,
} from "@/lib/adminContent";
import {
  Shield, Trophy, ChefHat, MessageSquareQuote, Users, Settings, LogOut,
  Plus, Trash2, Edit3, X, Check, Download, AlertTriangle, RefreshCw,
  LayoutDashboard, Flame, Mail, Lock, BookOpen, Save, Copy,
} from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

type Tab = "dashboard" | "recipes" | "challenges" | "quotes" | "users" | "system";

interface EditState {
  open: boolean;
  mode: "add" | "edit";
  id?: string;
}

// ---------- Form helpers ----------
const emptyRecipe: Recipe = {
  id: "", name: "", emoji: "🍳", calories: 200, costEGP: 15,
  prepMin: 15, servings: 2, ingredients: [], steps: [], tags: [],
};

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const t = useT();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (isAdminLoggedIn()) setLoggedIn(true); }, []);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border/50 rounded-[2rem] p-8 w-full max-w-sm mx-4"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('admin.login')}</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (adminLogin(password)) {
                setLoggedIn(true);
                setLoginError(false);
              } else {
                setLoginError(true);
              }
            }}
          >
            <div className="relative mb-4">
              <Lock className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.password')}
                className="w-full h-11 pr-10 rounded-full bg-muted border border-border/50 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                autoFocus
              />
            </div>
            {loginError && (
              <p className="text-xs text-red-500 mb-3">{t('admin.wrongPassword')}</p>
            )}
            <button
              type="submit"
              className="w-full h-11 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all"
            >
              {t('admin.enter')}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "الإحصائيات", icon: <LayoutDashboard className="size-4" /> },
    { id: "recipes", label: "الوصفات", icon: <ChefHat className="size-4" /> },
    { id: "challenges", label: "التحديات", icon: <BookOpen className="size-4" /> },
    { id: "quotes", label: "الحكم", icon: <MessageSquareQuote className="size-4" /> },
    { id: "users", label: "المستخدمين", icon: <Users className="size-4" /> },
    { id: "system", label: "النظام", icon: <Settings className="size-4" /> },
  ];

  return (
    <div className="min-h-screen pb-24" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('admin.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => { adminLogout(); setLoggedIn(false); }}
            className="h-9 px-4 text-xs font-bold rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-all flex items-center gap-2"
          >
            <LogOut className="size-3.5" />
            {t('admin.logout')}
          </button>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-1.5 overflow-x-auto pb-1 mb-6 scrollbar-none"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "dashboard" && <DashboardTab />}
            {tab === "recipes" && <RecipesTab />}
            {tab === "challenges" && <ChallengesTab />}
            {tab === "quotes" && <QuotesTab />}
            {tab === "users" && <UsersTab />}
            {tab === "system" && <SystemTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================
function DashboardTab() {
  const users = getUsers();
  const streaks = getAllStreaks();
  const prize = getPrizeInfo();
  const adminRecipes = getAdminRecipes();
  const adminChallenges = getAdminChallenges();
  const adminQuotes = getAdminQuotes();

  const streakValues = Object.values(streaks).map((s) => s.count);
  const topStreak = streakValues.length > 0 ? Math.max(...streakValues) : 0;

  const cards = [
    { icon: <Users className="size-5" />, label: "إجمالي المستخدمين", value: Object.keys(users).length, color: "" },
    { icon: <ChefHat className="size-5" />, label: "الوصفات", value: RECIPES.length + adminRecipes.length, sub: `${adminRecipes.length} مضافة`, color: "" },
    { icon: <Flame className="size-5 text-orange-500" />, label: "أعلى نقاط", value: topStreak, sub: topStreak >= 100 ? "🏆 فائز!" : "", color: topStreak >= 100 ? "text-amber-500" : "" },
    { icon: <Trophy className="size-5" />, label: "الفائز بالجائزة", value: prize.winner ? "تم" : "لا يوجد", sub: prize.winner || "", color: prize.winner ? "text-amber-500" : "" },
    { icon: <BookOpen className="size-5" />, label: "التحديات", value: CHALLENGES.length + adminChallenges.length, sub: `${adminChallenges.length} مضافة`, color: "" },
    { icon: <MessageSquareQuote className="size-5" />, label: "الحكم", value: QUOTES.length + adminQuotes.length, sub: `${adminQuotes.length} مضافة`, color: "" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`bg-card border border-border/50 rounded-[2rem] p-6 ${c.color}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="text-primary">{c.icon}</div>
            <span className="text-sm font-bold text-muted-foreground">{c.label}</span>
          </div>
          <span className={`text-3xl font-bold ${c.color}`}>{c.value}</span>
          {c.sub && <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>}
        </motion.div>
      ))}
      {/* Live metrics card */}
      <LiveMetricsCard />
    </div>
  );
}

function LiveMetricsCard() {
  const [online, setOnline] = useState(() => getOnlineCount());
  const [signedIn, setSignedIn] = useState(() => getSignedInCount());
  const [minMs, setMinMs] = useState(() => getMinSessionDuration());

  useEffect(() => {
    const t = setInterval(() => {
      setOnline(getOnlineCount());
      setSignedIn(getSignedInCount());
      setMinMs(getMinSessionDuration());
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const fmt = (ms: number) => {
    if (!ms) return "-";
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return `${m}m`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/50 rounded-[2rem] p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary"><Users className="size-5" /></div>
        <span className="text-sm font-bold text-muted-foreground">مؤشرات حية</span>
      </div>
      <div className="flex gap-4 items-center">
        <div>
          <div className="text-2xl font-bold">{online}</div>
          <div className="text-xs text-muted-foreground">متصل الآن</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{signedIn}</div>
          <div className="text-xs text-muted-foreground">تسجيلات حقيقية</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{fmt(minMs)}</div>
          <div className="text-xs text-muted-foreground">أقصر جلسة</div>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== RECIPES TAB ====================
function RecipesTab() {
  const [adminItems, setAdminItems] = useState<AdminItem<Recipe>[]>([]);
  const [edit, setEdit] = useState<EditState & { data?: Partial<Recipe> }>({ open: false, mode: "add" });
  const [search, setSearch] = useState("");

  useEffect(() => { setAdminItems(getAdminRecipes()); }, []);

  const refresh = () => setAdminItems(getAdminRecipes());

  const allItems = search
    ? RECIPES.filter((r) => r.name.includes(search) || r.tags.some((t) => t.includes(search)))
    : RECIPES;

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-bold">الوصفات ({RECIPES.length + adminItems.length})</h2>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className="h-9 px-4 rounded-full bg-muted border-none text-xs outline-none w-32 focus:w-40 transition-all"
          />
          <button
            onClick={() => setEdit({ open: true, mode: "add", data: emptyRecipe })}
            className="h-9 px-4 text-xs font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5"
          >
            <Plus className="size-3.5" />
            {t('common.add')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground sticky top-0 bg-card">
              <th className="text-right px-4 py-3 font-bold w-10">#</th>
              <th className="text-right px-4 py-3 font-bold">الوصفة</th>
              <th className="text-right px-4 py-3 font-bold hidden md:table-cell">التصنيفات</th>
              <th className="text-center px-4 py-3 font-bold">سعرات</th>
              <th className="text-center px-4 py-3 font-bold hidden sm:table-cell">التكلفة</th>
              <th className="text-center px-4 py-3 font-bold w-20">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {/* Hardcoded recipes */}
            {allItems.map((r, i) => (
              <tr key={r.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{r.emoji}</span>
                    <span className="font-bold">{r.name}</span>
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {r.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                    ))}
                    {r.tags.length > 3 && <span className="text-[10px] text-muted-foreground">+{r.tags.length - 3}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{r.calories}</td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">{r.costEGP} ج</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-[10px] text-muted-foreground">أساسية</span>
                </td>
              </tr>
            ))}
            {/* Admin recipes */}
            <tr className="bg-primary/5">
              <td colSpan={6} className="px-4 py-2 text-xs font-bold text-primary">الوصفات المضافة من المشرف ({adminItems.length})</td>
            </tr>
            {adminItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-sm">لا توجد وصفات مضافة بعد</td>
              </tr>
            ) : (
              adminItems.map((r, i) => (
                <tr key={r._adminId} className="border-b border-primary/20 hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{r.emoji}</span>
                      <span className="font-bold">{r.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {r.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{r.calories}</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">{r.costEGP} ج</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEdit({ open: true, mode: "edit", id: r._adminId, data: r })}
                        className="size-7 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
                        title={t('common.edit')}
                      >
                        <Edit3 className="size-3" />
                      </button>
                      <button
                        onClick={() => { deleteAdminRecipe(r._adminId); refresh(); }}
                        className="size-7 rounded-full bg-muted hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors"
                        title={t('common.delete')}
                      >
                        <Trash2 className="size-3 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Recipe edit modal */}
      <AnimatePresence>
        {edit.open && (
          <RecipeModal
            mode={edit.mode}
            data={edit.data || emptyRecipe}
            onSave={(data) => {
              if (edit.mode === "add") {
                addAdminRecipe(data as Recipe);
              } else if (edit.id) {
                updateAdminRecipe(edit.id, data);
              }
              refresh();
              setEdit({ open: false, mode: "add" });
            }}
            onClose={() => setEdit({ open: false, mode: "add" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RecipeModal({ mode, data, onSave, onClose }: {
  mode: "add" | "edit";
  data: Partial<Recipe>;
  onSave: (d: Partial<Recipe>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Recipe>>(data);

  const allTags = ["نباتي", "سريع", "اقتصادي", "صحي", "بروتين عالي", "فطار", "غدا", "عشا", "حلو", "مشروب"] as const;

  const toggleTag = (tag: string) => {
    const current = form.tags || [];
    setForm({
      ...form,
      tags: current.includes(tag as typeof allTags[number])
        ? current.filter((t) => t !== tag)
        : [...current, tag as typeof allTags[number]],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border/50 rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">{mode === "add" ? "إضافة وصفة جديدة" : "تعديل الوصفة"}</h3>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-bold text-muted-foreground">الإيموجي</label>
              <input
                value={form.emoji || ""}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                className="w-full h-10 rounded-full bg-muted border border-border/50 px-4 text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 mt-1"
                placeholder="🍳"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground">السعرات</label>
              <input
                type="number"
                value={form.calories ?? 200}
                onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })}
                className="w-full h-10 rounded-full bg-muted border border-border/50 px-4 text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground">التكلفة (ج)</label>
              <input
                type="number"
                value={form.costEGP ?? 15}
                onChange={(e) => setForm({ ...form, costEGP: Number(e.target.value) })}
                className="w-full h-10 rounded-full bg-muted border border-border/50 px-4 text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground">اسم الوصفة</label>
            <input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-10 rounded-full bg-muted border border-border/50 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 mt-1"
              placeholder="مثال: مكرونة بالبشاميل"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground">التصنيفات</label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {allTags.map((t) => {
                const active = (form.tags || []).includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-muted-foreground">وقت التحضير (دقيقة)</label>
              <input
                type="number"
                value={form.prepMin ?? 15}
                onChange={(e) => setForm({ ...form, prepMin: Number(e.target.value) })}
                className="w-full h-10 rounded-full bg-muted border border-border/50 px-4 text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground">الحصص</label>
              <input
                type="number"
                value={form.servings ?? 2}
                onChange={(e) => setForm({ ...form, servings: Number(e.target.value) })}
                className="w-full h-10 rounded-full bg-muted border border-border/50 px-4 text-sm text-center outline-none focus:ring-2 focus:ring-primary/30 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground">المكونات (واحد في كل سطر)</label>
            <textarea
              value={(form.ingredients || []).join("\n")}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value.split("\n").filter(Boolean) })}
              className="w-full h-20 rounded-2xl bg-muted border border-border/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 mt-1 resize-none"
              placeholder="دجاج&#10;أرز&#10;طماطم"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground">خطوات التحضير (واحد في كل سطر)</label>
            <textarea
              value={(form.steps || []).join("\n")}
              onChange={(e) => setForm({ ...form, steps: e.target.value.split("\n").filter(Boolean) })}
              className="w-full h-20 rounded-2xl bg-muted border border-border/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 mt-1 resize-none"
              placeholder="اسلق المكرونة.&#10;حضّر الصلصة.&#10;قدّم ساخن."
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => onSave(form)}
            className="flex-1 h-11 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Save className="size-4" />
            {mode === "add" ? t('common.add') : t('common.save')}
          </button>
          <button
            onClick={onClose}
            className="h-11 px-6 rounded-full bg-muted text-muted-foreground font-bold text-sm hover:bg-muted/80 transition-all"
          >
            {t('common.cancel')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== CHALLENGES TAB ====================
function ChallengesTab() {
  const base = CHALLENGES;
  const [adminItems, setAdminItems] = useState(getAdminChallenges());
  const [showAdd, setShowAdd] = useState(false);
  const [editForm, setEditForm] = useState<{ id?: string; emoji: string; text: string; area: string }>({
    emoji: "🌟", text: "", area: "صحة",
  });

  const refresh = () => setAdminItems(getAdminChallenges());

  const startEdit = (item: { _adminId: string; emoji: string; text: string; area: string }) => {
    setEditForm({ id: item._adminId, emoji: item.emoji, text: item.text, area: item.area });
    setShowAdd(true);
  };

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-bold">التحديات اليومية ({base.length + adminItems.length})</h2>
        <button
          onClick={() => { setEditForm({ emoji: "🌟", text: "", area: "صحة" }); setShowAdd(true); }}
          className="h-9 px-4 text-xs font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5"
        >
          <Plus className="size-3.5" />
          {t('common.add')}
        </button>
      </div>

      <div className="divide-y divide-border/30">
        <div className="px-6 py-2 text-xs font-bold text-muted-foreground bg-muted/30">التحديات الأساسية ({base.length})</div>
        {base.map((c, i) => (
          <div key={i} className="px-6 py-3 flex items-center gap-3 hover:bg-muted/20 transition-colors">
            <span className="text-xl">{c.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{c.text}</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c.area}</span>
            </div>
          </div>
        ))}
        <div className="px-6 py-2 text-xs font-bold text-primary bg-primary/5">المضافة ({adminItems.length})</div>
        {adminItems.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">لا توجد تحديات مضافة بعد</div>
        ) : (
          adminItems.map((c) => (
            <div key={c._adminId} className="px-6 py-3 flex items-center gap-3 hover:bg-primary/5 transition-colors group">
              <span className="text-xl">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.text}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c.area}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(c)} className="size-7 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center"><Edit3 className="size-3" /></button>
                <button onClick={() => { deleteAdminChallenge(c._adminId); refresh(); }} className="size-7 rounded-full bg-muted hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center"><Trash2 className="size-3 text-red-500" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit challenge modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/50 rounded-[2rem] w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">{editForm.id ? "تعديل التحدي" : "إضافة تحدي جديد"}</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground">الإيموجي</label>
                    <input value={editForm.emoji} onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })} className="w-full h-10 rounded-full bg-muted border border-border/50 px-4 text-sm text-center mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground">المجال</label>
                    <select value={editForm.area} onChange={(e) => setEditForm({ ...editForm, area: e.target.value })} className="w-full h-10 rounded-full bg-muted border border-border/50 px-4 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="صحة">صحة</option>
                      <option value="مال">مال</option>
                      <option value="بيئة">بيئة</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">نص التحدي</label>
                  <textarea value={editForm.text} onChange={(e) => setEditForm({ ...editForm, text: e.target.value })} className="w-full h-20 rounded-2xl bg-muted border border-border/50 px-4 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="مثال: اشرب 8 أكواب مياه اليوم." />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    if (!editForm.text.trim()) return;
                    if (editForm.id) {
                      updateAdminChallenge(editForm.id, { emoji: editForm.emoji, text: editForm.text, area: editForm.area });
                    } else {
                      addAdminChallenge({ emoji: editForm.emoji, text: editForm.text, area: editForm.area });
                    }
                    refresh();
                    setShowAdd(false);
                  }}
                  className="flex-1 h-11 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="size-4" />
                  {editForm.id ? t('common.save') : t('common.add')}
                </button>
                <button onClick={() => setShowAdd(false)} className="h-11 px-6 rounded-full bg-muted text-muted-foreground font-bold text-sm hover:bg-muted/80 transition-all">{t('common.cancel')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== QUOTES TAB ====================
function QuotesTab() {
  const base = QUOTES;
  const [adminItems, setAdminItems] = useState(getAdminQuotes());
  const [showAdd, setShowAdd] = useState(false);
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState<string | undefined>();

  const refresh = () => setAdminItems(getAdminQuotes());

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-bold">الحكم اليومية ({base.length + adminItems.length})</h2>
        <button
          onClick={() => { setEditText(""); setEditId(undefined); setShowAdd(true); }}
          className="h-9 px-4 text-xs font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5"
        >
          <Plus className="size-3.5" />
          {t('common.add')}
        </button>
      </div>

      <div className="divide-y divide-border/30">
        <div className="px-6 py-2 text-xs font-bold text-muted-foreground bg-muted/30">الحكم الأساسية ({base.length})</div>
        {base.map((q, i) => (
          <div key={i} className="px-6 py-3 flex items-center gap-3 hover:bg-muted/20 transition-colors">
            <span className="text-muted-foreground shrink-0 w-6 text-center text-xs">{i + 1}</span>
            <p className="text-sm truncate">{q}</p>
          </div>
        ))}
        <div className="px-6 py-2 text-xs font-bold text-primary bg-primary/5">المضافة ({adminItems.length})</div>
        {adminItems.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">لا توجد حكم مضافة بعد</div>
        ) : (
          adminItems.map((q) => (
            <div key={q._adminId} className="px-6 py-3 flex items-center gap-3 hover:bg-primary/5 transition-colors group">
              <span className="text-muted-foreground shrink-0 w-6 text-center text-xs">{base.length + 1}</span>
              <p className="text-sm flex-1 truncate">{q.text}</p>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditText(q.text); setEditId(q._adminId); setShowAdd(true); }} className="size-7 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center"><Edit3 className="size-3" /></button>
                <button onClick={() => { deleteAdminQuote(q._adminId); refresh(); }} className="size-7 rounded-full bg-muted hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center"><Trash2 className="size-3 text-red-500" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/50 rounded-[2rem] w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">{editId ? "تعديل الحكمة" : "إضافة حكمة جديدة"}</h3>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full h-24 rounded-2xl bg-muted border border-border/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="اكتب الحكمة هنا..."
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    if (!editText.trim()) return;
                    if (editId) {
                      updateAdminQuote(editId, editText);
                    } else {
                      addAdminQuote(editText);
                    }
                    refresh();
                    setShowAdd(false);
                  }}
                  className="flex-1 h-11 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="size-4" />
                  {editId ? t('common.save') : t('common.add')}
                </button>
                <button onClick={() => setShowAdd(false)} className="h-11 px-6 rounded-full bg-muted text-muted-foreground font-bold text-sm hover:bg-muted/80 transition-all">{t('common.cancel')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== USERS TAB ====================
function UsersTab() {
  const [users, setUsers] = useState<{ email: string; name: string; password: string; streakCount: number }[]>([]);
  const [prize, setPrizeState] = useState(getPrizeInfo());
  const [onlineList, setOnlineList] = useState(() => getOnlineList());

  const refresh = () => {
    const records = getUsers();
    const streaks = getAllStreaks();
    const rows = Object.entries(records).map(([email, data]) => ({
      email, name: data.name, password: data.password,
      streakCount: streaks[email]?.count || 0,
    }));
    rows.sort((a, b) => b.streakCount - a.streakCount);
    setUsers(rows);
    setPrizeState(getPrizeInfo());
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    const t = setInterval(() => setOnlineList(getOnlineList()), 3000);
    return () => clearInterval(t);
  }, []);

  const deleteUser = (email: string) => {
    const records = getUsers();
    delete records[email];
    localStorage.setItem("waey_users", JSON.stringify(records));
    const streaks = getAllStreaks();
    delete streaks[email];
    localStorage.setItem("waey_streaks", JSON.stringify(streaks));
    refresh();
  };

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold">متصلون الآن: {onlineList.length}</div>
            <div className="text-xs text-muted-foreground">{onlineList.map((o) => o.name).slice(0, 6).join("، ") || "لا أحد"}</div>
          </div>
          <div className="text-xs text-muted-foreground">تحديث تلقائي</div>
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-bold">المستخدمين ({users.length})</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const text = users.map((u, i) => `${i + 1}. ${u.name} (${u.email}) — ${u.streakCount} نقطة`).join("\n");
              navigator.clipboard.writeText(text);
            }}
            className="h-9 px-4 text-xs font-bold rounded-full bg-muted hover:bg-muted/80 transition-all flex items-center gap-1.5"
          >
            <Copy className="size-3" />
            {t('common.copy')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground sticky top-0 bg-card">
              <th className="text-right px-4 py-3 font-bold">#</th>
              <th className="text-right px-4 py-3 font-bold">الاسم</th>
              <th className="text-right px-4 py-3 font-bold hidden sm:table-cell">البريد</th>
              <th className="text-center px-4 py-3 font-bold">النقاط</th>
              <th className="text-center px-4 py-3 font-bold w-20">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">لا يوجد مستخدمين بعد</td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={u.email} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${
                  prize.winner === u.email ? "bg-amber-50 dark:bg-amber-950/20" : ""
                }`}>
                  <td className="px-4 py-3 text-muted-foreground text-center">{i + 1}</td>
                  <td className="px-4 py-3 font-bold">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground dir-ltr hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 font-bold ${u.streakCount >= 100 ? "text-amber-500" : ""}`}>
                      <Flame className="size-3.5 text-orange-500" />
                      {u.streakCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteUser(u.email)}
                      className="size-7 rounded-full bg-muted hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors"
                      title="حذف المستخدم"
                    >
                      <Trash2 className="size-3 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Prize section */}
      <div className="px-6 py-4 border-t border-border/50 bg-amber-50 dark:bg-amber-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="size-5 text-amber-500" />
            <div>
              <p className="text-sm font-bold">الجائزة</p>
              <p className="text-xs text-muted-foreground">
                {prize.winner ? `الفائز: ${prize.winner}` : "لم يتم الفوز بعد"}
              </p>
            </div>
          </div>
          {prize.winner && (
            <button
              onClick={() => { resetPrize(); refresh(); }}
              className="h-8 px-4 text-xs font-bold rounded-full bg-amber-200 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-300 dark:hover:bg-amber-900/50 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="size-3" />
              إعادة ضبط الجائزة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== SYSTEM TAB ====================
function SystemTab() {
  const [exported, setExported] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-[2rem] p-6"
      >
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Download className="size-5 text-primary" />
          تصدير البيانات
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          تصدير جميع بيانات localStorage كملف JSON للنسخ الاحتياطي.
        </p>
        {exported ? (
          <div className="relative">
            <pre className="text-xs bg-muted rounded-2xl p-4 overflow-auto max-h-60 leading-relaxed font-mono">{exported.slice(0, 2000)}{exported.length > 2000 ? `\n... (${exported.length - 2000} character more)` : ""}</pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(exported).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="absolute top-2 left-2 size-8 rounded-full bg-card border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Copy className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setExported(exportAllData())}
            className="h-10 px-5 text-xs font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            تصدير البيانات
          </button>
        )}
        {copied && <p className="text-xs text-green-600 mt-2">تم النسخ!</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-red-200 dark:border-red-900/30 rounded-[2rem] p-6"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">إعادة ضبط النظام</h3>
            <p className="text-sm text-muted-foreground mb-4">
              هذا الإجراء سيمسح جميع بيانات المستخدمين، النقاط، التحديات، والحكم المضافة. لا يمكن التراجع عنه.
            </p>
            {showReset ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    resetAllData();
                    setShowReset(false);
                  }}
                  className="h-9 px-4 text-xs font-bold rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
                >
                  تأكيد المسح
                </button>
                <button
                  onClick={() => setShowReset(false)}
                  className="h-9 px-4 text-xs font-bold rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
                >
                  {t('common.cancel')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowReset(true)}
                className="h-9 px-4 text-xs font-bold rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-950/40 transition-all"
              >
                إعادة ضبط الكل
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border/50 rounded-[2rem] p-6"
      >
        <h3 className="font-bold text-lg mb-2">معلومات النظام</h3>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p>إجمالي الوصفات الأساسية: {RECIPES.length}</p>
          <p>إجمالي التحديات الأساسية: {CHALLENGES.length}</p>
          <p>إجمالي الحكم الأساسية: {QUOTES.length}</p>
          <p>الخطط: {PLANS.length}</p>
          <p>يمكن تغييرها عبر متغير البيئة <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_ADMIN_PASSWORD</code></p>
        </div>
      </motion.div>
    </div>
  );
}
