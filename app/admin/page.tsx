"use client";

/**
 * Admin dashboard page for the N-IMS Command Center.
 * Features: 
 *  1. Applications management (Status updates & audit trail)
 *  2. Booking Token generator (Single-use credentials link)
 *  3. Quotation & Invoice system (Create/edit billing fees per application)
 *  4. Inbound Token Requests approvals/rejections (with auto token generation)
 *  5. Notification logs system audits
 *  6. Desktop and In-App Notifications Toast Systems for inbound requests
 *  7. Direct Admin File Uploader for E-Visas (PDF/Images)
 * Uses i18n for bilingual support (EN/ID) and Realtime Supabase updates.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import FadeIn from "@/components/FadeIn";
import { useLanguage, LanguageToggle } from "@/components/LanguageContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Tabs: 'applications' | 'generator' | 'quotations' | 'requests'
  const [activeTab, setActiveTab] = useState<"applications" | "generator" | "quotations" | "requests">("applications");

  // Data States
  const [apps, setApps] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [tokenRequests, setTokenRequests] = useState<any[]>([]);

  // Loading indicators
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Detail Modal States
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [statusLogs, setStatusLogs] = useState<any[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<any[]>([]);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

  // E-Visa Admin Uploader States
  const [evisaFile, setEvisaFile] = useState<File | null>(null);
  const [uploadingEvisa, setUploadingEvisa] = useState(false);

  // Dynamic In-App Notifications Toasts
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  // Token Generator States
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatingToken, setGeneratingToken] = useState(false);

  // Quotation System Form States
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<number | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    application_id: "",
    amount: "",
    currency: "IDR",
    status: "Draft",
    notes: "",
    due_date: "",
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Token Request Rejection States
  const [rejectingRequestId, setRejectingRequestId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

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

  // Request HTML5 notification permissions on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Trigger both Desktop Notification & In-app Toast alert
  const triggerNotification = (message: string) => {
    // 1. HTML5 Desktop notification
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("N-IMS Command Center", {
          body: message,
        });
      } catch (err) {
        console.warn("Desktop notification trigger failed:", err);
      }
    }
    // 2. In-app Toast
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  };

  // 2. Fetch Applications with details
  const fetchApps = async () => {
    setLoadingApps(true);
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*, documents(file_url, doc_type)")
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

  // 4. Fetch Quotations/Invoices (Commented out for payment system deferral)
  /*
  const fetchQuotations = async () => {
    setLoadingQuotes(true);
    try {
      const { data, error } = await supabase
        .from("quotations")
        .select("*, applications(full_name, visa_type)")
        .order("id", { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (err) {
      console.error("Error fetching quotations:", err);
    } finally {
      setLoadingQuotes(false);
    }
  };
  */

  // 5. Fetch Inbound Self-Service Token Requests
  const fetchTokenRequests = async () => {
    setLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from("token_requests")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setTokenRequests(data || []);
    } catch (err) {
      console.error("Error fetching token requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (!sessionChecked) return;

    fetchApps();
    fetchTokens();
    // fetchQuotations(); // Commented out for payment system deferral
    fetchTokenRequests();

    // Subscribe to Postgres INSERT changes on applications to trigger notifications
    const appsChannel = supabase
      .channel("realtime-apps-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "applications" },
        (payload: any) => {
          triggerNotification(`📄 New Visa Application submitted by ${payload.new.full_name}!`);
          fetchApps();
        }
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => fetchApps())
      .subscribe();

    const tokensChannel = supabase
      .channel("realtime-tokens-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "booking_tokens" }, () => fetchTokens())
      .subscribe();

    /* Commented out for payment system deferral
    const quotesChannel = supabase
      .channel("realtime-quotes-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "quotations" }, () => fetchQuotations())
      .subscribe();
    */

    // Subscribe to Postgres INSERT changes on token_requests to trigger notifications
    const reqsChannel = supabase
      .channel("realtime-reqs-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "token_requests" },
        (payload: any) => {
          triggerNotification(`📩 New Token Request received from ${payload.new.full_name}!`);
          fetchTokenRequests();
        }
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "token_requests" }, () => fetchTokenRequests())
      .subscribe();

    return () => {
      supabase.removeChannel(appsChannel);
      supabase.removeChannel(tokensChannel);
      // supabase.removeChannel(quotesChannel); // Commented out for payment system deferral
      supabase.removeChannel(reqsChannel);
    };
  }, [sessionChecked]);

  // 7. Fetch Audit Logs & Notification Logs for a specific application
  const fetchAuditAndNotifLogs = async (appId: number) => {
    try {
      const { data: logsData, error: logsError } = await supabase
        .from("status_updates")
        .select("*")
        .eq("application_id", appId)
        .order("created_at", { ascending: false });

      if (logsError) throw logsError;
      setStatusLogs(logsData || []);

      const { data: notifData, error: notifError } = await supabase
        .from("notification_logs")
        .select("*")
        .eq("application_id", appId)
        .order("created_at", { ascending: false });

      if (notifError) throw notifError;
      setNotificationLogs(notifData || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  // 8. Select Application and open details modal
  const handleSelectApp = (app: any) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAdminNotes("");
    setSelectedDocIndex(0);
    setEvisaFile(null);
    fetchAuditAndNotifLogs(app.id);
  };

  // 9. Update Application Status & Log automatic notification audits
  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setUpdatingStatus(true);

    try {
      // A. Update application status
      const { error: appError } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", selectedApp.id);

      if (appError) throw appError;

      // B. Insert log entry to status_updates (audit history)
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

      // C. Insert automatic entry to notification_logs (Sistem notification dispatch)
      const notifMsg = `Notification: Visa process status updated to "${newStatus}" for applicant ${selectedApp.full_name}. WhatsApp and Email notification triggers queued.`;
      await supabase
        .from("notification_logs")
        .insert([
          {
            application_id: selectedApp.id,
            channel: "system",
            message: notifMsg,
            triggered_by: "admin",
          },
        ]);

      // D. Refresh local states
      await fetchApps();
      await fetchAuditAndNotifLogs(selectedApp.id);

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

  // Upload final E-Visa PDF/Image file
  const handleUploadEvisa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evisaFile || !selectedApp) return alert("Please select a file to upload first!");
    setUploadingEvisa(true);

    try {
      // 1. Upload E-Visa file to Storage bucket
      const fileName = `${Date.now()}-evisa-${selectedApp.id}-${evisaFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("nukarsa-files")
        .upload(fileName, evisaFile);

      if (storageError) throw storageError;

      // 2. Fetch public url of uploaded file
      const { data: { publicUrl } } = supabase.storage.from("nukarsa-files").getPublicUrl(fileName);

      // 3. Save link to documents table with doc_type 'E-Visa'
      const { error: docError } = await supabase
        .from("documents")
        .insert([
          {
            application_id: selectedApp.id,
            file_url: publicUrl,
            doc_type: "E-Visa",
          },
        ]);

      if (docError) throw docError;

      // 4. Log to status updates audit trail
      await supabase
        .from("status_updates")
        .insert([
          {
            application_id: selectedApp.id,
            status: selectedApp.status,
            notes: "Final digital E-Visa / Stay Permit PDF uploaded securely by Administrator.",
          },
        ]);

      // 5. Log to notification audits logs
      await supabase
        .from("notification_logs")
        .insert([
          {
            application_id: selectedApp.id,
            channel: "system",
            message: `E-Visa PDF document successfully published to Client status portal for instant remote download.`,
            triggered_by: "admin",
          },
        ]);

      // 6. Refresh modal and application details
      await fetchApps();
      await fetchAuditAndNotifLogs(selectedApp.id);

      const { data: refreshedDocs } = await supabase
        .from("documents")
        .select("*")
        .eq("application_id", selectedApp.id);

      setSelectedApp((prev: any) => ({
        ...prev,
        documents: refreshedDocs || [],
      }));

      setEvisaFile(null);
      alert("Success: Digital E-Visa PDF successfully published to the client tracker!");
    } catch (err: any) {
      console.error(err);
      alert("E-Visa upload failed: " + err.message);
    } finally {
      setUploadingEvisa(false);
    }
  };

  // 10. Generate Booking Invitation Token
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
      const inviteUrl = `${window.location.origin}/booking?token=${tokenUuid}`;

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

  // 11. Create or Update Invoice / Quotation (Commented out for payment system deferral)
  /*
  const handleCreateOrUpdateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.application_id) return alert("Please select an application!");
    if (!quoteForm.amount) return alert("Please enter amount!");

    setSubmittingQuote(true);

    try {
      const payload: any = {
        application_id: parseInt(quoteForm.application_id),
        amount: parseFloat(quoteForm.amount),
        currency: quoteForm.currency,
        status: quoteForm.status,
        notes: quoteForm.notes || null,
        due_date: quoteForm.due_date ? new Date(quoteForm.due_date).toISOString() : null,
      };

      if (quoteForm.status === "Paid") {
        payload.paid_at = new Date().toISOString();
      }

      if (isEditingQuote && editingQuoteId) {
        const { error } = await supabase
          .from("quotations")
          .update(payload)
          .eq("id", editingQuoteId);

        if (error) throw error;
        alert("Success: Invoice updated successfully!");
      } else {
        const { error } = await supabase
          .from("quotations")
          .insert([payload]);

        if (error) throw error;
        alert("Success: Invoice created successfully!");
      }

      // Reset form
      setQuoteForm({
        application_id: "",
        amount: "",
        currency: "IDR",
        status: "Draft",
        notes: "",
        due_date: "",
      });
      setIsEditingQuote(false);
      setEditingQuoteId(null);
      await fetchQuotations();
    } catch (err: any) {
      console.error("Failed to process quotation:", err);
      alert("Error: " + err.message);
    } finally {
      setSubmittingQuote(false);
    }
  };

  // Populate Quotation Form for editing
  const handleEditQuote = (quote: any) => {
    setIsEditingQuote(true);
    setEditingQuoteId(quote.id);
    setQuoteForm({
      application_id: quote.application_id.toString(),
      amount: quote.amount.toString(),
      currency: quote.currency,
      status: quote.status,
      notes: quote.notes || "",
      due_date: quote.due_date ? new Date(quote.due_date).toISOString().split("T")[0] : "",
    });
  };
  */

  // 12. Approve Token Request from Calon Klien
  const handleApproveRequest = async (req: any) => {
    if (!confirm(`Approve token request for "${req.full_name}"? This will auto-generate a single-use booking link.`)) return;

    try {
      // A. Update status in token_requests
      const { error: reqError } = await supabase
        .from("token_requests")
        .update({ status: "Approved" })
        .eq("id", req.id);

      if (reqError) throw reqError;

      // B. Create Booking Invitation Token
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7); // Default 7 days standard

      const { data: tokenData, error: tokenError } = await supabase
        .from("booking_tokens")
        .insert([
          {
            client_name: req.full_name,
            client_email: req.email || null,
            expires_at: expiry.toISOString(),
            status: "active",
          },
        ])
        .select();

      if (tokenError) throw tokenError;

      // C. Record notification system audit log
      const tokenUuid = tokenData[0].id;
      const inviteUrl = `${window.location.origin}/booking?token=${tokenUuid}`;

      // Since it's not linked to a finalized application yet, we log to request admin notes or global
      await supabase
        .from("token_requests")
        .update({ admin_notes: `Approved. Secure Link Generated: ${inviteUrl}` })
        .eq("id", req.id);

      alert(`Success: Approved! Secure Booking Link has been generated:\n\n${inviteUrl}\n\nCopied to clipboard!`);
      navigator.clipboard.writeText(inviteUrl);

      await fetchTokenRequests();
      await fetchTokens();
    } catch (err: any) {
      console.error(err);
      alert("Approval error: " + err.message);
    }
  };

  // 13. Reject Token Request
  const handleRejectRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return alert("Please specify rejection notes/reason!");

    try {
      const { error } = await supabase
        .from("token_requests")
        .update({
          status: "Rejected",
          admin_notes: rejectReason,
        })
        .eq("id", rejectingRequestId);

      if (error) throw error;

      alert("Token request rejected successfully.");
      setRejectingRequestId(null);
      setRejectReason("");
      await fetchTokenRequests();
    } catch (err: any) {
      console.error(err);
      alert("Rejection error: " + err.message);
    }
  };

  // 14. Sign Out Action
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // 15. Filter applications list
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.passport_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.country && app.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.email && app.email.toLowerCase().includes(searchQuery.toLowerCase()));

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
      <div className="min-h-screen bg-slate-955 flex items-center justify-center p-6 text-white bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold tracking-wider">{t("admin.loading")}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">

      {/* Visual Glassmorphic Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in text-white text-xs font-semibold"
          >
            <span className="text-xl animate-bounce">🔔</span>
            <p className="flex-1 leading-normal">{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-500 hover:text-white font-bold cursor-pointer text-[10px] uppercase tracking-wider min-h-[30px] min-w-[30px] flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

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
            <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 font-semibold text-slate-300 hidden sm:inline-block font-mono">
              {user?.email}
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

              <div className="bg-slate-955 p-4 rounded-2xl border border-slate-800 bg-slate-950">
                <p className="text-[10px] text-slate-500 font-bold uppercase">{t("admin.in_progress")}</p>
                <p className="text-3xl font-black text-indigo-500 mt-1">{stats.inProgress}</p>
              </div>

              <div className="bg-slate-955 p-4 rounded-2xl border border-slate-800 bg-slate-950">
                <p className="text-[10px] text-slate-500 font-bold uppercase">{t("admin.completed")}</p>
                <p className="text-3xl font-black text-emerald-500 mt-1">{stats.completed}</p>
              </div>
            </div>
          </div>

          {/* Sidebar Menu Selection */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("applications")}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer min-h-[44px] ${activeTab === "applications"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/10"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
            >
              📄 {t("admin.tab_applications")}
            </button>
            <button
              onClick={() => setActiveTab("generator")}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer min-h-[44px] ${activeTab === "generator"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/10"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
            >
              🔑 {t("admin.tab_generator")}
            </button>
            {/* <button
              onClick={() => setActiveTab("quotations")}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer min-h-[44px] ${
                activeTab === "quotations"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/10"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              💵 {t("admin.tab_quotations")}
            </button> */}
            <button
              onClick={() => setActiveTab("requests")}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between gap-3 cursor-pointer min-h-[44px] ${activeTab === "requests"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/10"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
            >
              <span className="flex items-center gap-3">📩 {t("admin.tab_requests")}</span>
              {tokenRequests.filter((r) => r.status === "Pending").length > 0 && (
                <span className="bg-red-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full ring-2 ring-slate-900 animate-pulse">
                  {tokenRequests.filter((r) => r.status === "Pending").length}
                </span>
              )}
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
                          <td colSpan={5} className="p-20 text-center text-slate-555 font-medium">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            {t("admin.loading_db")}
                          </td>
                        </tr>
                      ) : filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-555 font-bold text-sm">
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
                              <span className="bg-slate-955 border border-slate-850 px-3 py-1 rounded-full text-xs font-bold text-slate-300 bg-slate-950">
                                {app.visa_type}
                              </span>
                            </td>
                            <td className="p-5">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${app.status === "Pending"
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
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t("admin.gen_desc")}</p>
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
                      className="w-full p-4 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-705 focus:border-blue-500 outline-none transition-all font-semibold min-h-[44px] bg-slate-950"
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
                      className="w-full p-4 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-705 focus:border-blue-500 outline-none transition-all font-semibold min-h-[44px] bg-slate-950"
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      {t("admin.gen_validity_label")}
                    </label>
                    <select
                      value={expiryDays}
                      className="w-full p-4 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 focus:border-blue-500 outline-none transition-all font-semibold bg-no-repeat cursor-pointer min-h-[44px] bg-slate-950"
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg active:scale-95 disabled:bg-slate-850 flex items-center justify-center gap-2 cursor-pointer mt-4 min-h-[44px]"
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
                  <div className="mt-4 p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col gap-3 animate-fade-in">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{t("admin.gen_ready")}</p>
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="w-full p-3 bg-slate-955 border border-slate-850 rounded-lg text-slate-200 text-xs font-mono select-all outline-none bg-slate-950"
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
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${tokenItem.status === "active" && new Date(tokenItem.expires_at) > new Date()
                                ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
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
                          <p className="text-xs text-slate-555">{tokenItem.client_email}</p>
                        )}
                        <div className="flex items-center justify-between text-[10px] text-slate-650 border-t border-slate-900 pt-2 mt-1 font-mono">
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

          {/* TAB 3: QUOTATIONS / INVOICES (Commented out for payment system deferral) */}
          {/* 
          {activeTab === "quotations" && (
            <FadeIn delay={0.05} className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="md:col-span-1 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex flex-col gap-6 h-fit">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {isEditingQuote ? "✏️ Edit Invoice" : "💵 New Invoice"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Create visa fee quotation invoices for applicant files.
                  </p>
                </div>

                <form onSubmit={handleCreateOrUpdateQuotation} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      Target Applicant
                    </label>
                    <select
                      value={quoteForm.application_id}
                      disabled={isEditingQuote}
                      required
                      className="w-full p-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 focus:border-blue-500 outline-none transition-all font-semibold text-xs min-h-[44px] cursor-pointer bg-slate-950"
                      onChange={(e) => setQuoteForm({ ...quoteForm, application_id: e.target.value })}
                    >
                      <option value="">-- Choose Applicant --</option>
                      {apps.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.full_name} ({app.visa_type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                        Amount / Cost
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1500000"
                        required
                        value={quoteForm.amount}
                        className="w-full p-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-700 focus:border-blue-500 outline-none transition-all font-semibold text-xs min-h-[44px] bg-slate-955 bg-slate-950"
                        onChange={(e) => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                        Curr
                      </label>
                      <select
                        value={quoteForm.currency}
                        className="w-full p-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 focus:border-blue-500 outline-none transition-all font-semibold text-xs min-h-[44px] cursor-pointer bg-no-repeat bg-slate-955 bg-slate-950"
                        onChange={(e) => setQuoteForm({ ...quoteForm, currency: e.target.value })}
                      >
                        <option value="IDR">IDR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                        Payment Status
                      </label>
                      <select
                        value={quoteForm.status}
                        className="w-full p-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 focus:border-blue-500 outline-none transition-all font-semibold text-xs min-h-[44px] cursor-pointer bg-slate-955 bg-slate-950"
                        onChange={(e) => setQuoteForm({ ...quoteForm, status: e.target.value })}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent (Unpaid)</option>
                        <option value="Paid">Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={quoteForm.due_date}
                        className="w-full p-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 focus:border-blue-500 outline-none transition-all font-semibold text-xs min-h-[44px] bg-slate-955 bg-slate-950"
                        onChange={(e) => setQuoteForm({ ...quoteForm, due_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      Invoice Notes / Terms
                    </label>
                    <textarea
                      placeholder="Enter breakdown details, terms, or account info..."
                      rows={3}
                      value={quoteForm.notes}
                      className="w-full p-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-700 focus:border-blue-500 outline-none transition-all text-xs font-medium resize-none bg-slate-955 bg-slate-950"
                      onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    {isEditingQuote && (
                      <button
                        type="button"
                        className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                        onClick={() => {
                          setIsEditingQuote(false);
                          setEditingQuoteId(null);
                          setQuoteForm({
                            application_id: "",
                            amount: "",
                            currency: "IDR",
                            status: "Draft",
                            notes: "",
                            due_date: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={submittingQuote}
                      className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow active:scale-95 disabled:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer animate-pulse-slow"
                    >
                      {submittingQuote && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin font-bold"></div>}
                      {isEditingQuote ? "Save Changes" : t("admin.q_create_btn")}
                    </button>
                  </div>
                </form>
              </div>

              <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden shadow-xl flex flex-col">
                <div className="p-6 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-white tracking-tight">💵 {t("admin.q_title")}</h2>
                  <p className="text-xs text-slate-400 mt-1">Review list of billing invoices sent to client status portals.</p>
                </div>

                <div className="overflow-x-auto grow">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        <th className="p-4">Inv #</th>
                        <th className="p-4">Client / Visa</th>
                        <th className="p-4">Billing Cost</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingQuotes ? (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-500 font-medium">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            Loading invoice databases...
                          </td>
                        </tr>
                      ) : quotations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-555 font-bold text-xs">
                            💵 No invoice quotations generated yet.
                          </td>
                        </tr>
                      ) : (
                        quotations.map((quote) => (
                          <tr key={quote.id} className="border-b border-slate-800 hover:bg-slate-900/30 transition-all text-xs font-semibold">
                            <td className="p-4 font-mono text-slate-350">#INV-{quote.id}</td>
                            <td className="p-4">
                              <p className="text-white font-bold">{quote.applications?.full_name || "N/A"}</p>
                              <span className="text-[9px] text-slate-500 font-medium">{quote.applications?.visa_type}</span>
                            </td>
                            <td className="p-4 text-slate-200">
                              {quote.currency} {parseFloat(quote.amount).toLocaleString()}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${quote.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                  quote.status === "Sent" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                    quote.status === "Cancelled" ? "bg-red-500/10 text-red-450 border border-red-500/20" :
                                      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                }`}>
                                {quote.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleEditQuote(quote)}
                                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[30px]"
                              >
                                Edit / Update
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
          */}

          {/* TAB 4: INBOUND TOKEN REQUESTS */}
          {activeTab === "requests" && (
            <FadeIn delay={0.05} className="flex flex-col gap-6">

              {/* Inbound Request approvals table card */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden shadow-xl flex flex-col">
                <div className="p-6 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-white tracking-tight">📩 {t("admin.req_title")}</h2>
                  <p className="text-xs text-slate-400 mt-1">Review self-service inbound registration token requests submitted by foreign clients.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        <th className="p-5">Applicant Details</th>
                        <th className="p-5">Visa Requested</th>
                        <th className="p-5">Message Context</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingRequests ? (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-500 font-medium">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            Loading requests records...
                          </td>
                        </tr>
                      ) : tokenRequests.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-555 font-bold text-xs">
                            📩 No inbound token requests received yet.
                          </td>
                        </tr>
                      ) : (
                        tokenRequests.map((req) => (
                          <tr key={req.id} className="border-b border-slate-800 hover:bg-slate-900/30 transition-all text-xs font-semibold">
                            <td className="p-5">
                              <p className="text-white font-bold text-sm">{req.full_name}</p>
                              <span className="text-[10px] text-slate-400 font-mono block mt-1">{req.email}</span>
                              {req.phone ? (
                                <a
                                  href={`https://wa.me/${req.phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold font-mono flex items-center gap-1 mt-1 transition-colors hover:underline cursor-pointer"
                                >
                                  💬 {req.phone}
                                </a>
                              ) : (
                                <span className="text-[10px] text-slate-555 font-mono block">No phone</span>
                              )}
                            </td>
                            <td className="p-5">
                              <span className="bg-slate-955 border border-slate-850 px-3 py-1 rounded-full text-[10px] font-bold text-blue-400 bg-slate-950">
                                {req.visa_type}
                              </span>
                            </td>
                            <td className="p-5 max-w-[240px] truncate-3 text-slate-400 leading-relaxed font-medium font-sans">
                              {req.message || <span className="text-slate-700 italic">No message context.</span>}
                              {req.admin_notes && (
                                <p className="mt-2 text-[10px] text-indigo-400/90 font-mono border-t border-slate-850/50 pt-1 leading-relaxed">
                                  Notes: {req.admin_notes}
                                </p>
                              )}
                            </td>
                            <td className="p-5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${req.status === "Approved" ? "bg-emerald-500/10 text-emerald-455 border border-emerald-500/20" :
                                  req.status === "Rejected" ? "bg-red-500/10 text-red-455 border border-red-500/20" :
                                    "bg-yellow-500/10 text-yellow-455 border border-yellow-500/20"
                                }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-5 text-right">
                              {req.status === "Pending" ? (
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleApproveRequest(req)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-[10px] cursor-pointer min-h-[36px]"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => setRejectingRequestId(req.id)}
                                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 font-bold px-3.5 py-2 rounded-xl text-[10px] cursor-pointer min-h-[36px]"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-650 italic text-[10px]">Action Processed</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reject Reason Modal dialog */}
              {rejectingRequestId && (
                <div className="fixed inset-0 z-50 bg-slate-955/80 backdrop-blur-sm flex items-center justify-center p-6 bg-slate-950/80">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4">
                    <div>
                      <h3 className="text-md font-bold text-white tracking-tight">Reject Token Request</h3>
                      <p className="text-xs text-slate-400 mt-1">Provide reasoning feedback reason sent back to the applicant.</p>
                    </div>

                    <form onSubmit={handleRejectRequestSubmit} className="space-y-4">
                      <textarea
                        required
                        rows={3}
                        placeholder="Rejection reasons (e.g. Visa criteria mismatch, invalid contact numbers...)"
                        value={rejectReason}
                        className="w-full p-3 bg-slate-955 border border-slate-850 rounded-xl text-slate-100 placeholder:text-slate-707 focus:border-blue-500 outline-none transition-all text-xs font-medium resize-none bg-slate-950"
                        onChange={(e) => setRejectReason(e.target.value)}
                      />

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer min-h-[40px]"
                          onClick={() => {
                            setRejectingRequestId(null);
                            setRejectReason("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow cursor-pointer min-h-[40px]"
                        >
                          Reject Request
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </FadeIn>
          )}

        </main>
      </div>

      {/* DETAIL MODAL PANEL FOR APPLICANTS */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-955/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in bg-slate-950/80">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">

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

              {/* Left Column: Data info, doc download, and Admin E-Visa uploader */}
              <div className="md:w-1/2 flex flex-col gap-6 font-semibold">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t("admin.modal_details")}</h4>

                  <div className="space-y-3">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{t("admin.modal_identity")}</p>
                      <p className="text-sm font-semibold text-slate-200 mt-1">{selectedApp.identity_card || t("admin.modal_not_specified")}</p>
                    </div>

                    {selectedApp.no_telephone && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <p className="text-[9px] text-slate-500 font-bold uppercase">{t("admin.modal_telephone")}</p>
                        <p className="text-sm font-semibold text-emerald-450 mt-1">
                          <a
                            href={`https://wa.me/${selectedApp.no_telephone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
                          >
                            💬 {selectedApp.no_telephone}
                          </a>
                        </p>
                      </div>
                    )}

                    {selectedApp.email && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                        <p className="text-[9px] text-slate-500 font-bold uppercase">{t("admin.modal_email")}</p>
                        <p className="text-sm font-semibold text-blue-450 mt-1">
                          <a
                            href={`mailto:${selectedApp.email}`}
                            className="hover:underline flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
                          >
                            ✉️ {selectedApp.email}
                          </a>
                        </p>
                      </div>
                    )}

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

                {/* Uploaded Documents List */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t("admin.modal_doc_title")}</h4>
                  {selectedApp.documents && selectedApp.documents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedApp.documents.length > 1 && (
                        <div>
                          <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                            {t("admin.modal_doc_select")}
                          </label>
                          <select
                            value={selectedDocIndex}
                            className="w-full bg-slate-950 border border-slate-855 px-3 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer min-h-[40px] text-slate-350"
                            onChange={(e) => setSelectedDocIndex(Number(e.target.value))}
                          >
                            {selectedApp.documents.map((doc: any, idx: number) => (
                              <option key={idx} value={idx}>
                                {doc.doc_type || `Document ${idx + 1}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <a
                        href={selectedApp.documents[selectedDocIndex]?.file_url || selectedApp.documents[0].file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-center text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[44px]"
                      >
                        📄 {selectedApp.documents[selectedDocIndex]?.doc_type || t("admin.modal_doc_download")}
                      </a>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center text-slate-555 text-xs font-semibold">
                      {t("admin.modal_doc_empty")}
                    </div>
                  )}

                  {/* Admin Final E-Visa PDF Uploader */}
                  <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col gap-3">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-amber-400">
                      👑 Publish Digital E-Visa (PDF / Image)
                    </label>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      className="text-slate-400 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-600 transition-all file:cursor-pointer cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setEvisaFile(e.target.files[0]);
                        }
                      }}
                    />
                    {evisaFile && (
                      <button
                        onClick={handleUploadEvisa}
                        disabled={uploadingEvisa}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-all shadow active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center gap-1.5 cursor-pointer min-h-[36px]"
                      >
                        {uploadingEvisa ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                            Publishing E-Visa...
                          </>
                        ) : (
                          "📤 Upload & Publish E-Visa"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Status modifier & audits log trail */}
              <div className="md:w-1/2 flex flex-col gap-6">

                {/* Status Update modifier */}
                <div className="bg-slate-955 p-5 rounded-2xl border border-slate-850 flex flex-col gap-4 bg-slate-950/40">
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
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder:text-slate-650 focus:border-blue-500 outline-none transition-all resize-none font-medium"
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow cursor-pointer disabled:bg-slate-850 min-h-[44px]"
                  >
                    {updatingStatus ? t("admin.modal_processing") : t("admin.modal_commit")}
                  </button>
                </div>

                {/* Audit & Notification history lists (Subtabs style in grid) */}
                <div className="grid grid-cols-2 gap-4 grow max-h-[300px] overflow-hidden">

                  {/* Status changes updates */}
                  <div className="flex flex-col gap-3 h-full">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">📋 Status Logs</h4>
                    <div className="grow overflow-y-auto space-y-2 pr-1 max-h-[220px]">
                      {statusLogs.length === 0 ? (
                        <p className="text-slate-700 text-[10px] text-center font-semibold py-6">{t("admin.modal_audit_empty")}</p>
                      ) : (
                        statusLogs.map((log) => (
                          <div key={log.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col gap-1 text-[10px] font-sans">
                            <div className="flex justify-between items-center gap-2 border-b border-slate-900 pb-1">
                              <span className="font-extrabold text-blue-400 uppercase tracking-wider text-[8px]">
                                {log.status}
                              </span>
                              <span className="text-[8px] text-slate-600 font-mono">
                                {new Date(log.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-400 leading-relaxed mt-1 font-medium">
                              {log.notes || t("admin.modal_no_notes")}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Dispatch notification audits */}
                  <div className="flex flex-col gap-3 h-full">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">✉️ Notif Logs</h4>
                    <div className="grow overflow-y-auto space-y-2 pr-1 max-h-[220px]">
                      {notificationLogs.length === 0 ? (
                        <p className="text-slate-700 text-[10px] text-center font-semibold py-6">No notifications sent.</p>
                      ) : (
                        notificationLogs.map((notif) => (
                          <div key={notif.id} className="bg-slate-955 p-3 rounded-xl border border-slate-850 flex flex-col gap-1 text-[10px] font-mono bg-slate-950">
                            <div className="flex justify-between items-center gap-2 border-b border-slate-900 pb-1 font-sans">
                              <span className="font-black text-indigo-400 uppercase tracking-wider text-[8px]">
                                {notif.channel}
                              </span>
                              <span className="text-[8px] text-slate-650 font-mono">
                                {new Date(notif.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-400 leading-relaxed mt-1 text-[9px]">
                              {notif.message}
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
        </div>
      )}

    </div>
  );
}
