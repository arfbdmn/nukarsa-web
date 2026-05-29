"use client";

/**
 * Main landing page component for the Nukarsa marketing site.
 * Includes: Hero, About, Value Props, Services, Our Clients, Gallery, Team, Contact, and Footer sections.
 */

import Image from "next/image";
import OfficeGallery from "@/components/OfficeGallery";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { clients } from "@/lib/data/clients";

export default function LandingPage() {
  const { t } = useLanguage();

  const teamMembers = [
    { name: "Gerry Affero Wibawa, S.H", role: "Director", image: "/Gerry.png" },
    { name: "Ervina Syahputri", role: "Project Director", image: "/Ervina.png" },
    { name: "Ain Tania", role: "Marketing Communication", image: "/Ain.png" },
  ];

  const allServices = [
    {
      category: "Visa Services",
      items: [
        { name: "Visa VoA", id: "visa", desc: "Visa on Arrival for tourism or social visits." },
        { name: "Visa C2", id: "visa", desc: "visa for business affairs, meetings, and purchasing goods.." },
        { name: "Visa D2", id: "visa", desc: "Limited stay visa for investment and employment purposes.." },
      ],
    },
    {
      category: "Residence Permits",
      items: [
        { name: "Working KITAS (E23)", id: "kitas", desc: "Limited stay permit for foreign workers." },
        { name: "Investment KITAS (E28A)", id: "kitas", desc: "Residence permit for foreign investors in Indonesia." },
        { name: "Bridging Visa", id: "kitas", desc: "Temporary stay permit while waiting for a new visa decision." },
      ],
    },
    {
      category: "Corporate & Legal",
      items: [
        { name: "Company Establishment PT / CV", id: "legal", desc: "Company establishment services and other business licenses." },
        { name: "Naturalization", id: "legal", desc: "The process of changing citizenship from a foreign national to an Indonesian citizen." },
        { name: "Passport Management", id: "legal", desc: "Passport handling and management services for expatriates." },
        { name: "HKI", id: "legal", desc: "Corporate copyright and intellectual property registration services." },
        { name: "Virtual Office", id: "legal", desc: "Virtual office services for international businesses." },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <header className="bg-slate-900 py-40 md:py-48 px-6 text-center text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/*
            ── NUKARSA HERO LOGO ──────────────────────────────────────
            File path  : public/brand/nukarsa-hero-logo.png  (or .svg)
            Usage      : Large hero/brand identity mark, centered
            Dimensions : width={240} height={64} — scale up for large hero sections
            Variants   : Consider a transparent/white SVG for overlay on dark hero bg
            To activate: Replace src="/placeholder-hero-logo.png" with real asset
            ──────────────────────────────────────────────────────────── 
          */}
          <div className="flex justify-center mb-6">
            <Image
              src="/brand/LNUKARSA.png"
              alt="Nukarsa"
              width={500}
              height={300}
              priority
              className="object-contain"
            />
          </div>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto italic font-light px-4">
            {t("hero.tagline")}
          </p>
        </motion.div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
      </header>

      {/* 2. ABOUT US SECTION */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">
                {t("about.badge")}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                {t("about.heading")}
              </h3>
              <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed">
                {t("about.p1")}
              </p>

              <div className="space-y-6">
                {[
                  { num: "01", title: t("about.val1_title"), desc: t("about.val1_desc") },
                  { num: "02", title: t("about.val2_title"), desc: t("about.val2_desc") },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.2 }}
                    viewport={{ once: true }}
                    className="flex gap-4 group"
                  >
                    <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {item.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual Container (Responsif & Anti Pecah di HP) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 relative group px-2 md:px-0"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 md:h-[30rem] w-full">
                <Image
                  src="/Sabaody.jpg"
                  alt="Nukarsa Office"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 md:group-hover:scale-110"
                />
                <Link href="/about">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    whileTap={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer"
                  >
                    <motion.p
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-white font-bold border-2 border-white px-6 py-2 rounded-full uppercase tracking-widest text-sm"
                    >
                      {t("about.btn_profile")}
                    </motion.p>
                  </motion.div>
                </Link>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-slate-100 z-10"
              >
                <p className="text-2xl md:text-4xl font-bold text-blue-600 italic">2025</p>
                <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">
                  {t("about.floating_badge")}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-6 lg:px-8">
          {[
            { icon: "⚡", title: t("values.speed_title"), desc: t("values.speed_desc") },
            { icon: "💼", title: t("values.prof_title"), desc: t("values.prof_desc") },
            { icon: "💰", title: t("values.price_title"), desc: t("values.price_desc") },
          ].map((val, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              whileTap={{ y: -5 }}
              className="p-8 md:p-10 bg-white rounded-3xl shadow-sm border border-slate-100 text-center transition-all hover:shadow-lg"
            >
              <div className="text-3xl md:text-4xl mb-4">{val.icon}</div>
              <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2">{val.title}</h3>
              <p className="text-slate-500 text-sm">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. SERVICES SECTION (SWIPEABLE DI HP, GRID DI LAPTOP) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t("services.heading")}</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
              {t("services.desc")}
            </p>
          </motion.div>

          {/* Wrapper Responsif: Mengizinkan horizontal scroll hanya di layar HP (-mx-6 px-6 snap-x) */}
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 snap-x scrollbar-hide">
            {allServices.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 min-w-[280px] sm:min-w-[340px] md:min-w-0 snap-center shrink-0"
              >
                <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  {service.category}
                </h3>

                <ul className="space-y-6">
                  {service.items.map((item, i) => (
                    <li key={i} className="group">
                      <Link href={`/services#${item.id}`}>
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
                          {item.name}
                          <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </h4>
                      </Link>
                      <p className="text-xs md:text-sm text-slate-500 mt-1">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR CLIENTS SECTION */}
      <section className="py-16 md:py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("clients.section_title")}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
              {t("clients.section_subtitle")}
            </p>
          </motion.div>

          {/* Desktop: Auto-scrolling marquee */}
          <div className="hidden md:block overflow-hidden">
            <div className="animate-marquee flex gap-8 w-max">
              {/* Duplicate the list to create seamless loop */}
              {[...clients, ...clients].map((client, idx) => (
                <div
                  key={`${client.id}-${idx}`}
                  className="group relative flex-shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 w-[200px] flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
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
                    className="object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  />

                  {/* Tooltip (Tailwind-only) */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                    <p className="text-white font-bold text-sm">{client.name}</p>
                    <p className="text-slate-400 text-xs">{client.industry}</p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-slate-800 border-r border-b border-slate-700"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Static 2-column grid */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {clients.map((client) => (
              <div
                key={client.id}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
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
                  className="object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                />

                {/* Tooltip (Tailwind-only) */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                  <p className="text-white font-bold text-sm">{client.name}</p>
                  <p className="text-slate-400 text-xs">{client.industry}</p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-slate-800 border-r border-b border-slate-700"></div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Clients Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              href="/clients"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors min-h-[44px]"
            >
              {t("clients.view_all")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 6. OFFICE GALLERY */}
      <OfficeGallery />

      {/* 7. MEET OUR TEAM */}
      <section className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("team.heading")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-44 h-44 md:w-56 md:h-56 mx-auto mb-6 relative rounded-full border-4 border-slate-700 overflow-hidden group-hover:border-blue-500 transition-all duration-500">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 176px, 224px"
                    className="object-cover md:group-hover:scale-110 transition-transform duration-700 md:grayscale md:group-hover:grayscale-0"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">{member.name}</h3>
                <p className="text-blue-400 font-medium mt-1 text-sm md:text-base">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT & FOOTER */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("contact.heading")}</h2>
          <p className="text-slate-500 mb-12 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("contact.desc")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-6 md:p-8 bg-slate-50 rounded-3xl hover:bg-blue-50 transition-all duration-300 cursor-pointer min-h-[44px]">
              <h4 className="font-bold text-blue-600 mb-2">Email</h4>
              <p className="font-semibold text-slate-900 text-sm md:text-base">nukarsa.co@gmail.com</p>
            </div>
            <div className="p-6 md:p-8 bg-slate-50 rounded-3xl hover:bg-blue-50 transition-all duration-300 cursor-pointer min-h-[44px]">
              <h4 className="font-bold text-blue-600 mb-2">Contact Person</h4>
              <p className="font-semibold text-slate-900 text-sm md:text-base">0856-9998-331</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-4">PT. KARSA RUANG NUSANTARA (NUKARSA)</h3>
            <p className="text-slate-400 mb-6 text-xs md:text-sm leading-relaxed">
              {t("footer.company_desc")}
            </p>
            <div className="space-y-2 text-[11px] md:text-xs text-slate-500">
              <p>Akte Pendirian: 16 Juli 2025 (Notaris Mohammad Fahroji, S.H, M.Kn)</p>
              <p>SK Kemenkumham: AHU-0058463.AH.01.01.TAHUN 2025</p>
              <p>Nomor Induk Berusaha (NIB): 1607250088288</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold">{t("contact.info_title")}</h3>
            <p className="text-slate-400 text-sm">{t("contact.info_desc")}</p>
            <ul className="text-slate-350 space-y-2 text-sm">
              <li>📧 nukarsa.co@gmail.com</li>
              <li>📞 CP: 0856-9998-331</li>
              <li>🔗 linkedin.com/company/nukarsa</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12 md:mt-20 pt-8 border-t border-slate-800 text-slate-600 text-xs md:text-sm">
          © 2026 NUKARSA. {t("footer.rights")}
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/6289518024088"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-green-500 text-white p-4 md:p-5 rounded-full shadow-2xl z-50 flex items-center group transition-all duration-300 min-h-[44px] min-w-[44px]"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 whitespace-nowrap font-bold text-xs md:text-sm">
          Chat Admin Nukarsa
        </span>
        <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-9 md:h-9 ml-0 group-hover:ml-2 transition-all duration-300" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.982-.363-1.747-.756-2.879-2.506-2.966-2.62-.088-.117-.715-.951-.715-1.814s.448-1.288.608-1.452c.16-.163.346-.204.461-.204.115 0 .231.001.329.005.102.003.239-.038.373.287.144.351.492 1.202.535 1.287.043.085.071.184.014.298-.057.114-.085.184-.171.284-.085.1-.184.225-.262.305-.085.086-.176.179-.076.353.101.171.447.737.96 1.192.66.586 1.216.768 1.391.853.175.085.278.071.382-.047.103-.118.447-.52.565-.697.119-.177.237-.148.397-.089.16.059 1.016.48 1.193.568.177.089.296.134.339.208.043.073.043.424-.101.829z" />
        </svg>
      </motion.a>
    </div>
  );
}