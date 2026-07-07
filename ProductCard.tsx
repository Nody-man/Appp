"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/LangContext";
import { useCart } from "@/lib/cartStore";
import { useToastStore } from "./Toast";
import { type ProductData, formatSom } from "@/lib/i18n";

function useHydratedCart() {
  const store = useCart();
  useEffect(() => {
    store._hydrate();
  }, [store]);
  return store;
}

export function ProductCard({ product }: { product: ProductData }) {
  const { lang, t } = useLang();
  const { addItem, getQuantity, setQuantity } = useHydratedCart();
  const addToast = useToastStore((s) => s.addToast);
  const [mounted, setMounted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => setMounted(true), []);

  const qty = mounted ? getQuantity(product.id) : 0;

  const handleAdd = () => {
    addItem(product.id);
    setJustAdded(true);
    addToast(`${product.name[lang]} — ${t.added}`);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group bg-white rounded-2xl border border-sand hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <img
          src={product.image}
          alt={product.name[lang]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Price tag overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm border border-sand/50">
          <span className="font-mono text-sm font-bold text-forest">
            {formatSom(product.price, lang)}
          </span>
          <span className="font-mono text-[11px] text-bark-light ml-1">
            {t.perUnit} {product.unit[lang]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif font-semibold text-forest text-base leading-snug group-hover:text-forest-light transition-colors">
          {product.name[lang]}
        </h3>

        <div className="mt-auto pt-4">
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-full py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                justAdded
                  ? "bg-forest text-cream"
                  : "bg-rust text-cream hover:bg-rust-dark"
              }`}
            >
              {justAdded ? t.added : t.addToCart}
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-0 border border-sand-dark rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(product.id, qty - 1)}
                  className="w-9 h-9 flex items-center justify-center text-bark hover:bg-sand transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="w-8 text-center font-mono font-semibold text-sm">
                  {qty}
                </span>
                <button
                  onClick={() => {
                    setQuantity(product.id, qty + 1);
                    addToast(`${product.name[lang]} — ${t.added}`);
                  }}
                  className="w-9 h-9 flex items-center justify-center text-bark hover:bg-sand transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
              <span className="font-mono text-sm font-bold text-forest">
                {formatSom(product.price * qty, lang)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
