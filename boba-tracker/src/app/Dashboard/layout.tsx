import Header from "@/src/components/Dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="bg-off-white h-screen">
        {children}
      </main>
    </div>
  );
}
