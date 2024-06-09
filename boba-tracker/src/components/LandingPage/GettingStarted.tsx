import Image from "next/image";
import Link from "next/link";
import { rubik_mono_one } from "@/src/app/fonts";

const solid_star = "/LandingPage/solid_star.svg";
const circle_arrow = "LandingPage/circle_arrow.svg";

const LOGO_CONTAINER_STYLES =
  "bg-off-white size-[150px] border-2  border-black-ish rounded-[100%] flex shadow-b justify-center";

const GettingStarted = () => {
  return (
    <div className="w-full max-w-[400px]">
      <div className="px-8 text-black-ish mb-16">
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
        <div className="mt-10 text-5xl text-off-white">
          <div className="flex">
            <h1 className={rubik_mono_one.className}>Boba</h1>
            <Image 
              src={solid_star} 
              height={30} 
              width={35} 
              alt="Solid star" 
              className="ml-4"
            />
          </div>
          <h1 className={rubik_mono_one.className}>Tracker</h1>
        </div>
        <h2 className="text-xl mt-6 mb-10 max-w-[300px] font-medium leading-[1.2]">
          Start tracking your perfect boba blend at every store!
        </h2>
        <Link href="/AboutUs">
          <button className="flex items-center bg-off-white py-2 w-full justify-center border-2 border-black-ish rounded-lg shadow-b focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-1 active:border-black-ish">
            <p className="text-xl font-black mr-2">Get Started</p>
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
