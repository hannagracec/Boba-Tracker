"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GettingStarted from "../components/LandingPage/GettingStarted";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const checkFirstVisit = () => {
      const hasVisited = localStorage.getItem('hasVisited');
      
      if (hasVisited) {
        router.push('/Login');
      } else {
        localStorage.setItem('hasVisited', 'true');
      }
    };

    checkFirstVisit();
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
