"use client";
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '@/firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const withAuth = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    useEffect(() => {
      const checkAuth = async () => {
        const user = await new Promise((resolve) => {
          auth.onAuthStateChanged(resolve);
        });

        if (!user) {
          window.location.href = '/Login';
        }
      };

      checkAuth();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
