export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Centered Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} DentalCare. Sva prava zadržana.
      </footer>
    </div>
  );
};
