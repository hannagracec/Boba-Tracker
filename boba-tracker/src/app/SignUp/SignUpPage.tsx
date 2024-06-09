import Image from "next/image";
import Link from "next/link";

const solid_star = "/LoginAndSignup/solid_star.svg";
const google_icon = "/LoginAndSignup/google.svg";

const SIGNUP_INPUT_CONTAINER_STYLES =
  "mb-4 w-full bg-white-ish border-2 border-black-ish rounded-lg p-2 text-xl";
const SIGNUP_INPUT_FOCUSED_STLYES =
  "focus:outline-none focus:shadow-b transition-all duration-200 focus:-translate-y-1";

const SIGNUP_BUTTON_STYLES =
  "bg-pastel-pink py-2 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-4";
const SIGNUP_BUTTON_PRESSED_STYLES =
  "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish";
const LOGIN_BUTTON_STYLES =
  "bg-medium-pink py-3 rounded-[30px] border-2 border-black-ish shadow-b w-full mb-10";

const SignUpPage = () => {
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
        <h1 className="text-3xl font-black mb-4">
          Create Account
        </h1>
        <div className="w-full my-4">
          <input
            placeholder="Enter Username"
            type="text"
            className={`${SIGNUP_INPUT_CONTAINER_STYLES} ${SIGNUP_INPUT_FOCUSED_STLYES}`}
          />
          <input
            placeholder="Enter Password"
            type="password"
            className={`${SIGNUP_INPUT_CONTAINER_STYLES} ${SIGNUP_INPUT_FOCUSED_STLYES}`}
          />
          <input
            placeholder="Re-enter Password"
            type="password"
            className={`${SIGNUP_INPUT_CONTAINER_STYLES} ${SIGNUP_INPUT_FOCUSED_STLYES}`}
          />
        </div>
        <div className="w-[90%]">
          <button
            className={`${SIGNUP_BUTTON_STYLES} ${SIGNUP_BUTTON_PRESSED_STYLES}`}
          >
            <p className="text-md font-black">Sign Up</p>
          </button>
          <button
            className={`${SIGNUP_BUTTON_STYLES} ${SIGNUP_BUTTON_PRESSED_STYLES}`}
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
          <Link href="/Login">
            <button
              className={`${LOGIN_BUTTON_STYLES} ${SIGNUP_BUTTON_PRESSED_STYLES}`}
            >
              <p className="text-sm font-medium">
                Already have an account?{" "}
                <span className="font-black">Log In</span>
              </p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
