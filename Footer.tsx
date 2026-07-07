"use client";

import { useLang } from "@/lib/LangContext";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-forest text-cream/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍊</span>
              <span className="font-serif font-bold text-xl text-cream">{t.brand}</span>
            </div>
            <p className="text-sm text-cream/50 leading-relaxed">
              {t.heroSub.split(".")[0]}.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold text-cream text-sm uppercase tracking-wider mb-3">
              {t.contact}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://wa.me/998906326422"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center gap-2"
                >
                  📱 +998 90 632 64 22
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/998933977573"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center gap-2"
                >
                  📱 +998 93 397 75 73
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/chimsatmotors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center gap-2"
                >
                  ✈️ @chimsatmotors
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-serif font-semibold text-cream text-sm uppercase tracking-wider mb-3">
              {t.deliveryHours}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>{t.monSat}</li>
              <li>{t.sun}</li>
              <li className="text-gold-light mt-2">🚚 {t.freeDeliveryNote}</li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="font-serif font-semibold text-cream text-sm uppercase tracking-wider mb-3">
              {t.findUs}
            </h3>
            <div className="rounded-xl overflow-hidden border border-cream/10 h-32">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1500!2d71.7880958!3d40.3913803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDDCsDIzJzI5LjAiTiA3McKwNDcnMTcuMSJF!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Toza Meva location"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/10 text-center text-xs text-cream/30">
          © 2025 TOZA MEVA. {t.allRights}.
        </div>
      </div>
    </footer>
  );
}
