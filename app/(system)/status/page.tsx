"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import { useTranslation, LanguageToggle } from "@/components/LanguageContext";

function StatusTrackerContent() {
  const { t, language } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get token from URL if present
  const urlToken = searchParams.get("token") || "";
  const [tokenInput, setTokenInput] = useState(urlToken);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Data States
  const [application, setApplication] = useState<any>(null);
  const [sla, setSla] = useState<any>(null);
  const [quotation, setQuotation] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Simple UUID v4 regex validation
  const isValidUUID = (uuid: string) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  const handleSearch = async (tokenToSearch: string) => {
    if (!tokenToSearch.trim()) return;
    
    if (!isValidUUID(tokenToSearch.trim())) {
      setErrorMsg(t("status.invalid_uuid"));
      setApplication(null);
      setSearched(true);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSearched(true);

    try {
      // 1. Fetch Application linked with this booking token
      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("booking_token_id", tokenToSearch.trim())
        .maybeSingle();

      if (appError) throw new Error(appError.message);
      
      if (!appData) {
        setErrorMsg(t("status.not_found"));
        setApplication(null);
        setLoading(false);
        return;
      }

      setApplication(appData);

      // 2. Fetch SLA Config for this visa type
      const { data: slaData } = await supabase
        .from("sla_config")
        .select("*")
        .eq("visa_type", appData.visa_type)
        .maybeSingle();
      
      setSla(slaData || null);

      // 3. Fetch Quotations (non-draft) (Commented out for payment system deferral)
      /*
      const { data: quoteData } = await supabase
        .from("quotations")
        .select("*")
        .eq("application_id", appData.id)
        .neq("status", "Draft")
        .maybeSingle();
      
      setQuotation(quoteData || null);
      */

      // 4. Fetch Documents
      const { data: docsData } = await supabase
        .from("documents")
        .select("*")
        .eq("application_id", appData.id);
      
      setDocuments(docsData || []);

      // 5. Fetch Status Updates (audit logs)
      const { data: auditData } = await supabase
        .from("status_updates")
        .select("*")
        .eq("application_id", appData.id)
        .order("created_at", { ascending: false });
      
      setAuditLogs(auditData || []);

      // Update URL search param silently
      const newUrl = `${window.location.pathname}?token=${encodeURIComponent(tokenToSearch.trim())}`;
      window.history.replaceState(null, "", newUrl);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected database error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if token is present in URL
  useEffect(() => {
    if (urlToken) {
      handleSearch(urlToken);
    }
  }, [urlToken]);

  // Stepper helper
  const statusSteps = ["Pending", "Verified", "In Progress", "Completed"];
  const getStepIndex = (status: string) => {
    if (status === "Rejected") return -1;
    return statusSteps.indexOf(status);
  };
  const activeStep = application ? getStepIndex(application.status) : -1;

  // Days calculations
  const calculateDays = () => {
    if (!application || !sla) return null;
    const createdDate = new Date(application.created_at);
    const elapsedMs = Date.now() - createdDate.getTime();
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    const totalSla = sla.processing_days;
    const remaining = totalSla - elapsedDays;
    return {
      total: totalSla,
      elapsed: elapsedDays,
      remaining: remaining >= 0 ? remaining : Math.abs(remaining),
      isOverdue: remaining < 0
    };
  };
  const daysInfo = calculateDays();

  return (
    <>
      <div className="min-h-screen bg-slate-955 py-16 px-4 sm:px-6 text-white relative overflow-hidden flex flex-col items-center bg-slate-955 bg-slate-955/20 bg-slate-950">
        {/* visual glowing backdrop */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="max-w-4xl w-full relative z-10 space-y-8">
          {/* Tracker Search Form */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6 gap-4">
              <div className="text-left">
                <span className="bg-blue-600/10 border border-blue-500/20 text-blue-500 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  N-IMS Tracker Portal
                </span>
                <h1 className="text-3xl font-black text-slate-100 tracking-tight">
                  {t("status.title")}
                </h1>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {t("status.subtitle")}
                </p>
              </div>
              <div className="shrink-0">
                <LanguageToggle />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={tokenInput}
                placeholder={t("status.placeholder")}
                className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-mono text-sm tracking-wide"
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(tokenInput);
                }}
              />
              <button
                onClick={() => handleSearch(tokenInput)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-650 flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
              >
                {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {t("status.btn")}
              </button>
            </div>

            {errorMsg && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium">
                ⚠️ {errorMsg}
              </div>
            )}
          </div>

          {/* Tracker Results Dashboard */}
          {loading && (
            <div className="bg-slate-900/20 backdrop-blur-xl border border-slate-800/40 rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 text-sm tracking-wider font-semibold">{t("status.loading")}</p>
            </div>
          )}

          {!loading && searched && application && (
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Left Side: Status Steps & Core details (Spans 2 columns) */}
              <div className="md:col-span-2 space-y-8">
                
                {/* Visual Progress Stepper Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                  <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
                    <span>📋</span> {t("status.details_title")}
                  </h2>

                  {application.status === "Rejected" ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-450 p-4 rounded-2xl flex items-center gap-3 mb-6">
                      <span className="text-2xl">🛑</span>
                      <div>
                        <h4 className="font-bold text-md">Visa Application Rejected</h4>
                        <p className="text-xs text-red-400/80 mt-1">Please review the audit trail log below or contact PT. Karsa Ruang Nusantara for assistance.</p>
                      </div>
                    </div>
                  ) : (
                    /* Elegant Horizontal/Vertical responsive Stepper Pipeline */
                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:gap-2 py-6 border-b border-slate-800/60 mb-6">
                      {statusSteps.map((step, idx) => {
                        const isCompleted = idx < activeStep;
                        const isActive = idx === activeStep;
                        return (
                          <div key={idx} className="flex flex-1 flex-col items-center relative w-full text-center">
                            {/* Stepper Line connectors */}
                            {idx > 0 && (
                              <div className={`hidden md:block absolute right-1/2 left-[-50%] top-6 h-0.5 z-0 ${idx <= activeStep ? "bg-blue-600" : "bg-slate-800"}`} />
                            )}
                            {/* Stepper Bubble */}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm relative z-10 transition-all duration-500 ${
                              isCompleted 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                : isActive 
                                  ? "bg-slate-100 text-slate-950 ring-4 ring-blue-500/20 animate-pulse font-black" 
                                  : "bg-slate-950 text-slate-600 border border-slate-800"
                            }`}>
                              {isCompleted ? "✓" : idx + 1}
                            </div>
                            <span className={`text-xs mt-3 font-semibold uppercase tracking-wider ${isActive ? "text-blue-400" : isCompleted ? "text-slate-300" : "text-slate-600"}`}>
                              {step === "Pending" ? "Pending" : step === "Verified" ? "Verified" : step === "In Progress" ? "In Progress" : "Completed"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Automated Congratulations & E-Visa Digital PDF Download Card */}
                  {application.status === "Completed" && documents.find(d => d.doc_type === "E-Visa" || d.doc_type?.toLowerCase().includes("e-visa")) && (
                    <div className="mb-6 p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl relative overflow-hidden shadow-xl shadow-amber-500/5">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                          <span className="text-4xl animate-bounce">👑</span>
                          <div>
                            <h4 className="font-extrabold text-lg text-amber-400">Your Electronic Visa is Ready!</h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                              Selamat! Visa elektronik Anda telah selesai diterbitkan secara digital. Anda dapat mengunduh berkas E-Visa di bawah ini tanpa perlu datang ke kantor.
                            </p>
                          </div>
                        </div>
                        <a
                          href={documents.find(d => d.doc_type === "E-Visa" || d.doc_type?.toLowerCase().includes("e-visa"))?.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs transition-all shadow-lg active:scale-95 text-center tracking-wider uppercase shrink-0 cursor-pointer"
                        >
                          ⬇️ Download E-Visa PDF
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Core details table grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm py-4 border-b border-slate-800/60">
                    <div>
                      <span className="text-slate-500 block text-xs font-bold uppercase tracking-widest mb-1">{t("admin.th_name")}</span>
                      <strong className="text-slate-200">{application.full_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs font-bold uppercase tracking-widest mb-1">{t("admin.th_country")}</span>
                      <strong className="text-slate-200">{application.country || "-"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs font-bold uppercase tracking-widest mb-1">{t("admin.th_visa")}</span>
                      <strong className="text-blue-400 font-bold">{application.visa_type}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs font-bold uppercase tracking-widest mb-1">{t("status.current_status")}</span>
                      <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        application.status === "Pending" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                        application.status === "Verified" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                        application.status === "In Progress" ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" :
                        application.status === "Completed" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}>
                        {application.status}
                      </span>
                    </div>
                  </div>

                  {/* SLA processing display */}
                  {sla && daysInfo && (
                    <div className="mt-6 bg-slate-950/65 border border-slate-850 p-5 rounded-2xl">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t("status.sla_est")}</h4>
                        <span className="text-xs font-bold text-blue-400">
                          {sla.processing_days} {t("status.days")} Total
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                        {language === "id" ? sla.description_id : sla.description_en}
                      </p>
                      
                      {/* Visual progress bar */}
                      <div className="w-full bg-slate-900 rounded-full h-2 mb-2 overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${daysInfo.isOverdue ? "bg-red-500" : "bg-blue-500"}`} 
                          style={{ width: `${Math.min(100, (daysInfo.elapsed / daysInfo.total) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-slate-500">
                        <span>{daysInfo.elapsed} {t("status.days")} Elapsed</span>
                        <span className={daysInfo.isOverdue ? "text-red-400" : "text-emerald-400"}>
                          {daysInfo.remaining} {t("status.days")} {daysInfo.isOverdue ? t("status.overdue") : t("status.remaining")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Audit Trail Log History */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                  <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
                    <span>📜</span> {t("status.audit_title")}
                  </h2>
                  {auditLogs.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4">{t("status.audit_empty")}</p>
                  ) : (
                    <div className="relative border-l border-slate-800/80 ml-3 pl-6 space-y-6">
                      {auditLogs.map((log, idx) => (
                        <div key={log.id} className="relative">
                          {/* Dot marker */}
                          <div className={`absolute left-[-30px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                            idx === 0 ? "bg-blue-500 ring-4 ring-blue-500/20" : "bg-slate-800"
                          }`} />
                          <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-2xl">
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                log.status === "Pending" ? "bg-yellow-500/10 text-yellow-500" :
                                log.status === "Verified" ? "bg-blue-500/10 text-blue-500" :
                                log.status === "In Progress" ? "bg-indigo-500/10 text-indigo-500" :
                                log.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" :
                                "bg-red-500/10 text-red-500"
                              }`}>
                                {log.status}
                              </span>
                              <span className="text-[10px] text-slate-650 font-semibold font-mono">
                                {new Date(log.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium mt-2">{log.notes || t("admin.modal_no_notes")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Invoice & Uploaded Documents (Spans 1 column) */}
              <div className="space-y-8">
                
                {/* Quotation / Invoice System Card (Commented out for payment system deferral) */}
                {/* 
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-md font-bold mb-4 text-slate-100 flex items-center gap-2">
                    <span>💵</span> {t("status.invoice_title")}
                  </h3>

                  {!quotation ? (
                    <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-850 text-center">
                      <span className="text-3xl block mb-2 opacity-30">📭</span>
                      <p className="text-xs text-slate-500 italic">{t("status.invoice_none")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-950/60 p-5 border border-slate-850 rounded-2xl space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Invoice ID</span>
                            <span className="text-xs font-bold text-slate-300 font-mono">#INV-{quotation.id}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            quotation.status === "Paid" ? "bg-emerald-500/10 text-emerald-500" :
                            quotation.status === "Sent" ? "bg-blue-500/10 text-blue-500" :
                            quotation.status === "Cancelled" ? "bg-red-500/10 text-red-500" :
                            "bg-yellow-500/10 text-yellow-500"
                          }`}>
                            {quotation.status === "Sent" ? "UNPAID" : quotation.status}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">{t("status.invoice_amount")}</span>
                          <strong className="text-lg text-slate-100 font-black tracking-tight">
                            {quotation.currency} {parseFloat(quotation.amount).toLocaleString(language === "id" ? "id-ID" : "en-US", { minimumFractionDigits: 2 })}
                          </strong>
                        </div>

                        {quotation.due_date && (
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">{t("status.invoice_due")}</span>
                            <span className="text-xs text-slate-350 font-medium font-mono">{new Date(quotation.due_date).toLocaleDateString()}</span>
                          </div>
                        )}

                        {quotation.paid_at && (
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">{t("status.q_paid_at")}</span>
                            <span className="text-xs text-emerald-400 font-semibold font-mono">{new Date(quotation.paid_at).toLocaleString()}</span>
                          </div>
                        )}

                        {quotation.notes && (
                          <div className="pt-2 border-t border-slate-900">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">{t("status.invoice_notes")}</span>
                            <p className="text-xs text-slate-400 italic leading-relaxed">{quotation.notes}</p>
                          </div>
                        )}
                      </div>

                      {quotation.status === "Sent" && (
                        <a
                          href={`https://wa.me/6289518024088?text=Hi%20Nukarsa,%20I%20want%20to%20confirm%20payment%20for%20Invoice%20%23INV-${quotation.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 active:scale-95 shadow-lg text-xs tracking-wider uppercase"
                        >
                          💸 Confirm Payment via WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                </div>
                */}

                {/* Uploaded Documents List */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-md font-bold mb-4 text-slate-100 flex items-center gap-2">
                    <span>📂</span> {t("status.docs_title")}
                  </h3>
                  {documents.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4">{t("admin.modal_doc_empty")}</p>
                  ) : (
                    <div className="space-y-2">
                      {documents.map((doc, idx) => (
                        <a
                          key={doc.id}
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-xs transition-all text-slate-300 font-medium group cursor-pointer"
                        >
                          <span className="truncate max-w-[80%]">📄 {doc.doc_type || `Document ${idx+1}`}</span>
                          <span className="text-blue-500 group-hover:translate-x-1 transition-transform inline-block">➔</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function StatusTrackerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-bold tracking-wider">Loading N-IMS Tracker...</h2>
          </div>
        </div>
      }
    >
      <StatusTrackerContent />
    </Suspense>
  );
}
