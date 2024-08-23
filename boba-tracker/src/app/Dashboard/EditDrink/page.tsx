"use client";
import { useAuth } from '@/src/app/context/AuthContext'; 
import EditDrinkPage from './EditDrinkPage';
import { ScaleLoader } from 'react-spinners';
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
      <EditDrinkPage />
    </div>
  );
}

export default Dashboard;
