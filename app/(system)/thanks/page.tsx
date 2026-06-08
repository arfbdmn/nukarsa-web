"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

function ThanksContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Valued Client";
  const token = searchParams.get("token") || "";

  const waText = encodeURIComponent(
    `Hi Nukarsa, I have just successfully submitted my passport and visa registration details via N-IMS under the name "${name}". Please review it. Thank you!`,
  );

  const emailSubject = encodeURIComponent(
    `N-IMS Registration Confirmation - ${name}`
  );
  const emailBody = encodeURIComponent(
    `Hi Nukarsa Team,\n\nI have successfully submitted my visa application details and identity documents via the N-IMS Secure Portal under the name "${name}".\n\nPlease review my registration and confirm the receipt of my documents.\n\nThank you!`
  );
  const emailUrl = `mailto:nukarsa.co@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="min-h-screen bg-slate-955 flex items-center justify-center p-6 text-center text-white relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-900/15 rounded-full blur-[120px] pointer-events-none"></div>

      <FadeIn
        scale={0.9}
        className="max-w-md w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 text-4xl animate-bounce">
          🎉
        </div>
        <h1 className="text-3xl font-black text-slate-100 mb-4 tracking-tight">
          Submission Received!
        </h1>
        <p className="text-slate-400 mb-2 font-bold text-sm">
          Thank you,{" "}
          <span className="text-emerald-400 font-extrabold">{name}</span>!
        </p>
        <p className="text-slate-400 mb-6 text-xs leading-relaxed max-w-xs mx-auto">
          Your visa application data and passport documents have been safely
          uploaded to N-IMS under secure, state-of-the-art encryption protocols.
        </p>

        {/* Tracking Token Info Card */}
        {token && (
          <div className="mb-6 p-4 bg-slate-950/70 border border-slate-850 rounded-2xl flex flex-col gap-2.5 text-center relative overflow-hidden">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">
              🛡️ Secure Tracking ID (UUID)
            </span>
            <span className="text-xs font-mono font-black text-blue-400 select-all tracking-wider block">
              {token}
            </span>
            <p className="text-[10px] text-slate-500 leading-normal max-w-xs mx-auto">
              Simpan kode di atas untuk melacak perkembangan visa Anda kapan saja secara mandiri di menu Lacak Status.
            </p>
            
            <Link
              href={`/status?token=${token}`}
              className="mt-2 block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md active:scale-95 text-center tracking-wider uppercase"
            >
              📊 Lacak Status Visa Saya
            </Link>
          </div>
        )}

        {/* Tombol lapor balik ke WhatsApp dan Email */}
        <div className="space-y-4 pt-2 border-t border-slate-850/50">
          <a
            href={`https://wa.me/6289518024088?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm via WhatsApp
          </a>

          <a
            href={emailUrl}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm via Email
          </a>

          <Link
            href="/"
            className="block w-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold py-4 rounded-xl transition-all duration-300"
          >
            Back to Homepage
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-955 flex items-center justify-center p-6 text-white bg-slate-950">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-bold tracking-wider">
              Completing Registration...
            </h2>
          </div>
        </div>
      }
    >
      <ThanksContent />
    </Suspense>
  );
}
