import { rubik_mono_one } from "../fonts";
import Image from "next/image";
import InfoTile from "@/src/components/LandingPage/InfoTile";
import Link from "next/link";

const hollow_star = "/LandingPage/hollow_star.svg";

const global_search_icon = "/LandingPage/global_search.svg";
const heart_check_icon = "/LandingPage/heart_check.svg";
const shooting_star_icon = "/LandingPage/shooting_star.svg";

const browse_blurb =
  "Browse all your favourite boba stores and select a drink.";
const save_blurb =
  "Set and save your ideal drink preferences so you’ll never forget.";
const rate_blurb =
  "Rate new drinks to track the ones you love and the ones you don’t";

const browse_alt = "Search icon";
const heart_alt = "Heart icon";
const star_alt = "Shooting star icon";

const ABOUT_US_CONTENT_STYLES =
  "flex flex-col items-center p-4";

const SIGNMEUP_BUTTON_STYLES =
  "flex items-center bg-pastel-pink py-2 px-4 w-full max-w-xs justify-center border-2 border-black-ish rounded-3xl shadow-b";
const SIGNMEUP_PRESSED_BUTTON_STYLES =
  "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish";
const SIGNMEUP_BUTTON_TEXT_STYLES =
  "text-xl font-black text-black-ish";

const AboutUsPage = () => {
  return (
    <div className="max-w-[500px]">
      <div className={ABOUT_US_CONTENT_STYLES}>
        <div
          className={`text-5xl flex ${rubik_mono_one.className} mb-6`}
        >
          <h1>About</h1>
          <Image
            src={hollow_star}
            height={35}
            width={35}
            alt="Star outline"
            className="mx-2"
          />
          <h1>Us</h1>
        </div>
        <div className="mb-6">
          <InfoTile
            icon={global_search_icon}
            text={browse_blurb}
            alt={browse_alt}
          />
          <InfoTile
            icon={heart_check_icon}
            text={save_blurb}
            alt={heart_alt}
          />
          <InfoTile
            icon={shooting_star_icon}
            text={rate_blurb}
            alt={star_alt}
          />
        </div>
        <Link href="/SignUp">
          <button
            className={`${SIGNMEUP_BUTTON_STYLES} ${SIGNMEUP_PRESSED_BUTTON_STYLES}`}
          >
            <p className={SIGNMEUP_BUTTON_TEXT_STYLES}>
              Sign me up!
            </p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AboutUsPage;
