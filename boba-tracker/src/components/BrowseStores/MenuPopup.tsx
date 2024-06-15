import Image from "next/image";
import { useState } from "react";

const menu_icon = "/Dashboard/menu.svg";

const BUTTON_PRESSED_STYLES =
  "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish";
const ADD_DRINK_BUTTON_STYLES = "bg-medium-pink border-2 border-black-ish shadow-s px-4 py-2 rounded-full my-2";

interface MenuPopupProps {
  storeName: string;
  onClose: () => void;
  menuItems: {
    drinkName: string;
    drinkPrices: Array<string>;
    ingredients: string;
  }[];
}

const MenuPopup = ({ storeName, onClose, menuItems }: MenuPopupProps) => {
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);

  const handleDrinkSelect = (drinkName: string) => {
    setSelectedDrink(drinkName);
  };

  return (
    <div className="flex justify-center fixed inset-0 bg-black bg-opacity-50 p-8 z-50">
      <div className="size-full mt-16 h-4/5 max-w-[400px]">
        <div className="p-4 rounded-t-lg border-2 border-black-ish bg-medium-pink">
          <div className="flex justify-between items-center">
            <div className="flex">
                <Image
                src={menu_icon}
                height={25}
                width={25}
                alt="Menu icon"
                className="mr-2"
                />
                <h2 className="text-2xl font-bold">{storeName}&apos;s Menu</h2>
            </div>
            <button onClick={onClose} className="text-xl font-bold">&times;</button>
          </div>
        </div>
        <div className="border-2 border-t-0 border-black-ish bg-white-ish rounded-b-lg p-3 shadow-b overflow-y-auto h-4/5">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg cursor-pointer leading-[1.2] ${
                selectedDrink === item.drinkName ? 'bg-pastel-pink border-2 border-black-ish' : 'hover:bg-pink-100'
              }`}
              onClick={() => handleDrinkSelect(item.drinkName)}
            >
              <h1 className="font-semibold text-xl">{item.drinkName}</h1>
              <div className="flex">
                {item.drinkPrices.map((price, priceIndex) => (
                    <h3 key={priceIndex} className="font-medium text-[15px]">
                      {price}
                    </h3>
                ))}
              </div>
              {selectedDrink != item.drinkName && (
                <p className="text-[12px] font-medium mt-2">Tap for more info</p>
              )}
              {selectedDrink === item.drinkName && (
                <div>
                  <p className="text-[15px] font-medium mt-3">Key Ingredients: {item.ingredients}</p>
                  <button className={`${ADD_DRINK_BUTTON_STYLES} ${BUTTON_PRESSED_STYLES}`}>
                    <p className="font-semibold text-[13px]">+ Add Drink to Catalogue</p>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPopup;
