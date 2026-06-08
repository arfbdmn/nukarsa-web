"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [tokenState, setTokenState] = useState<"loading" | "valid" | "invalid">(
    "loading",
  );
  const [tokenData, setTokenData] = useState<any>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    passport_number: "",
    country: "",
    identity_card: "",
    visa_type: "Visa VoA",
    no_telephone: "",
    email: "",
  });
  const [files, setFiles] = useState<File[]>([]);
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
            email: data.client_email || "",
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
    if (files.length === 0) return alert("Please upload at least one passport scan or identity document!");
    setLoading(true);
    setErrorMessage("");

    try {
      // 1. Upload Files ke Storage
      const uploadedDocs: { file_url: string; doc_type: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i];
        const fileName = `${Date.now()}-${i}-${fileItem.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from("nukarsa-files")
          .upload(fileName, fileItem);

        if (storageError) {
          throw new Error(`File upload failed for "${fileItem.name}": ` + storageError.message);
        }

        // 2. Ambil URL file publik
        const {
          data: { publicUrl },
        } = supabase.storage.from("nukarsa-files").getPublicUrl(fileName);

        // Tentukan tipe berkas secara dinamis
        let docType = "Passport";
        if (files.length > 1) {
          docType = `Document ${i + 1} (${fileItem.name.split(".").pop()?.toUpperCase() || "FILE"})`;
        }

        uploadedDocs.push({
          file_url: publicUrl,
          doc_type: docType,
        });
      }

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
            no_telephone: formData.no_telephone,
            email: formData.email,
            booking_token_id: token,
            status: "Pending",
          },
        ])
        .select();

      if (appError) {
        throw new Error("Application insertion failed: " + appError.message);
      }

      const applicationId = appData[0].id;

      // 4. Simpan ke tabel Documents (multiple inserts)
      const docInserts = uploadedDocs.map((doc) => ({
        application_id: applicationId,
        file_url: doc.file_url,
        doc_type: doc.doc_type,
      }));

      const { error: docError } = await supabase.from("documents").insert(docInserts);

      if (docError) {
        throw new Error("Document link creation failed: " + docError.message);
      }

      // 5. Simpan ke status_updates (log log awal)
      await supabase.from("status_updates").insert([
        {
          application_id: applicationId,
          status: "Pending",
          notes: `Application with ${files.length} document(s) submitted securely by client.`,
        },
      ]);

      /* COMMENTED OUT FOR PAYMENT SYSTEM DEFERRAL
      // 5.5 Automatically generate a default invoice/quotation based on selected visa type
      let defaultCost = 1500000;
      if (formData.visa_type === "Visa C2") defaultCost = 4500000;
      else if (formData.visa_type === "Visa D2") defaultCost = 12000000;
      else if (formData.visa_type === "Working KITAS (E23)") defaultCost = 18500000;
      else if (formData.visa_type === "Investment KITAS (E28A)") defaultCost = 22000000;
      else if (formData.visa_type === "Bridging Visa") defaultCost = 3000500;

      const due = new Date();
      due.setDate(due.getDate() + 14); // 14 days payment term by default

      await supabase.from("quotations").insert([
        {
          application_id: applicationId,
          amount: defaultCost,
          currency: "IDR",
          status: "Sent", // Instantly publish invoice to client tracker
          notes: `Automated Invoice generated by N-IMS System for ${formData.visa_type}. Please proceed with payment transfer to PT. Karsa Ruang Nusantara account.`,
          due_date: due.toISOString(),
        }
      ]);
      */

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
        console.error(
          "Warning: Failed to invalidate token:",
          tokenError.message,
        );
      }

      setLoading(false);
      // Redirect ke thanks page dengan token UUID
      router.push(`/thanks?name=${encodeURIComponent(formData.full_name)}&token=${encodeURIComponent(token || "")}`);
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
          <h2 className="text-xl font-bold tracking-wider">
            Verifying Link Security...
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Connecting to Nukarsa Encryption Portal
          </p>
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
            Tautan pendaftaran ini tidak lagi aktif, sudah pernah digunakan,
            atau masa berlakunya telah habis. PT. Karsa Ruang Nusantara
            menerapkan prosedur token satu-kali untuk mengamankan data paspor
            sensitif Anda.
          </p>
          <div className="space-y-4">
            <a
              href="https://wa.me/6289518024088?text=Hi%20Nukarsa,%20my%20N-IMS%20registration%20link%20has%20expired.%20Please%20send%20me%20a%20new%20one."
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
            Welcome,{" "}
            <strong className="text-blue-400">{tokenData?.client_name}</strong>.
            Please upload your identity documents below. All data is highly
            encrypted.
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
              Telephone Number (WhatsApp)
            </label>
            <input
              type="tel"
              placeholder="e.g. +6289518024088"
              required
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
              onChange={(e) =>
                setFormData({ ...formData, no_telephone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. client@example.com"
              required
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
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
              <option value="Visa VoA">
                Visa VoA (Tourism / Business Short)
              </option>
              <option value="Visa C2">Visa C2 (Business / Meeting)</option>
              <option value="Visa D2">Visa D2 (Investor)</option>
              <option value="Working KITAS (E23)">Working KITAS (E23)</option>
              <option value="Investment KITAS (E28A)">
                Investment KITAS (E28A)
              </option>
              <option value="Bridging Visa">Bridging Visa</option>
            </select>
          </div>

          <div className="border border-dashed border-slate-800 hover:border-blue-500 p-6 rounded-xl bg-slate-950/50 transition-all duration-300">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Upload Identity Documents & Passport Scan (Multiple Allowed)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="text-slate-400 text-sm file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all file:cursor-pointer cursor-pointer w-full"
              onChange={(e) => {
                if (e.target.files) {
                  const fileList = Array.from(e.target.files);
                  setFiles((prev) => [...prev, ...fileList]);
                }
              }}
            />
            <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
              Max file size is 10MB per file. Supports JPEG, PNG, or PDF formats. Files are
              protected under state-of-the-art encryption algorithms.
            </p>

            {/* List of selected files */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-450">
                  Selected Files ({files.length}):
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-2">
                  {files.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900/60 border border-slate-850 px-3 py-2 rounded-lg text-xs">
                      <span className="truncate max-w-[70%] font-medium text-slate-300">
                        📄 {f.name} <span className="text-[10px] text-slate-500">({(f.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 font-bold cursor-pointer text-[10px] uppercase tracking-wider transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-bold tracking-wider">
              Loading Security Portal...
            </h2>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
