import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '@/firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const user = await new Promise((resolve) => {
          auth.onAuthStateChanged(resolve);
        });

        if (!user) {
          router.push('/Login');
        }
      };

      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
