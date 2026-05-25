"use client";

/**
 * Office gallery section with horizontal scroll.
 * Displays office/workspace images in a scrollable horizontal layout.
 */

import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

const officeImages = [
  { id: 1, url: "/Alabasta.jpg", title: "Alabasta" },
  { id: 2, url: "/dressrosa.jpg", title: "Dressrosa" },
  { id: 3, url: "/egghead.jpg", title: "Egghead" },
  { id: 4, url: "/wanokuni.jpg", title: "Wano Kuni" },
  { id: 5, url: "water7.jpg", title: "Water Seven" },
  { id: 6, url: "zou.jpg", title: "Zou Island" },
];

export default function OfficeGallery() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-blue-600 font-semibold tracking-wider uppercase text-sm"
        >
          {t("gallery.explore")}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 mt-2"
        >
          {t("gallery.title")}
        </motion.h2>
      </div>

      {/* Area Scroll Horizontal */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex overflow-x-auto gap-8 px-6 md:px-[calc((100vw-1280px)/2+24px)] scrollbar-hide snap-x"
      >
        {officeImages.map((image) => (
          <div
            key={image.id}
            className="min-w-50 h-70 md:min-w-60 md:h-80 snap-center shrink-0"
          >
            <div className="relative w-full h-full group overflow-hidden rounded-[2rem] shadow-xl">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay Teks */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div>
                  <p className="text-white/70 text-sm mb-1 uppercase tracking-widest">
                    {t("gallery.place")}
                  </p>
                  <h3 className="text-white text-2xl font-bold">
                    {image.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
