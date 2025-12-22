import Navbar from '@/module/public/shared/components/navbar/public-navbar-server'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
