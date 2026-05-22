"use client";

import Image from "next/image";
import OfficeGallery from "@/components/OfficeGallery";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  const teamMembers = [
    { name: "Gerry Affero Wibawa, S.H", role: "Director", image: "/Gerry.png" },

    {
      name: "Ervina Syahputri",
      role: "Project Director",
      image: "/Ervina.png",
    },

    { name: "Ain Tania", role: "Marketing Communication", image: "/Ain.png" },
  ];

  const allServices = [
    {
      category: "Visa Services",
      items: [
        {
          name: "Visa VoA",
          id: "visa",
          desc: "Visa on Arrival untuk kunjungan pariwisata atau sosial.",
        },

        {
          name: "Visa C2",
          id: "visa",
          desc: "Visa kunjungan untuk urusan bisnis, pertemuan, dan pembelian barang.",
        },

        {
          name: "Visa D2",
          id: "visa",
          desc: "Visa tinggal terbatas untuk kebutuhan investasi dan kerja.",
        },
      ],
    },

    {
      category: "Residence Permits",
      items: [
        {
          name: "Working KITAS (E23)",
          id: "kitas",
          desc: "Izin tinggal terbatas untuk tenaga kerja asing.",
        },

        {
          name: "Investment KITAS (E28A)",
          id: "kitas",
          desc: "Izin tinggal bagi investor asing di Indonesia.",
        },

        {
          name: "Bridging Visa",
          id: "kitas",
          desc: "Izin tinggal sementara saat menunggu keputusan visa baru.",
        },
      ],
    },

    {
      category: "Corporate & Legal",

      items: [
        {
          name: "Company Establishment PT / CV",
          id: "legal",
          desc: "Layanan pendirian perusahaan dan izin usaha lainnya.",
        },

        {
          name: "Naturalization",
          id: "legal",
          desc: "Proses perubahan kewarganegaraan dari Warga Negara Asing menjadu Warga Negara Indonesia.",
        },

        {
          name: "Passport Management",
          id: "legal",
          desc: "Pengurusan dan manajemen paspor bagi ekspatriat.",
        },

        {
          name: "HKI",
          id: "legal",
          desc: "Pendirian hak Cipta Perusahaan.",
        },

        {
          name: "Virtual Office",
          id: "legal",
          desc: "Layanan kantor virtual untuk bisnis internasional.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100">
      {/* 1. HERO SECTION */}

      <header className="bg-slate-900 py-32 px-6 text-center text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-6xl font-extrabold tracking-tighter mb-4">
            NUKARSA
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto italic font-light">
            Serving You Every Step of Immigration
          </p>
        </motion.div>

        {/* Dekorasi Background */}

        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
      </header>

      {/* 2. ABOUT US SECTION */}

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">
                About NUKARSA
              </h2>

              <h3 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Trusted Partner for Expatriates and Businesses in Indonesia.
              </h3>

              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Nukarsa adalah perusahaan jasa profesional yang bergerak di
                bidang pengurusan keimigrasian, pendirian perusahaan (PT), serta
                layanan hukum di Indonesia.
              </p>

              <div className="space-y-6">
                {[
                  {
                    num: "01",
                    title: "Integritas & Akurasi",
                    desc: "Menjamin setiap proses sesuai dengan regulasi keimigrasian yang berlaku.",
                  },

                  {
                    num: "02",
                    title: "Solusi Efisien",
                    desc: "Memberikan solusi yang jelas dan andal untuk menyederhanakan prosedur kompleks.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.2 }}
                    viewport={{ once: true }}
                    className="flex gap-4 group"
                  >
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
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

            {/* Visual with Image Optimization & Hover Overlay */}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2 relative group"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-125">
                <Image
                  src="/Sabaody.jpg"
                  alt="Nukarsa Office"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* SEKARANG DIBUNGKUS DENGAN LINK */}
                <Link href="/about">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer"
                  >
                    <motion.p
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-white font-bold border-2 border-white px-6 py-2 rounded-full uppercase tracking-widest"
                    >
                      View Profile
                    </motion.p>
                  </motion.div>
                </Link>
              </div>

              {/* Floating Badge */}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 z-10"
              >
                <p className="text-4xl font-bold text-blue-600 italic">2025</p>

                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Established
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION */}

      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {[
            {
              icon: "⚡",
              title: "Pengerjaan Lebih Cepat",
              desc: "Solusi efisien untuk menyederhanakan prosedur kompleks.",
            },

            {
              icon: "💼",
              title: "Profesional",
              desc: "Berkomitmen pada integrasi, akurasi dan kerahasiaan.",
            },

            {
              icon: "💰",
              title: "Harga Bersaing",
              desc: "Solusi inovatif untuk keberhasilan usaha jangka panjang.",
            },
          ].map((val, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 bg-white rounded-3xl shadow-sm border border-slate-100 text-center transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-4">{val.icon}</div>

              <h3 className="font-bold text-xl text-slate-900 mb-2">
                {val.title}
              </h3>

              <p className="text-slate-500 text-sm">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. SERVICES ACCORDION/GRID */}

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Our Professional Services
            </h2>

            <p className="text-slate-500 max-w-xl mx-auto">
              Solusi andal untuk memastikan kepatuhan hukum dan keberhasilan
              usaha Anda.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {allServices.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all"
              >
                <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>

                  {service.category}
                </h3>

                <ul className="space-y-6">
                  {service.items.map((item, i) => (
                    <li key={i} className="group">
                      {/* DIBUNGKUS LINK KE HALAMAN SERVICES DENGAN ANCHOR ID */}
                      <Link href={`/services#${item.id}`}>
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {item.name}
                          <svg
                            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </h4>
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OFFICE GALLERY (HORIZONTAL SCROLL) */}
      <OfficeGallery />

      {/* 6. MEET OUR TEAM */}

      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Meet Our Team
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-56 h-56 mx-auto mb-6 relative rounded-full border-4 border-slate-700 overflow-hidden group-hover:border-blue-500 transition-all duration-500">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                  />
                </div>

                <h3 className="text-2xl font-bold">{member.name}</h3>

                <p className="text-blue-400 font-medium mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT & FOOTER */}

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Contact Us</h2>

          <p className="text-slate-500 mb-12 text-lg">
            We would love to connect with you! Whether you have questions,
            feedback, or simply want to learn more about our services, our team
            is here to help. Reach out anytime, we are always ready to chat and
            assist you
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-50 rounded-3xl hover:bg-blue-50 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2">Email</h4>

              <p className="font-medium text-slate-900">nukarsa.co@gmail.com</p>
            </div>

            <div className="p-8 bg-slate-50 rounded-3xl hover:bg-blue-50 transition-colors">
              <h4 className="font-bold text-blue-600 mb-2">Contact Person</h4>

              <p className="font-medium text-slate-900">0856-9998-331</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              PT. KARSA RUANG NUSANTARA (NUKARSA)
            </h3>
            <p className="text-slate-400 mb-6 text-sm">
              Nukarsa adalah perusahaan jasa profesional yang bergerak di bidang
              pengurusan keimigrasian, pendirian perusahaan (PT), serta layanan
              hukum di Indonesia.
            </p>
            <div className="space-y-2 text-xs text-slate-500">
              <p>
                Akte Pendirian: 16 Juli 2025 (Notaris Mohammad Fahroji, S.H,
                M.Kn)
              </p>
              <p>SK Kemenkumham: AHU-0058463.AH.01.01.TAHUN 2025</p>
              <p>Nomor Induk Berusaha (NIB): 1607250088288 </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Info</h3>
            <p className="text-slate-400">
              Hubungi kami kapan saja, tim kami siap membantu Anda.
            </p>
            <ul className="text-slate-300 space-y-2">
              <li>📧 nukarsa.co@gmail.com </li>
              <li>📞 CP: 0856-9998-331</li>
              <li>🔗 linkedin.com/company/nukarsa </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-20 pt-8 border-t border-slate-900 text-slate-600 text-sm">
          © 2026 NUKARSA. Built with Passion for Sahaya Eka.
        </div>
      </footer>

      {/* Floating WhatsApp */}

      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/6289518024088"
        target="_blank"
        className="fixed bottom-10 right-10 bg-green-500 text-white p-5 rounded-full shadow-2xl z-50 flex items-center group transition-all duration-300"
      >
        {/* Teks Label */}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 whitespace-nowrap font-bold text-sm">
          Chat Admin Nukarsa
        </span>

        <svg
          viewBox="0 0 24 24"
          width="39"
          height="39"
          fill="currentColor"
          className="ml-0 group-hover:ml-2 transition-all duration-300"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.982-.363-1.747-.756-2.879-2.506-2.966-2.62-.088-.117-.715-.951-.715-1.814s.448-1.288.608-1.452c.16-.163.346-.204.461-.204.115 0 .231.001.329.005.102.003.239-.038.373.287.144.351.492 1.202.535 1.287.043.085.071.184.014.298-.057.114-.085.184-.171.284-.085.1-.184.225-.262.305-.085.086-.176.179-.076.353.101.171.447.737.96 1.192.66.586 1.216.768 1.391.853.175.085.278.071.382-.047.103-.118.447-.52.565-.697.119-.177.237-.148.397-.089.16.059 1.016.48 1.193.568.177.089.296.134.339.208.043.073.043.424-.101.829z" />
        </svg>
      </motion.a>
    </div>
  );
}
