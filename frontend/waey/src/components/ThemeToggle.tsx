import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { useT } from "@/contexts/useLanguage";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useT();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
      aria-label={t(theme === "light" ? "themeToggle.dark" : "themeToggle.light")}
    >
      {theme === "light" ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
    </button>
  );
}