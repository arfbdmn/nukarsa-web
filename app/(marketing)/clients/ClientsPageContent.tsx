"use client";

/**
 * Interactive content for the /clients directory page.
 * Displays client cards in a responsive glassmorphic grid with Tailwind-only tooltips.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import { clients } from "@/lib/data/clients";

export function ClientsPageContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Hero Header */}
      <section className="bg-slate-900 py-24 text-white text-center relative overflow-hidden">
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              {t("clients.page_title")}
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg italic">
              {t("clients.page_subtitle")}
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Client Cards Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, idx) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                {/* Tooltip (Tailwind-only) */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                  <p className="text-white font-bold text-sm">{client.name}</p>
                  <p className="text-slate-400 text-xs">{client.industry}</p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-slate-800 border-r border-b border-slate-700"></div>
                </div>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                  {/*
                    ── CLIENT LOGO ASSET ──────────────────────────────────────
                    File path : public/clients/{client-name-slug}.svg
                    Recommended: SVG format, white/transparent version for dark bg
                    Dimensions : width={120} height={40} (adjust per actual aspect ratio)
                    Swap src   : Replace the src prop below with the real asset path
                    ────────────────────────────────────────────────────────── 
                  */}
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={120}
                    height={40}
                    className="object-contain opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>

                {/* Company Name */}
                <h3 className="text-white font-bold text-lg mb-2 text-center break-words">
                  {client.name}
                </h3>

                {/* Industry Pill */}
                <div className="flex justify-center mb-4">
                  <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                    {client.industry}
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm text-center leading-relaxed break-words">
                  {client.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
