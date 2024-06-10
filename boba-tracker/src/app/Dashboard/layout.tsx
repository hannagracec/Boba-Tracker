"use client";
import Header from "@/src/components/Dashboard/Header";
import Navbar from "@/src/components/Dashboard/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-off-white h-screen">
      <Header />
      <main>{children}</main>
      <Navbar />
    </div>
  );
}
