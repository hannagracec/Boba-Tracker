"use client";

import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import firebaseConfig from '@/firebaseConfig';
import Link from 'next/link';

const solid_star = "/LoginAndSignup/solid_star.svg";

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [signedUp, setSignedUp] = useState(false);

  const router = useRouter();
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const checkExistingEmail = async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error: any) {
      console.error('Error checking existing email:', error);
      if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      }
      return false;
    }
  };

  const validateSignUp = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError(null);
    return true;
  };

  const createUser = async () => {
    try {
      // Trim whitespace from email and username
      const trimmedEmail = email.trim();
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: trimmedUsername,
      });

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { email: trimmedEmail, username: trimmedUsername }, { merge: true });

      setSignedUp(true);
    } catch (error: any) {
      if (error.code === 'auth/weak-password') {
        const errorMessageParts = error.message.split(':');
        setError(errorMessageParts.length > 1 ? errorMessageParts[1].trim() : 'An unknown error occurred');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use');
      } else {
        setError('An error occurred during signup');
      }
    }
  };

  const handleSignUp = async () => {
    if (!validateSignUp()) {
      return;
    }

    const trimmedEmail = email.trim();
    
    const emailExists = await checkExistingEmail(trimmedEmail);
    if (emailExists) {
      setError('This email already exists');
      return;
    }

    await createUser();
  };

  useEffect(() => {
    if (signedUp) {
      router.push('/Dashboard');
    }
  }, [signedUp, router]);

  return (
    <div className="text-black-ish p-6 w-full max-w-[500px]">
      <div className="flex flex-col items-center border-2 border-black-ish rounded-lg bg-off-white p-4 shadow-b">
        <Image src={solid_star} height={30} width={30} alt="Solid star icon" className="mb-4" />
        <h1 className="text-3xl font-black mb-2">Create Account</h1>
        <div className="w-full my-4">
          <input
            placeholder="Enter Email"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 w-full bg-white-ish border-2 border-black-ish rounded-lg p-2 text-md focus:outline-none focus:shadow-b transition-all duration-200 focus:-translate-y-1"
          />
          <input
            placeholder="Enter Username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            className="mb-2 w-full bg-white-ish border-2 border-black-ish rounded-lg p-2 text-md focus:outline-none focus:shadow-b transition-all duration-200 focus:-translate-y-1"
          />
          <input
            placeholder="Enter Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 w-full bg-white-ish border-2 border-black-ish rounded-lg p-2 text-md focus:outline-none focus:shadow-b transition-all duration-200 focus:-translate-y-1"
          />
          <input
            placeholder="Re-enter Password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-2 w-full bg-white-ish border-2 border-black-ish rounded-lg p-2 text-md focus:outline-none focus:shadow-b transition-all duration-200 focus:-translate-y-1"
          />
          {error && <p className="font-semibold">* {error}</p>}
        </div>
        <div className="w-[90%]">
          <button onClick={handleSignUp} className="bg-pastel-pink py-2 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-4 focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish">
            <p className="text-lg font-black">Sign Up</p>
          </button>
          <Link href="/Login">
            <button className="bg-medium-pink py-2 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-10 focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish">
              <p className="text-md font-medium">
                Already have an account? <span className="font-black">Log In</span>
              </p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
