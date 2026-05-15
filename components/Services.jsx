export default function Services() {
  const visas = [
    { name: "Visa VoA", desc: "Visa on Arrival untuk kunjungan singkat." },
    { name: "Visa C2", desc: "Visa kunjungan bisnis beberapa kali perjalanan." },
    { name: "Visa D2", desc: "Visa tinggal terbatas untuk tujuan investasi/bisnis." }
  ];

  return (
    <section className="py-16 bg-white px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Layanan Visa Utama</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {visas.map((visa, index) => (
          <div key={index} className="border p-6 rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2 text-blue-600">{visa.name}</h3>
            <p className="text-slate-600">{visa.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}