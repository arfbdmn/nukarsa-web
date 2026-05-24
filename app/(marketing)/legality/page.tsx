import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Legalitas Perusahaan - PT. Karsa Ruang Nusantara (NUKARSA)",
  description: "PT. Karsa Ruang Nusantara (NUKARSA) terdaftar resmi dan mematuhi regulasi hukum Republik Indonesia untuk keimigrasian dan perizinan bisnis.",
};

export default function LegalityPage() {
  const legalityData = [
    {
      title: "Akte Pendirian",
      detail: "Notaris Mohammad Fahroji, S.H, M.Kn",
      date: "16 Juli 2025",
      icon: "📜",
    },
    {
      title: "SK Kemenkumham",
      detail: "Nomor AHU-0058463.AH.01.01.TAHUN 2025",
      date: "16 Juli 2025",
      icon: "⚖️",
    },
    {
      title: "Nomor Induk Berusaha (NIB)",
      detail: "1607250088288",
      date: "16 Juli 2025",
      icon: "🏢",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <FadeIn y={-20} className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Legalitas Perusahaan
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            PT. Karsa Ruang Nusantara (NUKARSA) berkomitmen pada transparansi
            dan kepatuhan hukum penuh di Indonesia.
          </p>
        </FadeIn>

        {/* Legality Cards */}
        <div className="grid gap-6">
          {legalityData.map((item, i) => (
            <FadeIn
              key={i}
              delay={i * 0.1}
              x={-30}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-6 group hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="text-4xl bg-slate-50 w-20 h-20 flex items-center justify-center rounded-2xl group-hover:bg-blue-50 group-hover:scale-105 transition-all duration-300">
                {item.icon}
              </div>
              <div className="grow">
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-blue-600 font-semibold mb-2">{item.detail}</p>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                  Terdaftar sejak {item.date}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Note Section */}
        <FadeIn delay={0.4} y={30} className="mt-16 p-8 bg-blue-600 rounded-3xl text-white text-center shadow-xl shadow-blue-100">
          <h4 className="text-xl font-bold mb-2">Dokumen Terverifikasi</h4>
          <p className="text-blue-100 text-sm leading-relaxed max-w-2xl mx-auto">
            Seluruh operasional kami berada di bawah naungan hukum Republik
            Indonesia untuk memberikan keamanan dan kenyamanan maksimal bagi setiap klien kami.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
