"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { useCart } from "@/lib/cartStore";
import { PRODUCTS, formatSom } from "@/lib/i18n";

function useHydratedCart() {
  const store = useCart();
  useEffect(() => {
    store._hydrate();
  }, [store]);
  return store;
}

const DELIVERY_FEE = 10000;
const FREE_DELIVERY_MIN = 100000;

export function SlideOutCart() {
  const { lang, t } = useLang();
  const { items, removeItem, setQuantity, clearCart } = useHydratedCart();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = () => setOpen((o) => !o);
    window.addEventListener("toggle-cart", handler);
    return () => window.removeEventListener("toggle-cart", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted) return null;

  const cartProducts = items
    .map((item) => {
      const prod = PRODUCTS.find((p) => p.id === item.id);
      return prod ? { ...prod, quantity: item.quantity } : null;
    })
    .filter(Boolean) as (typeof PRODUCTS[number] & { quantity: number })[];

  const subtotal = cartProducts.reduce((s, p) => s + p.price * p.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-bark/40 backdrop-blur-sm z-[80] transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-cream z-[90] shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand">
          <h2 className="font-serif font-bold text-lg text-forest">{t.cart}</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-sand flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cartProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <span className="text-5xl mb-4">🧺</span>
            <p className="font-serif font-semibold text-forest text-lg">{t.cartEmpty}</p>
            <p className="text-sm text-bark-light mt-1 mb-6">{t.cartEmptySub}</p>
            <Link
              href="/#products"
              onClick={() => setOpen(false)}
              className="px-6 py-2.5 rounded-full bg-rust text-cream text-sm font-semibold hover:bg-rust-dark transition-colors"
            >
              {t.browseFruits}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {cartProducts.map((p) => (
                <div key={p.id} className="flex gap-3 p-3 rounded-2xl bg-white/70 border border-sand">
                  <img
                    src={p.image}
                    alt={p.name[lang]}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-forest truncate">{p.name[lang]}</h3>
                    <p className="text-xs font-mono text-gold-dim mt-0.5">
                      {formatSom(p.price, lang)} {t.perUnit} {p.unit[lang]}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => setQuantity(p.id, p.quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-sand-dark flex items-center justify-center text-bark hover:bg-sand transition-colors text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-mono font-semibold">{p.quantity}</span>
                      <button
                        onClick={() => setQuantity(p.id, p.quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-sand-dark flex items-center justify-center text-bark hover:bg-sand transition-colors text-sm font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(p.id)}
                        className="ml-auto text-xs text-bark-light hover:text-rust transition-colors"
                      >
                        {t.remove}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-mono font-semibold text-forest whitespace-nowrap">
                    {formatSom(p.price * p.quantity, lang)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-sand px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-bark-light">{t.subtotal}</span>
                <span className="font-mono font-semibold">{formatSom(subtotal, lang)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bark-light">{t.delivery}</span>
                <span className={`font-mono font-semibold ${deliveryFee === 0 ? "text-forest-lighter" : ""}`}>
                  {deliveryFee === 0 ? t.free : formatSom(deliveryFee, lang)}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[11px] text-forest-lighter">{t.freeAbove}</p>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-sand">
                <span>{t.total}</span>
                <span className="font-mono">{formatSom(total, lang)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-4 py-3 rounded-full border border-sand-dark text-bark-light text-sm font-medium hover:bg-sand transition-colors"
                >
                  {t.clearCart}
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-4 py-3 rounded-full bg-rust text-cream text-sm font-semibold hover:bg-rust-dark transition-colors"
                >
                  {t.proceedCheckout}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
