"use client";

import firebaseConfig from "@/firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const solid_star = "/LoginAndSignup/solid_star.svg";

const LOGIN_PAGE_STYLES =
  "text-black-ish p-6 w-full max-w-[500px]";
const LOGIN_PAGE_CONTENT_STYLES =
  "flex flex-col items-center border-2 border-black-ish rounded-lg bg-off-white p-4 shadow-b";
const LOGIN_HEADER_STYLES = "text-3xl font-black mb-4";

const LOGIN_INPUT_CONTAINER_STYLES =
  "mb-4 w-full bg-white-ish border-2 border-black-ish rounded-lg p-2 text-xl";
const LOGIN_INPUT_FOCUSED_STYLES =
  "focus:outline-none focus:shadow-b transition-all duration-200 focus:-translate-y-1";

const LOGIN_BUTTON_STYLES =
  "bg-pastel-pink py-2 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-4";
const LOGIN_BUTTON_PRESSED_STYLES =
  "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish";
const SIGNUP_BUTTON_STYLES =
  "bg-medium-pink py-3 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-6";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      router.push("/Dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className={LOGIN_PAGE_STYLES}>
      <div className={LOGIN_PAGE_CONTENT_STYLES}>
        <Image
          src={solid_star}
          height={30}
          width={30}
          alt="Solid star icon"
          className="mb-4"
        />
        <h1 className={LOGIN_HEADER_STYLES}>Log In</h1>
        <div className="w-full my-4">
          <input
            placeholder="Enter Email"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            className={`${LOGIN_INPUT_CONTAINER_STYLES} ${LOGIN_INPUT_FOCUSED_STYLES}`}
          />
          <input
            placeholder="Enter Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className={`${LOGIN_INPUT_CONTAINER_STYLES} ${LOGIN_INPUT_FOCUSED_STYLES}`}
          />
          {error && (
            <p className="font-semibold">* {error}</p>
          )}
        </div>
        <div className="w-[90%]">
          <button
            onClick={handleSignIn}
            className={`${LOGIN_BUTTON_STYLES} ${LOGIN_BUTTON_PRESSED_STYLES}`}
          >
            <p className="text-lg font-black">Sign In</p>
          </button>
          <Link href="/SignUp">
            <button
              className={`${SIGNUP_BUTTON_STYLES} ${LOGIN_BUTTON_PRESSED_STYLES}`}
            >
              <p className="text-md font-medium">
                Don&apos;t have an account?{" "}
                <span className="font-black">Sign Up</span>
              </p>
            </button>
          </Link>
        </div>
        <Link
          href="/ResetPassword"
          className="font-semibold mb-6"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
