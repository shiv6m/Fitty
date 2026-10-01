"use client";

import { useState } from "react";

// Initial value is read synchronously during the first client render instead
// of in a useEffect — the inline script in app/layout.tsx already sets the
// `dark` class on <html> before hydration, so this just has to agree with it.
// Reading it in an effect would setState synchronously on mount (a lint
// error: "Calling setState synchronously within an effect can trigger
// cascading renders"); suppressHydrationWarning below covers the one frame
// where this can legitimately differ from the server-rendered markup.
function getInitialIsDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialIsDark);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-between w-full px-4 py-3 rounded-lg border"
      style={{ borderColor: "var(--line)" }}
    >
      <span className="text-sm font-mono" suppressHydrationWarning>
        {isDark ? "Dark mode" : "Light mode"}
      </span>
      <span
        className="w-10 h-6 rounded-full relative transition-colors"
        style={{ background: isDark ? "var(--thread)" : "var(--line)" }}
        suppressHydrationWarning
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
          style={{ transform: isDark ? "translateX(18px)" : "translateX(2px)" }}
          suppressHydrationWarning
        />
      </span>
    </button>
  );
}
