import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Layanan Kami - PT. Karsa Ruang Nusantara (NUKARSA)",
  description: "Layanan keimigrasian profesional terlengkap di Indonesia: Visa VoA/C2/D2, Stay Permits (KITAS/KITAP), pendirian PT/PMA, dan naturalisasi WNA.",
};

export default function ServicesPage() {
  const services = [
    {
      id: "visa",
      title: "Visa Services",
      description: "Solusi lengkap untuk izin masuk dan tinggal di Indonesia.",
      items: [
        { name: "Visa VoA (Arrival)", detail: "Izin kunjungan singkat untuk wisata atau pertemuan bisnis non-komersial." },
        { name: "Visa C2 (Business)", detail: "Visa kunjungan untuk kegiatan bisnis, diskusi proyek, atau kunjungan industri." },
        { name: "Visa D2 (Investment)", detail: "Visa khusus untuk investor asing yang ingin memantau bisnis di Indonesia." }
      ]
    },
    {
      id: "kitas",
      title: "Stay Permits (KITAS/KITAP)",
      description: "Izin tinggal terbatas maupun tetap untuk kenyamanan jangka panjang.",
      items: [
        { name: "KITAS E34 (Working)", detail: "Izin tinggal bagi tenaga kerja asing profesional." },
        { name: "Family KITAS", detail: "Izin tinggal untuk penyatuan keluarga (istri/suami/anak)." },
        { name: "KITAP", detail: "Izin Tinggal Tetap bagi WNA yang memenuhi syarat durasi tinggal tertentu." }
      ]
    },
    {
      id: "legal",
      title: "Corporate & Naturalization",
      description: "Layanan legalitas perusahaan dan status kewarganegaraan.",
      items: [
        { name: "Pendirian PT/PMA", detail: "Bantuan legalitas untuk mendirikan badan usaha di Indonesia." },
        { name: "Naturalisasi", detail: "Proses permohonan menjadi Warga Negara Indonesia (WNI)." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-20">
          <FadeIn delay={0.1} y={20}>
            <h1 className="text-5xl font-black text-slate-900 mb-6">Our Expert Services</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Memberikan kepastian hukum dan kemudahan prosedur bagi ekspatriat dan bisnis internasional di Indonesia.
            </p>
          </FadeIn>
        </header>

        <div className="space-y-32">
          {services.map((section, idx) => (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              <div className="flex flex-col md:flex-row gap-12">
                <FadeIn delay={0.2} x={-20} className="md:w-1/3">
                  <h2 className="text-3xl font-bold text-blue-600 mb-4">{section.title}</h2>
                  <p className="text-slate-500 leading-relaxed">{section.description}</p>
                  <div className="h-1 w-20 bg-blue-600 mt-6 rounded-full"></div>
                </FadeIn>

                <div className="md:w-2/3 grid gap-6">
                  {section.items.map((item, i) => (
                    <FadeIn
                      key={i}
                      delay={i * 0.1}
                      hoverScale={1.01}
                      className="w-full"
                    >
                      <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 group cursor-pointer">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Call to Action */}
        <FadeIn delay={0.4} className="mt-32 bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Butuh Konsultasi Khusus?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Tim kami selalu siap mendengarkan kebutuhan legalitas Anda. Hubungi kami untuk sesi konsultasi cepat.
            </p>
            <FadeIn isTapScale={true} className="inline-block">
              <Link
                href="/booking"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300"
              >
                Daftar via N-IMS Sekarang
              </Link>
            </FadeIn>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </FadeIn>
      </div>
    </div>
  );
}