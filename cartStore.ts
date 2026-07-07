"use client";

import { create } from "zustand";
import { useEffect, useState } from "react";

export interface CartItem {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  _hydrated: boolean;
  _hydrate: () => void;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getQuantity: (id: string) => number;
}

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem("toza-cart");
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("toza-cart", JSON.stringify(items));
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  _hydrated: false,

  _hydrate: () => {
    if (get()._hydrated) return;
    const loaded = load();
    set({ items: loaded, _hydrated: true });
  },

  addItem: (id) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === id);
      const next = existing
        ? s.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...s.items, { id, quantity: 1 }];
      save(next);
      return { items: next };
    }),

  removeItem: (id) =>
    set((s) => {
      const next = s.items.filter((i) => i.id !== id);
      save(next);
      return { items: next };
    }),

  setQuantity: (id, qty) =>
    set((s) => {
      if (qty <= 0) {
        const next = s.items.filter((i) => i.id !== id);
        save(next);
        return { items: next };
      }
      const existing = s.items.find((i) => i.id === id);
      const next = existing
        ? s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
        : [...s.items, { id, quantity: qty }];
      save(next);
      return { items: next };
    }),

  clearCart: () => {
    save([]);
    set({ items: [] });
  },

  getQuantity: (id) => {
    const item = get().items.find((i) => i.id === id);
    return item ? item.quantity : 0;
  },
}));

// Hook to ensure cart is hydrated on client
export function useHydratedCart() {
  const store = useCart();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    store._hydrate();
    setHydrated(true);
  }, [store]);

  return { ...store, hydrated };
}
