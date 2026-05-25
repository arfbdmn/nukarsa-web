import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Hubungi Kami - PT. Karsa Ruang Nusantara (NUKARSA)",
  description: "Ada pertanyaan atau ingin konsultasi keimigrasian? Hubungi tim Nukarsa lewat WhatsApp, email, atau LinkedIn. Kami siap membantu Anda.",
};

/**
 * Contact page — Displays contact methods and quick CTA.
 * Server Component with static Indonesian text.
 */
export default function ContactPage() {
  const contactMethods = [
    {
      title: "Alamat Email",
      value: "nukarsa.co@gmail.com",
      icon: "✉️",
      link: "mailto:nukarsa.co@gmail.com",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      title: "WhatsApp / Telepon",
      value: "089518024088",
      icon: "💬",
      link: "https://wa.me/6289518024088?text=Hi%20Nukarsa,%20I%20want%20to%20consult%20about%20your%20services.",
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    {
      title: "LinkedIn",
      value: "Nukarsa Company",
      icon: "🔗",
      link: "https://linkedin.com/company/nukarsa",
      color: "bg-slate-50 text-slate-600 hover:bg-slate-100",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <FadeIn delay={0.1} y={20} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Hubungi Kami
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Kami siap membantu menjawab pertanyaan, memberikan konsultasi, atau
            membantu proses perizinan keimigrasian Anda di Indonesia.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, i) => (
            <FadeIn
              key={i}
              delay={i * 0.1}
              hoverY={-6}
              className="h-full"
            >
              <a
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center group h-full cursor-pointer bg-white min-h-[44px]"
              >
                <div
                  className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-all duration-300`}
                >
                  {method.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{method.title}</h3>
                <p className="text-sm text-slate-500 break-all leading-relaxed">
                  {method.value}
                </p>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* Dynamic CTA */}
        <FadeIn delay={0.4} className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Butuh Respon Cepat?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Tim profesional kami selalu siap berdiskusi, memberikan konsultasi regulasi,
              dan solusi terbaik untuk kenyamanan Anda tinggal dan berbisnis di Indonesia.
            </p>
            <div className="flex justify-center items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-400 uppercase tracking-widest text-[11px] md:text-xs">
                Online & Siap Melayani
              </span>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </FadeIn>
      </div>
    </div>
  );
}
