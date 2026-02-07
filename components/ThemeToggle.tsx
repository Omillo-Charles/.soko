"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/5 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex flex-col items-center group transition-colors text-slate-50"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 transition-colors group-hover:text-primary" />
      ) : (
        <Moon className="w-6 h-6 transition-colors group-hover:text-primary" />
      )}
      <span className="hidden md:block text-xs mt-1 font-medium text-slate-400 group-hover:text-primary transition-colors">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
