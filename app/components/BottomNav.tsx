"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0"
      style={{ background: "var(--paper)", borderTop: "1.5px dashed var(--line)" }}
    >
      <div className="relative flex items-center justify-around h-16 px-2">
        <Link
          href="/outfits"
          className="text-xs font-mono uppercase tracking-wide"
          style={{
            color: pathname === "/outfits" ? "var(--ink)" : "var(--muted)",
            fontWeight: pathname === "/outfits" ? 600 : 400,
          }}
        >
          Profile
        </Link>

        <Link
          href="/add"
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full flex items-center justify-center text-3xl text-white shadow-lg"
          style={{ background: "var(--thread)" }}
        >
          +
        </Link>

        <Link
          href="/explore"
          className="text-xs font-mono uppercase tracking-wide"
          style={{
            color: pathname === "/explore" ? "var(--ink)" : "var(--muted)",
            fontWeight: pathname === "/explore" ? 600 : 400,
          }}
        >
          Explore
        </Link>
      </div>
    </nav>
  );
}
