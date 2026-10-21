import { useTheme } from "@/hooks/useTheme";

/**
 * The theme toggle. Its label is passed in so the navbar can localise it
 * (the default keeps the standalone behaviour for any other caller).
 * The 44px target comes from `size-11`, which overrides the 2.5rem in the
 * `.theme-toggle` class — the utilities layer wins over the components layer.
 */
export function ThemeToggle({ label }: { label?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label ?? "Toggle dark mode"}
      title={label ?? "Toggle theme"}
      className="theme-toggle size-11"
    >
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}

export default ThemeToggle;
