import Image from "next/image";
import Link from "next/link";
import { rubik_mono_one } from "@/src/app/fonts";

const solid_star = "/LandingPage/solid_star.svg";
const circle_arrow = "LandingPage/circle_arrow.svg";

const GET_STARTED_PAGE_STYLES = "w-full max-w-[400px]";
const GET_STARTED_CONTENT_STYLES =
  "px-8 text-black-ish mb-16";

const TITLE_SECTION_STYLES =
  "mt-10 text-5xl text-off-white";

const LOGO_CONTAINER_STYLES =
  "bg-off-white size-[150px] border-2  border-black-ish rounded-[100%] flex shadow-b justify-center";

const PHRASE_SUBHEADER_STYLES =
  "text-xl mt-6 mb-10 max-w-[300px] font-medium leading-[1.2]";
const GET_STARTED_BUTTON_STYLES =
  "flex items-center bg-off-white py-2 w-full justify-center border-2 border-black-ish rounded-lg shadow-b";
const GET_STARTED_PRESSED_BUTTON_STYLES =
  "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-1 active:border-black-ish";
const GET_STARTED_BUTTON_TEXT_STYLES =
  "text-xl font-black mr-2";

const GettingStarted = () => {
  return (
    <div className={GET_STARTED_PAGE_STYLES}>
      <div className={GET_STARTED_CONTENT_STYLES}>
        <div className="flex justify-center">
          <div className={LOGO_CONTAINER_STYLES}>
            <Image
              src="/logo.svg"
              height={120}
              width={120}
              alt="Boba Tracker Logo"
            />
          </div>
        </div>
        <div className={TITLE_SECTION_STYLES}>
          <div className="flex">
            <h1 className={rubik_mono_one.className}>
              Boba
            </h1>
            <Image
              src={solid_star}
              height={30}
              width={35}
              alt="Solid star"
              className="ml-4"
            />
          </div>
          <h1 className={rubik_mono_one.className}>
            Tracker
          </h1>
        </div>
        <h2 className={PHRASE_SUBHEADER_STYLES}>
          Start tracking your perfect boba blend at every
          store!
        </h2>
        <Link href="/AboutUs">
          <button
            className={`${GET_STARTED_BUTTON_STYLES} ${GET_STARTED_PRESSED_BUTTON_STYLES}`}
          >
            <p className={GET_STARTED_BUTTON_TEXT_STYLES}>
              Get Started
            </p>
            <Image
              src={circle_arrow}
              height={30}
              width={30}
              alt="Circle arrow icon"
            />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GettingStarted;
