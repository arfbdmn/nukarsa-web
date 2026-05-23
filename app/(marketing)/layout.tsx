// app/(marketing)/layout.tsx
import Navbar from "@/components/Navbar";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar /> {/* Navbar hanya akan muncul di halaman publik */}
      <div className="grow">{children}</div>
    </>
  );
}