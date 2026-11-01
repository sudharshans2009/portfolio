"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("ssme-theme="))
      ?.split("=")[1] as Theme | undefined;
    const nextTheme = saved || "system";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  function applyTheme(nextTheme: Theme) {
    const isDark =
      nextTheme === "dark" ||
      (nextTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", isDark);
  }

  function cycleTheme() {
    const nextTheme: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
    document.cookie = `ssme-theme=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;
    applyTheme(nextTheme);
  }

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const label = `Theme: ${theme}. Switch to ${
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
  }`;

  return (
    <Button className="font-mono text-[.68rem] capitalize" variant="outline" size="sm" onClick={cycleTheme} aria-label={label}>
      <Icon size={14} aria-hidden="true" />
      <span>{theme}</span>
    </Button>
  );
}
