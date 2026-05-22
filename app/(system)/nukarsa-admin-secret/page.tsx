"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AdminDashboard() {
  const [apps, setApps] = useState<any[]>([]);

  // 1. Ambil data pendaftar & link dokumennya
  const fetchApps = async () => {
    const { data } = await supabase
      .from("applications")
      .select("*, documents(file_url)")
      .order("id", { ascending: false });
    if (data) setApps(data);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // 2. Fungsi Update Status
  const updateStatus = async (appId: number, newStatus: string) => {
    try {
      // 1. Update tabel utama
      const { error: errorApp } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", appId);

      if (errorApp) throw errorApp;

      // 2. Simpan history (PASTIKAN NAMA TABEL & KOLOM SESUAI)
      const { error: errorLog } = await supabase.from("status_updates").insert([
        {
          application_id: appId,
          status: newStatus,
          notes: "Admin updated the status.",
        },
      ]);

      if (errorLog) {
        console.error("Gagal simpan log:", errorLog.message);
        alert("Status berubah, tapi log gagal simpan: " + errorLog.message);
      } else {
        alert("Success: Status & Log Updated!");
      }

      fetchApps(); // Refresh tampilan tabel di webw
    } catch (err: any) {
      console.error("Error total:", err.message);
      alert("Terjadi kesalahan: " + err.message);
    }
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-8">N-IMS Command Center</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Visa Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Passport</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-medium">{app.full_name}</td>
                <td className="p-4">{app.visa_type}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-4">
                  {app.documents?.[0]?.file_url ? (
                    <a
                      href={app.documents[0].file_url}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      View File
                    </a>
                  ) : (
                    "No File"
                  )}
                </td>
                <td className="p-4">
                  <select
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="border p-2 rounded bg-white"
                  >
                    <option value="">Change Status</option>
                    <option value="Verified">Verified</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
