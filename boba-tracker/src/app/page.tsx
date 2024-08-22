"use client";

import GettingStarted from "../components/LandingPage/GettingStarted";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (hasVisited) {
      router.push('/Login');
    } else {
      localStorage.setItem('hasVisited', 'true');
    }
  }, [router]);
  
  return (
    <main>
      <div className="h-screen bg-coral-pink flex items-center justify-center">
        <GettingStarted />
      </div>
    </main>
  );
};

export default Home;
