import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile,
} from "firebase/auth";

import firebaseConfig from "@/firebaseConfig";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const solid_star = "/LoginAndSignup/solid_star.svg";

const SIGNUP_PAGE_STYLES = "text-black-ish p-6 w-full max-w-[500px]";
const SIGNUP_PAGE_CONTENT_STYLES = "flex flex-col items-center border-2 border-black-ish rounded-lg bg-off-white p-4 shadow-b";
const CREATE_ACC_HEADER_STYLES = "text-3xl font-black mb-2";

const SIGNUP_INPUT_CONTAINER_STYLES = "mb-2 w-full bg-white-ish border-2 border-black-ish rounded-lg p-2 text-md";
const SIGNUP_INPUT_FOCUSED_STLYES = "focus:outline-none focus:shadow-b transition-all duration-200 focus:-translate-y-1";

const SIGNUP_BUTTON_STYLES = "bg-pastel-pink py-2 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-4";
const SIGNUP_BUTTON_PRESSED_STYLES = "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish";
const LOGIN_BUTTON_STYLES = "bg-medium-pink py-2 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-10";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signedUp, setSignedUp] = useState(false);

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const checkExistingEmail = async (email: any) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error: any) {
      console.error("Error checking existing email:", error);
      if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      }
      return false;
    }
  };

  const validateSignUp = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError(null);
    return true;
  };

  const createUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      await addDoc(collection(db, "users"), {
        email,
        username,
      });

      setSignedUp(true);
    } catch (error: any) {
      if (error.code === "auth/weak-password") {
        const errorMessageParts = error.message.split(":");
        setError(errorMessageParts.length > 1 ? errorMessageParts[1].trim() : "An unknown error occurred");
      }
    }
  };

  const handleSignUp = async () => {
    if (!validateSignUp()) {
      return;
    }

    const emailExists = await checkExistingEmail(email);
    if (emailExists) {
      setError("This email already exists");
      return;
    }

    await createUser();
  };

  useEffect(() => {
    if (signedUp) {
      window.location.href = "/Dashboard";
    }
  }, [signedUp]);

  return (
    <div className={SIGNUP_PAGE_STYLES}>
      <div className={SIGNUP_PAGE_CONTENT_STYLES}>
        <Image src={solid_star} height={30} width={30} alt="Solid star icon" className="mb-4" />
        <h1 className={CREATE_ACC_HEADER_STYLES}>Create Account</h1>
        <div className="w-full my-4">
          <input
            placeholder="Enter Email"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            className={`${SIGNUP_INPUT_CONTAINER_STYLES} ${SIGNUP_INPUT_FOCUSED_STLYES}`}
          />
          <input
            placeholder="Enter Username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            className={`${SIGNUP_INPUT_CONTAINER_STYLES} ${SIGNUP_INPUT_FOCUSED_STLYES}`}
          />
          <input
            placeholder="Enter Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className={`${SIGNUP_INPUT_CONTAINER_STYLES} ${SIGNUP_INPUT_FOCUSED_STLYES}`}
          />
          <input
            placeholder="Re-enter Password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${SIGNUP_INPUT_CONTAINER_STYLES} ${SIGNUP_INPUT_FOCUSED_STLYES}`}
          />
          {error && <p className="font-semibold">* {error}</p>}
        </div>
        <div className="w-[90%]">
          <button onClick={handleSignUp} className={`${SIGNUP_BUTTON_STYLES} ${SIGNUP_BUTTON_PRESSED_STYLES}`}>
            <p className="text-lg font-black">Sign Up</p>
          </button>
          <Link href="/Login">
            <button className={`${LOGIN_BUTTON_STYLES} ${SIGNUP_BUTTON_PRESSED_STYLES}`}>
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
