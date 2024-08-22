"use client";
import { useAuth } from '@/src/app/context/AuthContext'; 
import { ScaleLoader } from 'react-spinners';
import DashboardPage from "./DashboardPage";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/Login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader height={50} width={5} className="mb-20" />
      </div>
    )
  }

  return (
    <div>
      <DashboardPage />
    </div>
  );
}

export default Dashboard;
