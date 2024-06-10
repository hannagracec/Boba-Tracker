import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Image from "next/image";

const solid_star = "/LoginAndSignup/solid_star.svg";

const RESET_PASS_PAGE_STYLES =
  "text-black-ish p-6 w-full max-w-[500px]";
const RESET_PASS_PAGE_CONTENT_STYLE =
  "flex flex-col items-center border-2 border-black-ish rounded-lg bg-off-white p-4 shadow-b";
const FORGOT_PASS_HEADER_STYLES =
  "text-3xl font-black mb-2";

const EMAIL_INPUT_CONTAINER_STYLES =
  "mb-2 w-full bg-white-ish border-2 border-black-ish rounded-lg p-2 text-xl";
const EMAIL_INPUT_FOCUSED_STYLES =
  "focus:outline-none focus:shadow-b transition-all duration-200 focus:-translate-y-1";

const RESET_PASS_BUTTON_STYLES =
  "bg-pastel-pink py-2 w-[85%] mb-8 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-4";
const RESET_PASS_BUTTON_PRESSED_STYLES =
  "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
      setError("");
    } catch (error: any) {
      setError(
        "Error sending password reset email: " +
          error.message
      );
    }
  };

  return (
    <div className={RESET_PASS_PAGE_STYLES}>
      <div className={RESET_PASS_PAGE_CONTENT_STYLE}>
        <Image
          src={solid_star}
          height={30}
          width={30}
          alt="Solid star icon"
          className="mb-4"
        />
        <h1 className={FORGOT_PASS_HEADER_STYLES}>
          Forgot Password
        </h1>
        <div className="w-full my-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${EMAIL_INPUT_CONTAINER_STYLES} ${EMAIL_INPUT_FOCUSED_STYLES}`}
          />
          {error && (
            <p className="font-semibold">* {error}</p>
          )}
          {message && (
            <p className="font-semibold">{message}</p>
          )}
        </div>
        <button
          onClick={handlePasswordReset}
          className={`${RESET_PASS_BUTTON_PRESSED_STYLES} ${RESET_PASS_BUTTON_STYLES}`}
        >
          <p className="text-lg font-black">
            Reset Password
          </p>
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
