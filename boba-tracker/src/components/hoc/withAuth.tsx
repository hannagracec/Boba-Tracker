"use client";
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useRouter } from 'next/navigation';
import firebaseConfig from '@/firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const Wrapper = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/Login');
        }
      });

      return () => unsubscribe();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
