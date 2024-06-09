import firebaseConfig from "@/firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const solid_star = "/LoginAndSignup/solid_star.svg";
const google_icon = "/LoginAndSignup/google.svg";

const SIGNIN_INPUT_CONTAINER_STYLES =
  "mb-4 w-full bg-white-ish border-2 border-black-ish rounded-lg p-2 text-xl";
const SIGNIN_INPUT_FOCUSED_STLYES =
  "focus:outline-none focus:shadow-b transition-all duration-200 focus:-translate-y-1";

const SIGNIN_BUTTON_STYLES =
  "bg-pastel-pink py-2 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-4";
const SIGNIN_BUTTON_PRESSED_STYLES =
  "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish";
const SIGNUP_BUTTON_STYLES =
  "bg-medium-pink py-3 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-10";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      window.location.href = "/Dashboard";
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Invalid email or password");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/Dashboard";
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError(
        "An error occurred while signing in with Google"
      );
    }
  };
  return (
    <div className="text-black-ish p-6 w-full max-w-[500px]">
      <div className="flex flex-col items-center border-2 border-black-ish rounded-lg bg-off-white p-4 shadow-b">
        <Image
          src={solid_star}
          height={30}
          width={30}
          alt="Solid star icon"
          className="mb-4"
        />
        <h1 className="text-3xl font-black mb-4">Log In</h1>
        <div className="w-full my-4">
          <input
            placeholder="Enter Email"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            className={`${SIGNIN_INPUT_CONTAINER_STYLES} ${SIGNIN_INPUT_FOCUSED_STLYES}`}
          />
          <input
            placeholder="Enter Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className={`${SIGNIN_INPUT_CONTAINER_STYLES} ${SIGNIN_INPUT_FOCUSED_STLYES}`}
          />
          {error && (
            <p className="font-semibold">* {error}</p>
          )}
        </div>
        <div className="w-[90%]">
          <button
            onClick={handleSignIn}
            className={`${SIGNIN_BUTTON_STYLES} ${SIGNIN_BUTTON_PRESSED_STYLES}`}
          >
            <p className="text-md font-black">Sign In</p>
          </button>
          <button
            onClick={handleGoogleSignIn}
            className={`${SIGNIN_BUTTON_STYLES} ${SIGNIN_BUTTON_PRESSED_STYLES}`}
          >
            <div className="flex justify-center">
              <Image
                src={google_icon}
                height={20}
                width={20}
                alt="Google logo"
                className="mr-2"
              />
              <p className="text-md font-medium">
                Continue With{" "}
                <span className="font-black">Google</span>
              </p>
            </div>
          </button>
          <Link href="/SignUp">
            <button
              className={`${SIGNUP_BUTTON_STYLES} ${SIGNIN_BUTTON_PRESSED_STYLES}`}
            >
              <p className="text-sm font-medium">
                Don&apos;t have an account?{" "}
                <span className="font-black">Sign Up</span>
              </p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
