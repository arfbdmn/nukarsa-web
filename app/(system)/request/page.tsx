"use client";

import { useState } from "react";
import { supabase } from "@/app/utils/supabase";
import { useTranslation, LanguageToggle } from "@/components/LanguageContext";

export default function RequestPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    visa_type: "Visa VoA",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("token_requests")
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            visa_type: formData.visa_type,
            message: formData.message,
            status: "Pending",
          },
        ]);

      if (error) throw new Error(error.message);

      setSuccess(true);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        visa_type: "Visa VoA",
        message: "",
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || t("request.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 py-16 px-6 text-white relative overflow-hidden flex items-center justify-center">
        {/* Glowing visual blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-600/5 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="max-w-xl w-full bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-slate-800 relative z-10">
          {!success ? (
            <>
              <div className="flex justify-between items-start mb-8 gap-4">
                <div className="text-left">
                  <div className="bg-blue-600/10 border border-blue-500/20 text-blue-500 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 animate-pulse">
                    N-IMS Self-Service
                  </div>
                  <h1 className="text-3xl font-black text-slate-100 tracking-tight">
                    {t("request.title")}
                  </h1>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    {t("request.subtitle")}
                  </p>
                </div>
                <div className="shrink-0">
                  <LanguageToggle />
                </div>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    {t("request.name_label")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("request.name_placeholder")}
                    value={formData.full_name}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      {t("request.email_label")}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={t("request.email_placeholder")}
                      value={formData.email}
                      className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      {t("request.phone_label")}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={t("request.phone_placeholder")}
                      value={formData.phone}
                      className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    {t("request.visa_label")}
                  </label>
                  <select
                    value={formData.visa_type}
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

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    {t("request.msg_label")}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t("request.msg_placeholder")}
                    value={formData.message}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold resize-none"
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-md transition-all duration-300 shadow-lg active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t("request.submitting")}
                    </>
                  ) : (
                    t("request.btn_submit")
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 text-4xl animate-bounce">
                ✓
              </div>
              <h1 className="text-3xl font-black text-slate-100 tracking-tight mb-4">
                {t("request.success_title")}
              </h1>
              <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                {t("request.success_desc")}
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold py-4 rounded-xl transition-all duration-300"
              >
                Back to Request Form
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
