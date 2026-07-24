import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, Ambulance, Shield, Flame, Truck, Heart, X } from "lucide-react";

const EMERGENCY_NUMBERS = [
  { label: "الإسعاف", number: "123", icon: Ambulance, color: "text-red-500", bg: "bg-red-500/10" },
  { label: "الشرطة", number: "122", icon: Shield, color: "text-blue-600", bg: "bg-blue-600/10" },
  { label: "المطافئ", number: "180", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "النجدة", number: "112", icon: PhoneCall, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "خط المساعدة النفسية", number: "19201", icon: Heart, color: "text-primary", bg: "bg-primary/10" },
  { label: "سموم", number: "16001", icon: Truck, color: "text-amber-600", bg: "bg-amber-600/10" },
];

export function EmergencyAccess() {
  const [open, setOpen] = useState(false);

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, "_self");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-destructive text-destructive-foreground shadow-float-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
        aria-label="أرقام الطوارئ"
      >
        <PhoneCall className="size-6" />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-card border border-border rounded-3xl w-full max-w-sm p-6 shadow-float-lg"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <PhoneCall className="size-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">أرقام الطوارئ</h2>
                    <p className="text-xs text-muted-foreground">خدمات الطوارئ في مصر</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="size-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-2">
                {EMERGENCY_NUMBERS.map((item) => (
                  <button
                    key={item.number}
                    onClick={() => handleCall(item.number)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-muted/40 hover:bg-muted/80 transition-all border border-border/40 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-9 rounded-full ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`size-4.5 ${item.color}`} />
                      </div>
                      <span className="text-sm font-bold">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold text-destructive group-hover:scale-110 transition-transform" dir="ltr">
                      {item.number}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground text-center mt-4 leading-relaxed">
                هذه الأرقام متاحة 24 ساعة طوال أيام الأسبوع. اتصل فوراً في حالات الطوارئ الحقيقية.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}