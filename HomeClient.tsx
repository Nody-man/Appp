"use client";

import { useLang } from "@/lib/LangContext";
import { PRODUCTS } from "@/lib/i18n";
import { ProductCard } from "./ProductCard";

export function HomeClient() {
  const { t } = useLang();

  return (
    <>
      {/* Hero section */}
      <section className="relative overflow-hidden pt-16 sm:pt-18">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/36748357/pexels-photo-36748357.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/92 via-forest/80 to-forest/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 lg:py-40">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream/10 border border-cream/20 mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] font-mono font-medium text-cream/80 uppercase tracking-wider">
                Fergana Valley 🇺🇿
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-[1.1] tracking-tight animate-fade-in-up stagger-1 whitespace-pre-line">
              {t.heroTitle}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-cream/70 leading-relaxed max-w-md animate-fade-in-up stagger-2">
              {t.heroSub}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up stagger-3">
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-rust text-cream font-semibold text-sm hover:bg-rust-dark active:scale-95 transition-all shadow-lg shadow-rust/30"
              >
                {t.shopNow}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              <a
                href="https://wa.me/998906326422"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-cream/10 text-cream font-medium text-sm border border-cream/20 hover:bg-cream/20 transition-all"
              >
                💬 WhatsApp
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up stagger-4">
              <div className="flex items-center gap-2 text-cream/50 text-xs font-mono">
                <span>🚚</span> {t.freeDeliveryNote}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section id="products" className="py-16 sm:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              {t.ourFruits}
            </h2>
            <p className="text-sm text-bark-light mt-2 max-w-md mx-auto">
              {t.ourFruitsSub}
            </p>
            <div className="mt-4 w-16 h-1 rounded-full bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {PRODUCTS.map((product, i) => (
              <div key={product.id} className={`animate-fade-in-up stagger-${Math.min(i % 5 + 1, 5)}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
