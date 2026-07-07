"use client";

import { create } from "zustand";
import { useEffect, useState } from "react";

interface ToastItem {
  id: number;
  message: string;
  leaving: boolean;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (msg: string) => void;
  removeToast: (id: number) => void;
  markLeaving: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, message, leaving: false }] }));
    setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
      }));
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, 300);
    }, 2200);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  markLeaving: (id) =>
    set((s) => ({
      toasts: s.toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    })),
}));

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-5 py-3 rounded-full bg-forest text-cream text-sm font-medium font-mono shadow-xl ${
            t.leaving ? "animate-toast-out" : "animate-toast-in"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
