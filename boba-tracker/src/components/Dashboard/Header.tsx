import Image from "next/image";
import { rubik_mono_one } from "@/src/app/fonts";

const star_border_icon = "/Header/star_border.svg";
const circle_logo = "/Header/circle_logo.svg";

const Header = () => {
  return (
    <div className="px-4 pt-10 flex justify-between">
      <div className="flex items-center">
        <Image
          src={star_border_icon}
          height={20}
          width={20}
          alt="Star icon"
          className="mr-2"
        />
        <div className="text-black-ish text-xl pt-1">
          <h1 className={rubik_mono_one.className}>
            Boba Tracker
          </h1>
        </div>
      </div>
      <div>
        <Image
          src={circle_logo}
          height={40}
          width={40}
          alt="Boba Tracker logo"
        />
      </div>
    </div>
  );
};

export default Header;
