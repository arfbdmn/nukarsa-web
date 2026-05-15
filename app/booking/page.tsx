"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function BookingPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    passport_number: "",
    visa_type: "Visa VoA",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload your passport scan!");
    setLoading(true);

    // 1. Insert ke tabel Applications
    const { data: appData, error: appError } = await supabase
      .from("applications")
      .insert([{ ...formData, status: "Pending" }])
      .select();

    if (appError) {
      alert("Error Application: " + appError.message);
      setLoading(false);
      return;
    }

    const applicationId = appData[0].id;

    // 2. Upload File ke Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("nukarsa-files")
      .upload(fileName, file);

    if (storageError) {
      alert("Error Upload: " + storageError.message);
      setLoading(false);
      return;
    }

    // 3. Ambil URL file dan simpan ke tabel Documents
    const {
      data: { publicUrl },
    } = supabase.storage.from("nukarsa-files").getPublicUrl(fileName);

    const { error: docError } = await supabase.from("documents").insert([
      {
        application_id: applicationId,
        file_url: publicUrl,
        doc_type: "Passport",
      },
    ]);

    setLoading(false);
    if (docError) alert("Error Doc: " + docError.message);
    else window.location.href = "/thanks";
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6 text-center">
          N-IMS Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg text-black placeholder:text-slate-400 focus:border-blue-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Passport Number
            </label>
            <input
              type="text"
              placeholder="Enter passport number"
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg text-black placeholder:text-slate-400 focus:border-blue-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, passport_number: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Visa Type
            </label>
            <select
              className="w-full p-3 border-2 border-blue-200 rounded-lg text-black focus:border-blue-500 outline-none bg-white"
              onChange={(e) =>
                setFormData({ ...formData, visa_type: e.target.value })
              }
            >
              <option value="Visa VoA">Visa VoA (Arrival)</option>
              <option value="Visa C2">Visa C2 (Business)</option>
              <option value="Visa D2">Visa D2 (Investment)</option>
              <option value="KITAS E34">KITAS E23 (Working)</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-blue-300 p-4 rounded-lg bg-blue-50">
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Upload Passport Scan
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="text-black text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:bg-slate-400"
          >
            {loading ? "Processing..." : "Submit to N-IMS"}
          </button>
        </form>
      </div>
    </div>
  );
}
// Force redeploy N-IMS
