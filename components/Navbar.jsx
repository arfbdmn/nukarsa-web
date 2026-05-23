"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-md z-[100] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-slate-100 tracking-tighter">
            NUKARSA
          </Link>

          {/* Desktop Menu (Sembunyi di HP: hidden md:flex) */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-slate-100 hover:text-blue-500 transition-colors">
              Home
            </Link>
            
            {/* Dropdown Company */}
            <div className="relative group">
              <button className="text-sm font-semibold text-slate-100 group-hover:text-blue-500 flex items-center gap-1 transition-colors">
                Company
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute top-full -left-4 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-56">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden">
                  <Link href="/about" className="block px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                    Tentang Perusahaan
                  </Link>
                  <Link href="/legality" className="block px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                    Keabsahan / Legalitas
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/services" className="text-sm font-semibold text-slate-100 hover:text-blue-500 transition-colors">
              Services
            </Link>
            <Link href="/contact" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg">
              Contact Us
            </Link>
          </div>

          {/* Hamburger Button (Hanya muncul di HP: md:hidden) */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-white focus:outline-none z-[110]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel (Slide-down effect) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-950 z-[90] md:hidden pt-24 px-6 flex flex-col gap-6 text-xl"
          >
            <Link onClick={() => setIsOpen(false)} href="/" className="text-slate-200 border-b border-slate-800 pb-3 font-medium">Home</Link>
            <div className="flex flex-col gap-3 border-b border-slate-800 pb-3">
              <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Company</span>
              <Link onClick={() => setIsOpen(false)} href="/about" className="text-slate-200 pl-4 text-lg">Tentang Perusahaan</Link>
              <Link onClick={() => setIsOpen(false)} href="/legality" className="text-slate-200 pl-4 text-lg">Keabsahan / Legalitas</Link>
            </div>
            <Link onClick={() => setIsOpen(false)} href="/services" className="text-slate-200 border-b border-slate-800 pb-3 font-medium">Services</Link>
            <Link onClick={() => setIsOpen(false)} href="/contact" className="bg-blue-600 text-white py-4 rounded-xl text-center font-bold shadow-lg mt-4">
              Contact Us
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}