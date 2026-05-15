export default function LandingPage() {
  const teamMembers = [
    {
      name: "Gerry Affero Wibawa, S.H",
      role: "Director",
      image: "/Gerry.png",
    },
    {
      name: "Ervina Syahputri",
      role: "Project Director",
      image: "/Ervina.png",
    },
    {
      name: "Ain Tania",
      role: "Marketing Communication",
      image: "/Ain.png",
    },
  ];

  const allServices = [
    {
      category: "Visa Services",
      items: [
        {
          name: "Visa VoA",
          desc: "Visa on Arrival untuk kunjungan pariwisata atau sosial.",
        },
        {
          name: "Visa C2",
          desc: "Visa kunjungan untuk urusan bisnis, pertemuan, dan pembelian barang.",
        },
        {
          name: "Visa D2",
          desc: "Visa tinggal terbatas untuk kebutuhan investasi dan kerja.",
        },
      ],
    },
    {
      category: "Residence Permits (KITAS/KITAP)",
      items: [
        {
          name: "Working KITAS (E23)",
          desc: "Izin tinggal terbatas untuk tenaga kerja asing.",
        },
        {
          name: "Investment KITAS (E28A)",
          desc: "Izin tinggal bagi investor asing di Indonesia.",
        },
        {
          name: "Bridging Visa",
          desc: "Izin tinggal sementara saat menunggu keputusan visa baru.",
        },
      ],
    },
    {
      category: "Corporate & Legal",
      items: [
        {
          name: "Company Establishment (PT)",
          desc: "Layanan pendirian perusahaan dan izin usaha lainnya.",
        },
        {
          name: "Naturalization",
          desc: "Proses perubahan kewarganegaraan dari WNA menjadi WNI.",
        },
        {
          name: "Passport Management",
          desc: "Pengurusan dan manajemen paspor bagi ekspatriat.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white tect-slate-800 font-sans">
      {/* Hero section -  tag line nukarsa */}
      <header className="bg-slate-900 py-24 px-6 text-center text-white">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">NUKARSA</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto italic">
          Serving You Every Step of Imigration
        </p>
      </header>

      {/* About Us Section */}
<section className="py-24 bg-white overflow-hidden">
  <div className="max-w-6xl mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center gap-16">
      {/* Kolom Teks */}
      <div className="md:w-1/2">
        <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">About NUKARSA</h2>
        <h3 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
          Trusted Partner for Expatriates and Businesses in Indonesia.
        </h3>
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          Nukarsa adalah perusahaan jasa profesional yang bergerak di bidang pengurusan keimigrasian bagi warga negara asing, pendirian perusahaan (PT), serta layanan hukum di Indonesia.
        </p>
        
        {/* Poin Visi/Misi dari Profile */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">01</div>
            <div>
              <h4 className="font-bold text-slate-900">Integritas & Akurasi</h4>
              <p className="text-sm text-slate-500">Menjamin setiap proses sesuai dengan regulasi keimigrasian yang berlaku dengan ketepatan tinggi.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">02</div>
            <div>
              <h4 className="font-bold text-slate-900">Solusi Efisien</h4>
              <p className="text-sm text-slate-500">Memberikan solusi yang jelas dan andal untuk menyederhanakan prosedur yang kompleks bagi klien kami.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Visual (Bisa diisi gambar kantor atau abstrak gedung) */}
      <div className="md:w-1/2 relative">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-600 rounded-2xl -z-10 opacity-10"></div>
        <img 
          src="/building-profile.jpg" 
          alt="Corporate Building" 
          className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
        />
        <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-xl shadow-xl border border-slate-100">
          <p className="text-4xl font-bold text-blue-600 italic">2025</p>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Established</p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Value Proposition */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg text-slate-950">
              Pengerjaan Lebih Cepat
            </h3>
            <p className="text-sm text-slate-600">
              Solusi efisien untuk menyederhanakan prosedur kompleks.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="font-bold text-lg text-slate-950">Profesional</h3>
            <p className="text-sm text-slate-600">
              Berkomitmen pada integritas, akurasi, dan kerahasiaan.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-lg text-slate-950">Harga Bersaing</h3>
            <p className="text-sm text-slate-600">
              Solusi inovatif untuk keberhasilan usaha jangka panjang.
            </p>
          </div>
        </div>
      </section>

      {/* Section Layanan Visa */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
          Layanan Visa Utama
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-l-4 border-blue-600 p-6 bg-slate-50 hover:bg-slate-100 transition">
            <h4 className="font-bold text-xl mb-2 text-slate-950">Visa VoA</h4>
            <p className="text-slate-600 text-sm">
              Visa on Arrival untuk kunjungan pariwisata atau sosial.
            </p>
          </div>
          <div className="border-l-4 border-blue-600 p-6 bg-slate-50 hover:bg-slate-100 transition">
            <h4 className="font-bold text-xl mb-2 text-slate-950">Visa C2</h4>
            <p className="text-slate-600 text-sm">
              Visa kunjungan untuk urusan bisnis dan pertemuan.
            </p>
          </div>
          <div className="border-l-4 border-blue-600 p-6 bg-slate-50 hover:bg-slate-100 transition">
            <h4 className="font-bold text-xl mb-2 text-slate-950">Visa D2</h4>
            <p className="text-slate-600 text-sm">
              Visa tinggal terbatas untuk kebutuhan investasi dan kerja.
            </p>
          </div>
        </div>
      </section>

      {/* Section Layanan Profesional (Layanan Lainnya) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">
            Our Professional Services
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Solusi andal dan efisien untuk memastikan kepatuhan hukum serta
            keberhasilan usaha jangka panjang Anda di Indonesia.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {allServices.map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
              >
                <h3 className="text-xl font-bold text-blue-600 mb-6 border-b pb-2">
                  {service.category}
                </h3>
                <ul className="space-y-4">
                  {service.items.map((item, i) => (
                    <li key={i}>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Meet Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-950 ">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full border-4 border-blue-100 group-hover:border-blue-500 transition-all">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-950">Contact Us</h2>
          <p className="text-slate-600 mb-10 text-lg">
            We would love to connect with you! Whether you have a question,
            feedback, or simply want to learn more about our services, our team
            is here to help. Reach out anytime we are always ready to chat and
            assist you.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-xl">
              <h4 className="font-bold text-blue-600 mb-2">Email Address</h4>
              <p className="text-slate-800 font-medium">nukarsa.co@gmail.com</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl">
              <h4 className="font-bold text-blue-600 mb-2">Contact Person</h4>
              <p className="text-slate-800 font-medium">0856-9998-331</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Legality (Penting untuk Perusahaan Imigrasi) */}
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
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/6289518024088"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all z-50 flex items-center justify-center group"
      >
        {/* Label yang muncul saat di-hover */}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:mr-2 transition-all duration-500 ease-in-out whitespace-nowrap font-medium">
          Chat Admin NUKARSA
        </span>
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path>
        </svg>
      </a>
    </div>
  );
}
