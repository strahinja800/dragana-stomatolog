import Footer from '@/module/public/shared/components/footer/public-footer';
import Navbar from '@/module/public/shared/components/navbar/public-navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
