export default function Features() {
  const points = [
    { title: "Pengerjaan Lebih Cepat", icon: "⚡" },
    { title: "Profesional", icon: "💼" },
    { title: "Harga Bersaing", icon: "💰" }
  ];

  return (
    <section className="py-16 bg-slate-50 px-6">
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
        {points.map((p, i) => (
          <div key={i}>
            <div className="text-4xl mb-2">{p.icon}</div>
            <h4 className="font-bold text-lg">{p.title}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}