"use client";

/**
 * Admin dashboard page for the N-IMS Command Center.
 * Features: application management, token generation, status updates, and audit logs.
 * Uses i18n for bilingual support (EN/ID).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import FadeIn from "@/components/FadeIn";
import { useLanguage, LanguageToggle } from "@/components/LanguageContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Tabs: 'applications' | 'generator'
  const [activeTab, setActiveTab] = useState<"applications" | "generator">("applications");

  // Data States
  const [apps, setApps] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Detail Modal States
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [statusLogs, setStatusLogs] = useState<any[]>([]);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Token Generator States
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatingToken, setGeneratingToken] = useState(false);

  // Filtering / Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // 1. Session Protection check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUser(session.user);
        setSessionChecked(true);
      }
    };
    checkSession();
  }, [router]);

  // 2. Fetch Applications with details
  const fetchApps = async () => {
    setLoadingApps(true);
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*, documents(file_url)")
        .order("id", { ascending: false });

      if (error) throw error;
      setApps(data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  // 3. Fetch Invitation Tokens
  const fetchTokens = async () => {
    try {
      const { data, error } = await supabase
        .from("booking_tokens")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTokens(data || []);
    } catch (err) {
      console.error("Error fetching tokens:", err);
    }
  };

  // 4. Realtime Listener Subscription
  useEffect(() => {
    if (!sessionChecked) return;

    fetchApps();
    fetchTokens();

    // Subscribe to applications modifications
    const appsChannel = supabase
      .channel("realtime-apps-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        (payload) => {
          console.log("Realtime application update:", payload);
          fetchApps();
        }
      )
      .subscribe();

    // Subscribe to token updates
    const tokensChannel = supabase
      .channel("realtime-tokens-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_tokens" },
        (payload) => {
          console.log("Realtime token update:", payload);
          fetchTokens();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appsChannel);
      supabase.removeChannel(tokensChannel);
    };
  }, [sessionChecked]);

  // 5. Fetch Audit Logs for a specific application
  const fetchAuditLogs = async (appId: number) => {
    try {
      const { data, error } = await supabase
        .from("status_updates")
        .select("*")
        .eq("application_id", appId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStatusLogs(data || []);
    } catch (err) {
      console.error("Error fetching status logs:", err);
    }
  };

  // 6. Select Application and open details
  const handleSelectApp = (app: any) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAdminNotes("");
    fetchAuditLogs(app.id);
  };

  // 7. Update Application Status
  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setUpdatingStatus(true);

    try {
      // A. Update applications table status
      const { error: appError } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", selectedApp.id);

      if (appError) throw appError;

      // B. Insert logs into status_updates table
      const { error: logError } = await supabase
        .from("status_updates")
        .insert([
          {
            application_id: selectedApp.id,
            status: newStatus,
            notes: adminNotes || `Status updated to ${newStatus} by Administrator.`,
          },
        ]);

      if (logError) throw logError;

      // C. Refresh local states
      await fetchApps();
      await fetchAuditLogs(selectedApp.id);
      
      // Update selected app state
      setSelectedApp((prev: any) => ({ ...prev, status: newStatus }));
      setAdminNotes("");
      alert("Success: Applicant status successfully updated!");
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert("Error: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // 8. Generate Booking Invitation Token
  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return alert("Please enter client name!");
    setGeneratedLink("");
    setGeneratingToken(true);

    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + parseInt(expiryDays));

      const { data, error } = await supabase
        .from("booking_tokens")
        .insert([
          {
            client_name: clientName,
            client_email: clientEmail || null,
            expires_at: expiry.toISOString(),
            status: "active",
          },
        ])
        .select();

      if (error) throw error;

      const tokenUuid = data[0].id;
      const origin = window.location.origin;
      const inviteUrl = `${origin}/booking?token=${tokenUuid}`;

      setGeneratedLink(inviteUrl);
      setClientName("");
      setClientEmail("");
      await fetchTokens();
    } catch (err: any) {
      console.error("Token generation failed:", err);
      alert("Error generating token: " + err.message);
    } finally {
      setGeneratingToken(false);
    }
  };

  // 9. Sign Out Action
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // 10. Filter applications list
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.passport_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.country && app.country.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Count summaries
  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "Pending").length,
    inProgress: apps.filter((a) => a.status === "In Progress").length,
    completed: apps.filter((a) => a.status === "Completed").length,
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold tracking-wider">{t("admin.loading")}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Panel */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">{t("admin.header_title")}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t("admin.header_subtitle")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 font-semibold text-slate-300 hidden sm:inline-block">
              Admin: {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/20 transition-all cursor-pointer min-h-[44px]"
            >
              {t("admin.sign_out")}
            </button>
          </div>
        </div>
      </header>

      <div className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Panel / Dashboard metrics */}
        <aside className="lg:w-1/4 flex flex-col gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t("admin.metrics_title")}</h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold uppercase">{t("admin.total")}</p>
                <p className="text-3xl font-black text-blue-500 mt-1">{stats.total}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold uppercase">{t("admin.pending")}</p>
                <p className="text-3xl font-black text-yellow-500 mt-1">{stats.pending}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold uppercase">{t("admin.in_progress")}</p>
                <p className="text-3xl font-black text-indigo-500 mt-1">{stats.inProgress}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold uppercase">{t("admin.completed")}</p>
                <p className="text-3xl font-black text-emerald-500 mt-1">{stats.completed}</p>
              </div>
            </div>
          </div>

          {/* Quick Menu Selection */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("applications")}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer min-h-[44px] ${
                activeTab === "applications"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/10"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              📄 {t("admin.tab_applications")}
            </button>
            <button
              onClick={() => setActiveTab("generator")}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer min-h-[44px] ${
                activeTab === "generator"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/10"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              🔑 {t("admin.tab_generator")}
            </button>
          </div>
        </aside>

        {/* Right Main Content area */}
        <main className="lg:w-3/4 flex flex-col gap-6">
          
          {/* TAB 1: APPLICATIONS TABLE */}
          {activeTab === "applications" && (
            <FadeIn delay={0.05} className="flex flex-col gap-6">
              
              {/* Search & Filter Header */}
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:w-1/2 relative">
                  <input
                    type="text"
                    placeholder={t("admin.search_placeholder")}
                    value={searchQuery}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-650 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium text-sm min-h-[44px]"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-600 text-sm">🔍</span>
                </div>

                <div className="w-full md:w-auto flex items-center gap-2 self-stretch md:self-auto">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mr-2 shrink-0">{t("admin.filter_label")}</span>
                  <select
                    value={statusFilter}
                    className="grow md:grow-0 bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 cursor-pointer min-h-[44px]"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">{t("admin.filter_all")}</option>
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Table card */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        <th className="p-5">{t("admin.th_name")}</th>
                        <th className="p-5">{t("admin.th_country")}</th>
                        <th className="p-5">{t("admin.th_visa")}</th>
                        <th className="p-5">{t("admin.th_status")}</th>
                        <th className="p-5 text-right">{t("admin.th_actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingApps ? (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-500 font-medium">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            {t("admin.loading_db")}
                          </td>
                        </tr>
                      ) : filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-500 font-bold text-sm">
                            🚫 {t("admin.no_apps")}
                          </td>
                        </tr>
                      ) : (
                        filteredApps.map((app) => (
                          <tr
                            key={app.id}
                            className="border-b border-slate-800 hover:bg-slate-900/30 transition-all group"
                          >
                            <td className="p-5 font-bold text-white group-hover:text-blue-400 transition-colors">
                              {app.full_name}
                            </td>
                            <td className="p-5 text-sm text-slate-400 font-semibold">
                              {app.country || "N/A"}
                            </td>
                            <td className="p-5 text-sm text-slate-400">
                              <span className="bg-slate-950 border border-slate-850 px-3 py-1 rounded-full text-xs font-bold text-slate-300">
                                {app.visa_type}
                              </span>
                            </td>
                            <td className="p-5">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  app.status === "Pending"
                                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                    : app.status === "Verified"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : app.status === "In Progress"
                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                    : app.status === "Completed"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="p-5 text-right">
                              <button
                                onClick={() => handleSelectApp(app)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 min-h-[44px]"
                              >
                                {t("admin.btn_manage")}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>
          )}

          {/* TAB 2: INVITATION TOKEN ISSUER */}
          {activeTab === "generator" && (
            <FadeIn delay={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Generator Form */}
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col gap-6 h-fit">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">🔑 {t("admin.gen_title")}</h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {t("admin.gen_desc")}
                  </p>
                </div>

                <form onSubmit={handleGenerateToken} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      {t("admin.gen_name_label")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("admin.gen_name_placeholder")}
                      value={clientName}
                      required
                      className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-700 focus:border-blue-500 outline-none transition-all font-semibold min-h-[44px]"
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      {t("admin.gen_email_label")}
                    </label>
                    <input
                      type="email"
                      placeholder={t("admin.gen_email_placeholder")}
                      value={clientEmail}
                      className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-700 focus:border-blue-500 outline-none transition-all font-semibold min-h-[44px]"
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      {t("admin.gen_validity_label")}
                    </label>
                    <select
                      value={expiryDays}
                      className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-blue-500 outline-none transition-all font-semibold bg-no-repeat cursor-pointer min-h-[44px]"
                      onChange={(e) => setExpiryDays(e.target.value)}
                    >
                      <option value="1">{t("admin.gen_opt_24h")}</option>
                      <option value="3">{t("admin.gen_opt_3d")}</option>
                      <option value="7">{t("admin.gen_opt_7d")}</option>
                      <option value="30">{t("admin.gen_opt_30d")}</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={generatingToken}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg active:scale-95 disabled:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer mt-4 min-h-[44px]"
                  >
                    {generatingToken ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t("admin.gen_generating")}
                      </>
                    ) : (
                      t("admin.gen_btn")
                    )}
                  </button>
                </form>

                {generatedLink && (
                  <div className="mt-4 p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col gap-3">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{t("admin.gen_ready")}</p>
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="w-full p-3 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 text-xs font-mono select-all outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedLink);
                        alert("Success: Secure invitation link copied to clipboard!");
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition-all cursor-pointer shadow active:scale-95 min-h-[44px]"
                    >
                      {t("admin.gen_copy")}
                    </button>
                  </div>
                )}
              </div>

              {/* Tokens list */}
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col gap-4 overflow-hidden">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{t("admin.tokens_title")}</h2>
                  <p className="text-xs text-slate-400 mt-1">{t("admin.tokens_desc")}</p>
                </div>

                <div className="grow overflow-y-auto max-h-[460px] space-y-4 pr-1">
                  {tokens.length === 0 ? (
                    <p className="text-slate-500 text-xs py-10 text-center font-semibold">{t("admin.tokens_empty")}</p>
                  ) : (
                    tokens.map((tokenItem) => (
                      <div
                        key={tokenItem.id}
                        className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex flex-col gap-2 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-sm text-slate-200">{tokenItem.client_name}</p>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              tokenItem.status === "active" && new Date(tokenItem.expires_at) > new Date()
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : tokenItem.status === "used"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {tokenItem.status === "active" && new Date(tokenItem.expires_at) < new Date()
                              ? "expired"
                              : tokenItem.status}
                          </span>
                        </div>
                        {tokenItem.client_email && (
                          <p className="text-xs text-slate-500">{tokenItem.client_email}</p>
                        )}
                        <div className="flex items-center justify-between text-[10px] text-slate-650 border-t border-slate-900 pt-2 mt-1">
                          <p>{t("admin.tokens_expires")} {new Date(tokenItem.expires_at).toLocaleDateString()}</p>
                          <button
                            onClick={() => {
                              const inviteUrl = `${window.location.origin}/booking?token=${tokenItem.id}`;
                              navigator.clipboard.writeText(inviteUrl);
                              alert("Success: Token link copied!");
                            }}
                            disabled={tokenItem.status !== "active" || new Date(tokenItem.expires_at) < new Date()}
                            className="text-blue-500 hover:text-blue-400 font-bold disabled:text-slate-700 cursor-pointer"
                          >
                            {t("admin.tokens_copy")}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </FadeIn>
          )}

        </main>
      </div>

      {/* DETAIL MODAL PANEL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedApp.full_name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  {t("admin.modal_applicant_id")} #{selectedApp.id} | {t("admin.modal_country")} {selectedApp.country || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white text-2xl font-semibold cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grow flex flex-col md:flex-row gap-8">
              
              {/* Left Column: Data info & doc download */}
              <div className="md:w-1/2 flex flex-col gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t("admin.modal_details")}</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{t("admin.modal_identity")}</p>
                      <p className="text-sm font-semibold text-slate-200 mt-1">{selectedApp.identity_card || t("admin.modal_not_specified")}</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{t("admin.modal_passport")}</p>
                      <p className="text-sm font-semibold text-slate-200 mt-1">{selectedApp.passport_number}</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{t("admin.modal_visa")}</p>
                      <p className="text-sm font-semibold text-slate-200 mt-1">{selectedApp.visa_type}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t("admin.modal_doc_title")}</h4>
                  {selectedApp.documents?.[0]?.file_url ? (
                    <a
                      href={selectedApp.documents[0].file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-center text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[44px]"
                    >
                      📄 {t("admin.modal_doc_download")}
                    </a>
                  ) : (
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center text-slate-500 text-xs font-medium">
                      {t("admin.modal_doc_empty")}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Status modifier & logs list */}
              <div className="md:w-1/2 flex flex-col gap-6">
                
                {/* Status Switcher form */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("admin.modal_status_title")}</h4>
                  
                  <div className="flex gap-2">
                    <select
                      value={newStatus}
                      className="grow bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 cursor-pointer min-h-[44px]"
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                      {t("admin.modal_notes_label")}
                    </label>
                    <textarea
                      placeholder={t("admin.modal_notes_placeholder")}
                      rows={2}
                      value={adminNotes}
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder:text-slate-600 focus:border-blue-500 outline-none transition-all resize-none font-medium"
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow cursor-pointer disabled:bg-slate-800 min-h-[44px]"
                  >
                    {updatingStatus ? t("admin.modal_processing") : t("admin.modal_commit")}
                  </button>
                </div>

                {/* Audit history list */}
                <div className="flex flex-col gap-3 grow max-h-[220px]">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("admin.modal_audit_title")}</h4>
                  <div className="grow overflow-y-auto space-y-3 pr-1">
                    {statusLogs.length === 0 ? (
                      <p className="text-slate-600 text-[10px] text-center font-semibold py-6">{t("admin.modal_audit_empty")}</p>
                    ) : (
                      statusLogs.map((log) => (
                        <div key={log.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col gap-1 text-[11px]">
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-bold text-blue-400 uppercase tracking-wider text-[9px]">
                              {log.status}
                            </span>
                            <span className="text-[9px] text-slate-500 font-medium">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-1 leading-relaxed font-medium">
                            {log.notes || t("admin.modal_no_notes")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
