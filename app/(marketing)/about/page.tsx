"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  const values = [
    {
      title: "Integritas",
      desc: "Menjamin setiap proses mematuhi regulasi keimigrasian yang berlaku di Indonesia.",
      icon: "⚖️",
    },
    {
      title: "Akurasi",
      desc: "Ketepatan dalam setiap pendokumentasian dan manajemen legalitas klien.",
      icon: "🎯",
    },
    {
      title: "Kerahasiaan",
      desc: "Menjaga data privasi ekspatriat dan perusahaan dengan standar keamanan tinggi.",
      icon: "🔒",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header Section */}
      <section className="bg-slate-900 py-24 text-white text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Profil Perusahaan
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg italic">
            Menjadi mitra terpercaya dalam menjaga status hukum ekspatriat dan
            bisnis mereka di Indonesia.
          </p>
        </motion.div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
              Who We Are
            </h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              PT. Karsa Ruang Nusantara (NUKARSA)
            </h3>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Nukarsa adalah perusahaan jasa profesional yang mengkhususkan
                diri dalam penyediaan layanan imigrasi dan manajemen dokumentasi
                hukum bagi warga negara asing di Indonesia.
              </p>
              <p>
                Kami memahami bahwa prosedur hukum bisa terasa kompleks. Oleh
                karena itu, didukung oleh pengalaman dan dedikasi, kami
                menghadirkan solusi andal yang menyederhanakan setiap langkah
                bagi klien kami.
              </p>
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 relative"
          >
            <div className="aspect-4/5 relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/Sabaody.jpg"
                alt="Tentang Nukarsa"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Komitmen Kami</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 block">
                  {val.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {val.title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 text-center px-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-8">
          Memberikan ketenangan pikiran untuk fokus pada pertumbuhan bisnis
          Anda.
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-blue-200"
        >
          Hubungi Kami Sekarang
        </motion.button>
      </section>
    </div>
  );
}
