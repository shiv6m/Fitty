"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/outfits", label: "Outfits" },
  { href: "/explore", label: "Explore" },
  { href: "/saved", label: "Saved" },
  { href: "/settings", label: "Settings" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="relative flex items-center justify-around h-16 px-2">
        {tabs.slice(0, 2).map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`text-xs ${
              pathname === tab.href ? "text-black font-semibold" : "text-gray-400"
            }`}
          >
            {tab.label}
          </Link>
        ))}

        {/* Center + button, elevated above the bar */}
        <Link
          href="/add"
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-3xl shadow-lg"
        >
          +
        </Link>

        {tabs.slice(2).map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`text-xs ${
              pathname === tab.href ? "text-black font-semibold" : "text-gray-400"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
