import type { Metadata } from "next";
import { ClientsPageContent } from "./ClientsPageContent";

export const metadata: Metadata = {
  title: "Our Clients | Nukarsa",
  description:
    "Perusahaan dan institusi terkemuka di Indonesia yang mempercayakan kebutuhan imigrasi dan legalitas mereka kepada PT. Karsa Ruang Nusantara (NUKARSA).",
};

/**
 * Dedicated clients directory page.
 * Server Component wrapper with metadata; interactive content in a client sub-component.
 */
export default function ClientsPage() {
  return <ClientsPageContent />;
}
