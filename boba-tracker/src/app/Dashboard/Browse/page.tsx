"use client";
import { useRouter } from "next/navigation";
import BrowseStoresPage from "./BrowseStoresPage";
import { useAuth } from '@/src/app/context/AuthContext'; 
import { useEffect } from "react";
import { ScaleLoader } from "react-spinners";

export default function Browse() {
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
    <div className="flex justify-center">
      <BrowseStoresPage />
    </div>
  );
}

