"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full max-w-7xl mx-auto py-6 px-6 md:px-12 flex items-center justify-between font-mono">
      <div className="flex items-center gap-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-400 group-hover:border-amber-500/60 transition-all shadow-[0_0_15px_rgba(229,164,17,0.15)]">
            K
          </div>
          <span className="font-mono text-xl font-bold tracking-tight text-neutral-100 group-hover:text-amber-400 transition-colors">
            TypeKing
          </span>
        </Link>
      </div>

      <nav className="flex items-center gap-1.5 bg-neutral-900/70 border border-neutral-800/70 px-2 py-1 rounded-full text-xs font-mono backdrop-blur-md">
        <Link
          href="/"
          className={`px-5 py-1.5 rounded-full transition-all ${
            pathname === "/"
              ? "bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30"
              : "text-neutral-400 hover:text-neutral-200 border border-transparent"
          }`}
        >
          solo
        </Link>
        <Link
          href="/multiplayer"
          className={`px-5 py-1.5 rounded-full transition-all ${
            pathname === "/multiplayer"
              ? "bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30"
              : "text-neutral-400 hover:text-neutral-200 border border-transparent"
          }`}
        >
          multiplayer
        </Link>
      </nav>

      <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
        <a
          href="https://github.com/harsh-mishra123"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          title="GitHub Profile"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
