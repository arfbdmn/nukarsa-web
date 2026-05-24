"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "id";

interface TranslationDictionary {
  [key: string]: {
    en: string;
    id: string;
  };
}

const translations: TranslationDictionary = {
  // Navbar
  nav_home: { en: "Home", id: "Beranda" },
  nav_company: { en: "Company", id: "Perusahaan" },
  nav_about: { en: "About Us", id: "Tentang Kami" },
  nav_legality: { en: "Legality", id: "Legalitas" },
  nav_services: { en: "Services", id: "Layanan" },
  nav_contact: { en: "Contact Us", id: "Hubungi Kami" },

  // Hero Section
  hero_tagline: {
    en: "Serving You Every Step of Immigration",
    id: "Melayani Anda di Setiap Langkah Keimigrasian",
  },
  hero_desc: {
    en: "Trusted Partner for Expatriates and Businesses in Indonesia.",
    id: "Mitra Terpercaya untuk Ekspatriat dan Bisnis di Indonesia.",
  },

  // About Section (Home)
  about_badge: { en: "About NUKARSA", id: "Tentang NUKARSA" },
  about_heading: {
    en: "Trusted Partner for Expatriates and Businesses in Indonesia.",
    id: "Mitra Terpercaya untuk Ekspatriat dan Bisnis di Indonesia.",
  },
  about_p1: {
    en: "Nukarsa is a professional services company operating in the field of immigration management, company establishment (PT/PMA), and legal services in Indonesia.",
    id: "Nukarsa adalah perusahaan jasa profesional yang bergerak di bidang pengurusan keimigrasian, pendirian perusahaan (PT/PMA), serta layanan hukum di Indonesia.",
  },
  about_val1_title: { en: "Integrity & Accuracy", id: "Integritas & Akurasi" },
  about_val1_desc: {
    en: "Guaranteeing every process complies with applicable immigration regulations.",
    id: "Menjamin setiap proses sesuai dengan regulasi keimigrasian yang berlaku.",
  },
  about_val2_title: { en: "Efficient Solutions", id: "Solusi Efisien" },
  about_val2_desc: {
    en: "Providing clear and reliable solutions to simplify complex procedures.",
    id: "Memberikan solusi yang jelas dan andal untuk menyederhanakan prosedur kompleks.",
  },
  about_btn_profile: { en: "View Profile", id: "Lihat Profil" },
  about_floating_badge: { en: "Established", id: "Didirikan" },

  // Value Proposition (Home)
  val_speed_title: { en: "Faster Processing", id: "Pengerjaan Lebih Cepat" },
  val_speed_desc: {
    en: "Efficient solutions to simplify complex legal procedures.",
    id: "Solusi efisien untuk menyederhanakan prosedur hukum yang rumit.",
  },
  val_prof_title: { en: "Professional & Dedicated", id: "Profesional & Dedikatif" },
  val_prof_desc: {
    en: "Committed to integrity, accuracy, and absolute confidentiality.",
    id: "Berkomitmen pada integritas, akurasi, dan kerahasiaan penuh.",
  },
  val_price_title: { en: "Competitive Pricing", id: "Harga Bersaing" },
  val_price_desc: {
    en: "Innovative solutions for long-term business success in Indonesia.",
    id: "Solusi inovatif untuk keberhasilan usaha jangka panjang di Indonesia.",
  },

  // Services Page & Landing Section
  services_heading: { en: "Our Professional Services", id: "Layanan Profesional Kami" },
  services_desc: {
    en: "Reliable solutions to ensure legal compliance and the success of your business venture.",
    id: "Solusi andal untuk memastikan kepatuhan hukum dan keberhasilan usaha Anda.",
  },
  services_cta_title: { en: "Need Custom Consultation?", id: "Butuh Konsultasi Khusus?" },
  services_cta_btn: { en: "Register via N-IMS Now", id: "Daftar via N-IMS Sekarang" },

  // Meet Our Team
  team_heading: { en: "Meet Our Team", id: "Kenali Tim Kami" },

  // Contact Info & Footer
  contact_heading: { en: "Contact Us", id: "Hubungi Kami" },
  contact_desc: {
    en: "We would love to connect with you! Whether you have questions, feedback, or simply want to learn more about our services, our team is here to assist.",
    id: "Kami sangat senang dapat terhubung dengan Anda! Apakah Anda memiliki pertanyaan, masukan, atau ingin tahu lebih banyak tentang layanan kami, tim kami siap membantu.",
  },
  contact_info_title: { en: "Contact Info", id: "Informasi Kontak" },
  contact_info_desc: {
    en: "Contact us anytime, our team is ready to assist you.",
    id: "Hubungi kami kapan saja, tim kami siap membantu Anda.",
  },

  // Legality Page
  legality_heading: { en: "Company Legality", id: "Legalitas Perusahaan" },
  legality_desc: {
    en: "PT. Karsa Ruang Nusantara (NUKARSA) is committed to transparency and full legal compliance in Indonesia.",
    id: "PT. Karsa Ruang Nusantara (NUKARSA) berkomitmen pada transparansi dan kepatuhan hukum penuh di Indonesia.",
  },
  legality_banner_title: { en: "Verified Documents", id: "Dokumen Terverifikasi" },
  legality_banner_desc: {
    en: "All of our operations are governed under the laws of the Republic of Indonesia to provide maximum security for each client.",
    id: "Seluruh operasional kami berada di bawah naungan hukum Republik Indonesia untuk memberikan keamanan maksimal bagi setiap klien kami.",
  },
  legality_card_registered: { en: "Registered since", id: "Terdaftar sejak" },
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const savedLang = localStorage.getItem("nukarsa-lang") as Language;
    if (savedLang === "en" || savedLang === "id") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("nukarsa-lang", lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-slate-950/60 p-1.5 rounded-full border border-slate-800">
      <button
        onClick={() => setLanguage("id")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
          language === "id"
            ? "bg-blue-600 text-white shadow"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        🇮🇩 ID
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
          language === "en"
            ? "bg-blue-600 text-white shadow"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
