"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const t = saved ?? "light";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="flex h-7 w-12 items-center rounded-full px-0.5 transition-all border-dim hover:border-dim-hover"
      style={{ background: "var(--bg-2)" }}>
      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] transition-all duration-300 border-dim"
        style={{
          background: "var(--card-bg)",
          transform: theme === "dark" ? "translateX(20px)" : "translateX(0)",
        }}>
        {theme === "light" ? "○" : "●"}
      </span>
    </button>
  );
}