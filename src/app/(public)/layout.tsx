import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b  from-[#87c2ec] via-[#EAF4FB] to-[#DCEDF9]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}