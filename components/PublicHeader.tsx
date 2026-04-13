"use client";

import Link from "next/link";
import { useState } from "react";

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="block">
            <div className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              Universal Mart LLC
            </div>
            <p className="mt-1 text-xs text-slate-500 md:text-sm">
              Curated finds. Better deals. Smarter shopping.
            </p>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-black hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-black hover:text-white"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-black hover:text-white"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-black hover:text-white"
            >
              Contact
            </Link>
          </nav>

          <button
            type="button"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>

        {open && (
          <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-white p-3 md:hidden">
            <Link
              href="/"
              className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Privacy / Disclosure
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}