"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [tokenState, setTokenState] = useState<"loading" | "valid" | "invalid">("loading");
  const [tokenData, setTokenData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    passport_number: "",
    country: "",
    identity_card: "",
    visa_type: "Visa VoA",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenState("invalid");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("booking_tokens")
          .select("*")
          .eq("id", token)
          .eq("status", "active")
          .gt("expires_at", new Date().toISOString())
          .maybeSingle();

        if (error || !data) {
          console.error("Token validation failed:", error);
          setTokenState("invalid");
        } else {
          setTokenData(data);
          setFormData((prev) => ({
            ...prev,
            full_name: data.client_name || "",
          }));
          setTokenState("valid");
        }
      } catch (err) {
        console.error("Critical token validation error:", err);
        setTokenState("invalid");
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload your passport scan!");
    setLoading(true);
    setErrorMessage("");

    try {
      // 1. Upload File ke Storage
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("nukarsa-files")
        .upload(fileName, file);

      if (storageError) {
        throw new Error("File upload failed: " + storageError.message);
      }

      // 2. Ambil URL file publik
      const {
        data: { publicUrl },
      } = supabase.storage.from("nukarsa-files").getPublicUrl(fileName);

      // 3. Insert ke tabel Applications
      const { data: appData, error: appError } = await supabase
        .from("applications")
        .insert([
          {
            full_name: formData.full_name,
            passport_number: formData.passport_number,
            visa_type: formData.visa_type,
            country: formData.country,
            identity_card: formData.identity_card,
            booking_token_id: token,
            status: "Pending",
          },
        ])
        .select();

      if (appError) {
        throw new Error("Application insertion failed: " + appError.message);
      }

      const applicationId = appData[0].id;

      // 4. Simpan ke tabel Documents
      const { error: docError } = await supabase.from("documents").insert([
        {
          application_id: applicationId,
          file_url: publicUrl,
          doc_type: "Passport",
        },
      ]);

      if (docError) {
        throw new Error("Document link creation failed: " + docError.message);
      }

      // 5. Simpan ke status_updates (log log awal)
      await supabase.from("status_updates").insert([
        {
          application_id: applicationId,
          status: "Pending",
          notes: "Application submitted securely by client.",
        },
      ]);

      // 6. Nonaktifkan Token (Claim Token)
      const { error: tokenError } = await supabase
        .from("booking_tokens")
        .update({
          status: "used",
          used_at: new Date().toISOString(),
          application_id: applicationId,
        })
        .eq("id", token);

      if (tokenError) {
        console.error("Warning: Failed to invalidate token:", tokenError.message);
      }

      setLoading(false);
      // Redirect ke thanks page
      router.push(`/thanks?name=${encodeURIComponent(formData.full_name)}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (tokenState === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold tracking-wider">Verifying Link Security...</h2>
          <p className="text-slate-400 text-sm mt-2">Connecting to Nukarsa Encryption Portal</p>
        </div>
      </div>
    );
  }

  if (tokenState === "invalid") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-900/10 rounded-full blur-[100px]"></div>

        <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl shadow-2xl relative z-10 text-center animate-fade-in">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 text-4xl">
            🔒
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-4 text-slate-100">
            Access Link Expired or Invalid
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed text-sm">
            Tautan pendaftaran ini tidak lagi aktif, sudah pernah digunakan, atau masa berlakunya telah habis. PT. Karsa Ruang Nusantara menerapkan prosedur token satu-kali untuk mengamankan data paspor sensitif Anda.
          </p>
          <div className="space-y-4">
            <a
              href="https://wa.me/628569998331?text=Hi%20Nukarsa,%20my%20N-IMS%20registration%20link%20has%20expired.%20Please%20send%20me%20a%20new%20one."
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 active:scale-95"
            >
              Hubungi Admin via WhatsApp
            </a>
            <a
              href="/"
              className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-4 rounded-xl transition-all duration-300"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-6 text-white relative overflow-hidden flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-xl w-full bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-slate-800 relative z-10">
        <div className="text-center mb-8">
          <div className="bg-blue-600/10 border border-blue-500/20 text-blue-500 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            N-IMS Secure Portal
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Register Application
          </h1>
          <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
            Welcome, <strong className="text-blue-400">{tokenData?.client_name}</strong>. Please upload your identity documents below. All data is highly encrypted.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              required
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Country of Origin
              </label>
              <input
                type="text"
                placeholder="e.g. Germany"
                required
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                National Identity Card
              </label>
              <input
                type="text"
                placeholder="ID or Social Security Card"
                required
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
                onChange={(e) =>
                  setFormData({ ...formData, identity_card: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Passport Number
            </label>
            <input
              type="text"
              placeholder="e.g. CXXXXXX"
              required
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
              onChange={(e) =>
                setFormData({ ...formData, passport_number: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Visa Type Request
            </label>
            <select
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold bg-no-repeat cursor-pointer"
              onChange={(e) =>
                setFormData({ ...formData, visa_type: e.target.value })
              }
            >
              <option value="Visa VoA">Visa VoA (Tourism / Business Short)</option>
              <option value="Visa C2">Visa C2 (Business / Meeting)</option>
              <option value="Visa D2">Visa D2 (Investor)</option>
              <option value="Working KITAS (E23)">Working KITAS (E23)</option>
              <option value="Investment KITAS (E28A)">Investment KITAS (E28A)</option>
              <option value="Bridging Visa">Bridging Visa</option>
            </select>
          </div>

          <div className="border border-dashed border-slate-800 hover:border-blue-500 p-6 rounded-xl bg-slate-950/50 transition-all duration-300">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Upload Passport Scan (PDF or Image)
            </label>
            <input
              type="file"
              required
              accept="image/*,application/pdf"
              className="text-slate-400 text-sm file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all file:cursor-pointer cursor-pointer w-full"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
              Max file size is 10MB. Supports JPEG, PNG, or PDF formats. File is protected under state-of-the-art encryption algorithms.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-md transition-all duration-300 shadow-lg active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Security Protocols...
              </>
            ) : (
              "Submit Secure Registration"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold tracking-wider">Loading Security Portal...</h2>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}