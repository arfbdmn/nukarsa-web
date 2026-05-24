import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";

export const metadata: Metadata = {
  title: "NUKARSA - Immigration Service",
  description: "Serving You in Every Step of Immigration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body
        className="min-h-full flex flex-col bg-white text-slate-800 font-sans"
        suppressHydrationWarning={true}
      >
        <LanguageProvider>
          <main className="grow flex flex-col">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
