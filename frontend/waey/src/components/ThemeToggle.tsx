import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <div
      role="switch"
      aria-checked={dark}
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={`relative flex w-[74px] items-center rounded-full p-1.5 cursor-pointer transition-colors duration-500 select-none
        border border-white/40 dark:border-white/10
        shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_16px_-6px_rgba(92,112,82,0.35)]
        bg-gradient-to-br from-white/50 to-white/10 dark:from-[#2a2417]/60 dark:to-[#211c12]/40
        backdrop-blur-xl`}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
        <span
          className={`absolute inset-0 transition-opacity duration-700
            bg-gradient-to-tr from-emerald-200/60 via-[#efe6d3]/50 to-leaf-light/60
            ${dark ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`absolute inset-0 transition-opacity duration-700
            bg-gradient-to-tr from-[#2a2417]/80 via-[#1f1a10]/70 to-[#332c1c]/60
            ${dark ? "opacity-100" : "opacity-0"}`}
        />
      </span>

      <span className="pointer-events-none relative z-10 flex items-center justify-between w-full px-1">
        <span
          className={`grid place-items-center size-6 transition-all duration-500
            ${dark ? "opacity-40 scale-90 text-amber-200" : "opacity-100 text-amber-600"}`}
        >
          <Sun className="size-5" />
        </span>
        <span
          className={`grid place-items-center size-6 transition-all duration-500
            ${dark ? "opacity-100 text-white" : "opacity-40 scale-90 text-white"}`}
        >
          <Moon className="size-5" />
        </span>
      </span>

      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute top-0.5 size-8 rounded-full z-10
          bg-gradient-to-br from-white via-[#f7f2e6] to-[#ece3d1] dark:from-[#4a4130] dark:via-[#3a3425] dark:to-[#2c271b]
          shadow-[0_2px_8px_rgba(93,112,82,0.3),inset_0_-2px_4px_rgba(93,94,70,0.18)]
          ${dark ? "right-1.5" : "left-1.5"}`}
      />
    </div>
  );
}