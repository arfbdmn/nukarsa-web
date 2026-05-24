import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "NUKARSA - Professional Immigration & Business Services",
  description: "Serving you in every step of immigration. PT. Karsa Ruang Nusantara (NUKARSA) provides elite visa processing (VoA/C2/D2), stay permits (KITAS/KITAP), PT/CV company establishment, and corporate legal services in Indonesia.",
  keywords: ["imigrasi indonesia", "visa indonesia", "kitas indonesia", "setup company pt", "pma indonesia", "nukarsa", "immigration services jakarta", "expats bali"],
  openGraph: {
    title: "NUKARSA - Professional Immigration & Business Services",
    description: "PT. Karsa Ruang Nusantara (NUKARSA) provides professional immigration, stay permits (KITAS), and company establishment services in Indonesia.",
    type: "website",
    locale: "id_ID",
    url: "https://nukarsa.id",
  }
};

export default function Home() {
  return (
    <main>
      <LandingPage />
    </main>
  );
}
