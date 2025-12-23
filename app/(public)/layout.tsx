import Navbar from '@/module/public/shared/components/navbar/public-navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
