"use client";
import { useEffect } from 'react';
import GettingStarted from "../components/LandingPage/GettingStarted";

const Home = () => {

  useEffect(() => {
    const checkFirstVisit = () => {
      const hasVisited = localStorage.getItem('hasVisited');
      
      if (hasVisited) {
        window.location.href = '/Login';
      } else {
        localStorage.setItem('hasVisited', 'true');
      }
    };

    checkFirstVisit();
  }, []);

  return (
    <main>
      <div className="h-screen bg-coral-pink flex items-center justify-center">
        <GettingStarted />
      </div>
    </main>
  );
};

export default Home;
