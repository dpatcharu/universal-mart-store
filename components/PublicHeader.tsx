"use client";

import Link from "next/link";
import { useState } from "react";

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      {/* Top announcement bar */}
      <div className="bg-slate-950 px-4 py-2 text-center text-xs font-medium text-white">
        Handpicked deals across everyday products — shop smarter with Universal Mart
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="min-w-0">
            <div className="flex items-end gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-950 md:text-2xl">
                Universal<span className="text-orange-500">Mart</span>
              </span>
              <span className="pb-1 text-xs font-medium text-slate-400">
                LLC
              </span>
            </div>

            <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
              Curated finds. Better deals. Smarter shopping.
            </p>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {[
              ["Home", "/"],
              ["Shop", "/shop"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/shop"
            className="hidden rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 md:inline-flex"
          >
            Shop Deals
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg md:hidden">
            {[
              ["Home", "/"],
              ["Shop", "/shop"],
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Privacy / Disclosure", "/privacy"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}

            <Link
              href="/shop"
              className="block rounded-xl bg-orange-500 px-3 py-3 text-center text-sm font-bold text-white"
              onClick={() => setOpen(false)}
            >
              Shop Deals
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}