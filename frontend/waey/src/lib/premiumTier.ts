// Premium Tier Feature Flags & Client-Side Gating
// When Stripe is integrated, replace localStorage checks with server-validated tokens
import { getUserId, syncUserSettings } from "@/lib/supabaseStorage";

const PREMIUM_KEY = "waey_premium_tier";

export type PremiumTier = "free" | "plus" | "pro";

export interface PremiumState {
  tier: PremiumTier;
  activatedAt?: string;
}

export function getPremiumState(): PremiumState {
  try {
    const raw = localStorage.getItem(PREMIUM_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { tier: "free" };
}

export function setPremiumTier(tier: PremiumTier): void {
  localStorage.setItem(
    PREMIUM_KEY,
    JSON.stringify({ tier, activatedAt: new Date().toISOString() })
  );
  const uid = getUserId();
  if (uid) syncUserSettings(uid);
}

export function isPremiumFeature(feature: string): boolean {
  const state = getPremiumState();
  const premiumFeatures: Record<string, PremiumTier[]> = {
    ai_unlimited: ["plus", "pro"],
    export_excel: ["plus", "pro"],
    advanced_insights: ["pro"],
    priority_support: ["pro"],
    custom_themes: ["plus", "pro"],
    offline_sync: ["free", "plus", "pro"],
  };
  const required = premiumFeatures[feature];
  if (!required) return true; // not gated
  return required.includes(state.tier);
}

export interface TierFeature {
  name: string;
  nameKey: string;
  tier: PremiumTier;
  price: string;
  priceKey: string;
  features: string[];
  featureKeys: string[];
  highlighted: boolean;
}

export const TIER_FEATURES: TierFeature[] = [
  {
    name: "المجاني",
    nameKey: "premium.free",
    tier: "free" as PremiumTier,
    price: "٠ ج.م / شهرياً",
    priceKey: "premium.freePrice",
    features: [
      "تتبع العادات اليومية",
      "سلسلة الإنجازات",
      "مساعد ذكي (20 رسالة/يوم)",
      "تحدي 30 يوم",
      "نسخ احتياطي يدوي",
    ],
    featureKeys: [
      "premium.freeFeat1",
      "premium.freeFeat2",
      "premium.freeFeat3",
      "premium.freeFeat4",
      "premium.freeFeat5",
    ],
    highlighted: false,
  },
  {
    name: "بلس",
    nameKey: "premium.plus",
    tier: "plus" as PremiumTier,
    price: "٤٩ ج.م / شهرياً",
    priceKey: "premium.plusPrice",
    features: [
      "كل مميزات المجاني",
      "مساعد ذكي غير محدود",
      "تصدير Excel",
      "ثيمات مخصصة",
      "أولوية في الدعم",
    ],
    featureKeys: [
      "premium.plusFeat1",
      "premium.plusFeat2",
      "premium.plusFeat3",
      "premium.plusFeat4",
      "premium.plusFeat5",
    ],
    highlighted: true,
  },
  {
    name: "برو",
    nameKey: "premium.pro",
    tier: "pro" as PremiumTier,
    price: "٩٩ ج.م / شهرياً",
    priceKey: "premium.proPrice",
    features: [
      "كل مميزات بلس",
      "تحليلات متقدمة",
      "دعم أولوية VIP",
      "وصول مبكر للميزات الجديدة",
      "تقارير PDF مخصصة",
    ],
    featureKeys: [
      "premium.proFeat1",
      "premium.proFeat2",
      "premium.proFeat3",
      "premium.proFeat4",
      "premium.proFeat5",
    ],
    highlighted: false,
  },
];
