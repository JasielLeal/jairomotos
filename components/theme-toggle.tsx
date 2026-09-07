"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // Starts "light" so the server render and the client's first (pre-hydration)
  // render match exactly — the real value (localStorage/system preference)
  // only exists in the browser and would otherwise cause a hydration mismatch.
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Syncs from a client-only source (the DOM class set by the inline
    // script in app/layout.tsx) after hydration — deliberate, not derivable during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Ignore — theme just won't persist across reloads.
    }
  }

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
