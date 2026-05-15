'use client'
import Link from 'next/link'

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Submission Received!</h1>
        <p className="text-slate-600 mb-8 text-lg">
          Thank you for choosing NUKARSA. Your data has been securely uploaded to our management system.
        </p>
        
        {/* Tombol lapor balik ke WhatsApp */}
        <a 
          href="https://wa.me/628569998331?text=Hi%20Nukarsa,%20I%20have%20just%20submitted%20my%20data%20via%20N-IMS." 
          className="block w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-all shadow-lg mb-4"
        >
          Confirm via WhatsApp
        </a>
        
        <Link href="/" className="text-blue-600 font-semibold hover:underline">
          Back to Homepage
        </Link>
      </div>
    </div>
  )
}