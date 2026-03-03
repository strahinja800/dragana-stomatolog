export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="gradient-hero flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="p-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} DENTALHOLIST KONCEPT. Sva prava zadržana.
      </footer>
    </div>
  );
};
