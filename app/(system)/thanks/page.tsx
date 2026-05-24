"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

function ThanksContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Valued Client";

  const waText = encodeURIComponent(
    `Hi Nukarsa, I have just successfully submitted my passport and visa registration details via N-IMS under the name "${name}". Please review it. Thank you!`
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-900/15 rounded-full blur-[120px] pointer-events-none"></div>

      <FadeIn scale={0.9} className="max-w-md w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 text-4xl animate-bounce">
          🎉
        </div>
        <h1 className="text-3xl font-black text-slate-100 mb-4 tracking-tight">
          Submission Received!
        </h1>
        <p className="text-slate-400 mb-2 font-bold text-sm">
          Thank you, <span className="text-emerald-400 font-extrabold">{name}</span>!
        </p>
        <p className="text-slate-400 mb-8 text-xs leading-relaxed max-w-xs mx-auto">
          Your visa application data and passport documents have been safely uploaded to N-IMS under secure, state-of-the-art encryption protocols.
        </p>
        
        {/* Tombol lapor balik ke WhatsApp */}
        <div className="space-y-4">
          <a 
            href={`https://wa.me/628569998331?text=${waText}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm via WhatsApp
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
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold tracking-wider">Completing Registration...</h2>
        </div>
      </div>
    }>
      <ThanksContent />
    </Suspense>
  );
}