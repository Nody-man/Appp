"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { useCart } from "@/lib/cartStore";
import { LANG_LABELS, type Lang } from "@/lib/i18n";

// Hydrate cart on mount
function useHydratedCart() {
  const store = useCart();
  useEffect(() => {
    store._hydrate();
  }, [store]);
  return store;
}

const LANGS: Lang[] = ["en", "ru", "uz"];

export function Navbar() {
  const { lang, setLang, t } = useLang();
  const store = useHydratedCart();
  const items = store.items;
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const count = mounted ? items.reduce((s, i) => s + i.quantity, 0) : 0;

  // We use a global event to toggle cart from Navbar
  const toggleCart = () => {
    window.dispatchEvent(new CustomEvent("toggle-cart"));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm border-b border-sand"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl">🍊</span>
            <div className="flex flex-col leading-none">
              <span className="text-base sm:text-lg font-serif font-bold text-forest tracking-tight">
                {t.brand}
              </span>
              <span className="text-[10px] font-mono text-gold-dim uppercase tracking-[0.2em]">
                {t.tagline}
              </span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language switcher */}
            <div className="flex items-center rounded-full border border-sand-dark bg-cream-dark/60 overflow-hidden">
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1.5 text-[11px] font-mono font-semibold tracking-wide transition-all ${
                    lang === l
                      ? "bg-forest text-cream"
                      : "text-bark-light hover:bg-sand"
                  }`}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>

            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rust text-cream text-sm font-semibold hover:bg-rust-dark active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden sm:inline">{t.cart}</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold text-bark text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
