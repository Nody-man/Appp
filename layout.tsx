import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "TOZA MEVA — Свежие фрукты | Фергана",
  description: "Свежие фрукты с доставкой на дом в Ферганской долине. Лучшие местные и импортные фрукты.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=IBM+Plex+Mono:wght@400;500;600&family=Work+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-bark font-sans antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
