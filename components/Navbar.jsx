"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-slate-900 backdrop-blur-md z-100 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-slate-100 tracking-tighter"
        >
          NUKARSA
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-100 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>

          {/* Dropdown Company */}
          <div className="relative group">
            <button className="text-sm font-semibold text-slate-100 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
              Company
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className="absolute top-full -left-4 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-56">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden">
                <Link
                  href="/about"
                  className="block px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  Tentang Perusahaan
                </Link>
                <Link
                  href="/legality"
                  className="block px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  Keabsahan / Legalitas
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/services"
            className="text-sm font-semibold text-slate-100 hover:text-blue-600 transition-colors"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg "
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
