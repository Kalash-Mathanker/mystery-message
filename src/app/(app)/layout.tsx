import Navbar from "@/components/custom/Navbar";

interface DashLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: DashLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
    </div>
  );
}