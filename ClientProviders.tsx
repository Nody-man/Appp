"use client";

import type { ReactNode } from "react";
import { LangProvider } from "@/lib/LangContext";
import { Navbar } from "./Navbar";
import { SlideOutCart } from "./SlideOutCart";
import { Footer } from "./Footer";
import { ToastContainer } from "./Toast";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <SlideOutCart />
      <Footer />
      <ToastContainer />
    </LangProvider>
  );
}
