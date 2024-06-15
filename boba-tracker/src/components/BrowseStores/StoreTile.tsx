import Image from "next/image";
import { useState } from "react";

const star_icon = "/Dashboard/falling_star.svg";

const STORE_TILE_STLES = "bg-white-ish border-2 border-black-ish px-4 py-6 shadow-b rounded-lg";
const BUTTON_PRESSED_STYLES =
  "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish";
const STORE_TILE_HOVER_STYLES = "hover:bg-medium-pink";

interface StoreTileProps {
  storeName: string;
  drinksFound: number;
  onClick: () => void;
}

const StoreTile = ( props: StoreTileProps ) => {
  const { storeName, drinksFound, onClick } = props;
  const [isHovered, setIsHovered] = useState(false);

  return(
    <button 
      className={`${STORE_TILE_STLES} ${BUTTON_PRESSED_STYLES} ${STORE_TILE_HOVER_STYLES}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div>
        <h1 className="font-black text-xl">{storeName}</h1>
      </div>
      <div className="flex justify-center">
        {isHovered? (
          <>
            <p className="font-medium text-[12px]">View Menu</p>
          </>
        ) : (
          <>
            <Image
              src={star_icon}
              height={30}
              width={30}
              alt="Star icon"
              className="ml-4"
            />
            <p className="font-medium text-[12px] w-[70px] text-left leading-[1.2]">{drinksFound} Drinks Found</p>
          </>
        )} 
      </div>
    </button>
  )
}

export default StoreTile;
