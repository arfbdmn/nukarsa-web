"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import FadeIn from "@/components/FadeIn";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@nukarsa.id");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Login success
      router.push("/admin");
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMessage(err.message || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Dynamic backdrops */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-900/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none"></div>

      <FadeIn scale={0.95} className="max-w-md w-full bg-slate-900/30 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="text-3xl mb-3">🛡️</div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            N-IMS Login
          </h1>
          <p className="text-slate-400 text-xs mt-2">
            PT. Karsa Ruang Nusantara Command Center
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold leading-relaxed">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Administrator Email
            </label>
            <input
              type="email"
              value={email}
              required
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Secure Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              required
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 font-semibold"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:bg-slate-850 disabled:text-slate-600 flex items-center justify-center gap-2 cursor-pointer mt-8"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Initializing Secured Session...
              </>
            ) : (
              "Access Command Center"
            )}
          </button>
        </form>
      </FadeIn>
    </div>
  );
}
