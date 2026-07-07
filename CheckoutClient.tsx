"use client";

import { useState, useEffect } from "react";
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

export function CheckoutClient() {
  const { lang, t } = useLang();
  const { items, clearCart } = useHydratedCart();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "+998 ",
    deliveryMethod: "delivery" as "delivery" | "pickup",
    address: "",
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const cartProducts = items
    .map((item) => {
      const prod = PRODUCTS.find((p) => p.id === item.id);
      return prod ? { ...prod, quantity: item.quantity } : null;
    })
    .filter(Boolean) as (typeof PRODUCTS[number] & { quantity: number })[];

  const subtotal = cartProducts.reduce((s, p) => s + p.price * p.quantity, 0);
  const deliveryFee = form.deliveryMethod === "pickup" ? 0 : (subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE);
  const total = subtotal + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          deliveryMethod: form.deliveryMethod,
          address: form.deliveryMethod === "delivery" ? form.address : "",
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });
      if (!res.ok) {
        throw new Error("Order failed");
      }
      const data = await res.json();
      setOrderId(data.id);
      clearCart();
      setStep("success");
    } catch {
      setErrorMsg(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="pt-24 sm:pt-28 pb-20 max-w-lg mx-auto px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-forest/10 flex items-center justify-center mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-forest mb-2">{t.orderPlaced}</h1>
        <p className="font-mono text-gold-dim text-lg mb-2">
          {t.orderNumber}{orderId}
        </p>
        <p className="text-sm text-bark-light mb-8">{t.thankYou}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-rust text-cream font-semibold text-sm hover:bg-rust-dark transition-colors"
        >
          {t.continueShopping}
        </Link>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="pt-24 sm:pt-28 pb-20 max-w-lg mx-auto px-4 text-center">
        <span className="text-5xl mb-4 block">🧺</span>
        <h1 className="font-serif text-2xl font-bold text-forest mb-2">{t.cartEmpty}</h1>
        <p className="text-sm text-bark-light mb-6">{t.cartEmptySub}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-rust text-cream font-semibold text-sm hover:bg-rust-dark transition-colors"
        >
          {t.browseFruits}
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-bark-light hover:text-forest transition-colors mb-6">
        {t.backToShopping}
      </Link>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight mb-8">
        {t.checkout}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-sand p-5 sm:p-7 space-y-4">
              <h2 className="font-serif font-semibold text-lg text-forest">{t.yourOrder}</h2>

              <div>
                <label className="block text-sm font-medium text-bark mb-1.5">{t.fullName} *</label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder={t.fullNamePh}
                  className="w-full px-4 py-3 border border-sand-dark rounded-xl text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bark mb-1.5">{t.phone} *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t.phonePh}
                  className="w-full px-4 py-3 border border-sand-dark rounded-xl text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bark mb-1.5">{t.deliveryMethod} *</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, deliveryMethod: "delivery" })}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      form.deliveryMethod === "delivery"
                        ? "border-forest bg-forest/5 text-forest"
                        : "border-sand-dark text-bark-light hover:border-gold"
                    }`}
                  >
                    🚚 {t.deliveryOption}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, deliveryMethod: "pickup" })}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      form.deliveryMethod === "pickup"
                        ? "border-forest bg-forest/5 text-forest"
                        : "border-sand-dark text-bark-light hover:border-gold"
                    }`}
                  >
                    📍 {t.pickupOption}
                  </button>
                </div>
              </div>

              {form.deliveryMethod === "delivery" && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-medium text-bark mb-1.5">{t.address} *</label>
                  <textarea
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder={t.addressPh}
                    rows={3}
                    className="w-full px-4 py-3 border border-sand-dark rounded-xl text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  />
                </div>
              )}

              {form.deliveryMethod === "pickup" && (
                <p className="text-xs text-forest-lighter bg-forest/5 px-4 py-3 rounded-xl animate-fade-in-up">
                  {t.pickupAddress}
                </p>
              )}
            </div>

            <p className="text-xs text-bark-light text-center">{t.cashOnDelivery}</p>

            {errorMsg && (
              <p className="text-sm text-rust text-center font-medium bg-rust/5 px-4 py-3 rounded-xl">{errorMsg}</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-white rounded-2xl border border-sand p-5 sm:p-7">
              <h2 className="font-serif font-semibold text-lg text-forest mb-5">{t.orderSummary}</h2>

              <div className="space-y-3 mb-5">
                {cartProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name[lang]}
                      className="w-11 h-11 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-forest truncate">{p.name[lang]}</p>
                      <p className="text-xs font-mono text-bark-light">
                        {p.quantity} × {formatSom(p.price, lang)}
                      </p>
                    </div>
                    <p className="text-sm font-mono font-semibold text-forest whitespace-nowrap">
                      {formatSom(p.price * p.quantity, lang)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-sand pt-4 space-y-2">
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
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-sand">
                  <span className="font-serif">{t.total}</span>
                  <span className="font-mono">{formatSom(total, lang)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 py-3.5 rounded-full bg-rust text-cream font-semibold text-sm hover:bg-rust-dark active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t.placingOrder}
                  </>
                ) : (
                  <>
                    {t.placeOrder} — {formatSom(total, lang)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
