"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
  const contactMethods = [
    {
      title: "Email Address",
      value: "nukarsa.co@gmail.com",
      icon: "📧",
      link: "mailto:nukarsa.co@gmail.com",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "WhatsApp / Call",
      value: "0856-9998-331",
      icon: "📱",
      link: "https://wa.me/628569998331",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "LinkedIn",
      value: "Nukarsa Company",
      icon: "🔗",
      link: "https://linkedin.com/company/nukarsa",
      color: "bg-slate-50 text-slate-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black text-slate-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-slate-500 text-lg">
            Kami siap membantu menjawab pertanyaan, memberikan konsultasi, atau
            membantu proses imigrasi Anda.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, i) => (
            <motion.a
              key={i}
              href={method.link}
              target="_blank"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all text-center group"
            >
              <div
                className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform`}
              >
                {method.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{method.title}</h3>
              <p className="text-sm text-slate-500 wrap-break-words">
                {method.value}
              </p>
            </motion.a>
          ))}
        </div>

        {/* Info Tambahan dari PDF */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-slate-900 rounded-[3rem] p-12 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Butuh Respon Cepat?</h2>
          <p className="text-slate-400 mb-8">
            Tim kami selalu siap berdiskusi dan memberikan solusi terbaik untuk
            pertumbuhan dan kesuksesan Anda di Indonesia.
          </p>
          <div className="flex justify-center gap-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-400 uppercase tracking-widest">
              Online & Ready to Chat
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
