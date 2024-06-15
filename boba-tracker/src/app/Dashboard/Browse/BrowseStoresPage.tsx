import Image from "next/image";
import StoreTile from "@/src/components/BrowseStores/StoreTile";
import MenuPopup from "@/src/components/BrowseStores/MenuPopup";
import { use, useState } from "react";

const shop_icon = "/Dashboard/shop.svg";

interface StoreData {
  storeName: string;
  menuItems: Array<any>;
}

const shopData = [
  { 
    storeName: "Gong Cha", 
    drinksFound: 10,
    menuItems: [
      {
        drinkName: "CoCo Milk Tea",
        drinkPrices: ["M | $5.4", "L | $5.9"],
        ingredients: "Brewed tea, non-dairy creamer"
      },
      {
        drinkName: "Jasmine Milk Tea",
        drinkPrices: ["M | $5.4", "L | $5.9"],
        ingredients: "Brewed tea, non-dairy creamer"
      },
      {
        drinkName: "CoCo Milk Tea",
        drinkPrices: ["M | $5.4", "L | $5.9"],
        ingredients: "Brewed tea, non-dairy creamer"
      },
      {
        drinkName: "Jasmine Milk Tea",
        drinkPrices: ["M | $5.4", "L | $5.9"],
        ingredients: "Brewed tea, non-dairy creamer"
      },
      {
        drinkName: "CoCo Milk Tea",
        drinkPrices: ["M | $5.4", "L | $5.9"],
        ingredients: "Brewed tea, non-dairy creamer"
      },
      {
        drinkName: "Jasmine Milk Tea",
        drinkPrices: ["M | $5.4", "L | $5.9"],
        ingredients: "Brewed tea, non-dairy creamer"
      }
    ]
  },
  { storeName: "CoCo", drinksFound: 20 },
  { storeName: "PurrTea", drinksFound: 15 },
  { storeName: "THE MOON", drinksFound: 12 },
];

const BrowseStoresPage = () => {
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

  const handleStoreClick = (store: any) => {
    setSelectedStore(store);
  };

  const handleClosePopup = () => {
    setSelectedStore(null);
  };

  return (
    <div className="p-4 text-black-ish w-full max-w-[600px] overflow-y-auto pb-[160px] bg-off-white">
      <div className={selectedStore ? 'blur-[1px]' : ''}>
        <div className="bg-white-ish border-2 border-black-ish py-4 px-8 rounded-lg flex">
          <div className="mr-4 bg-deep-coral rounded-full p-4 size-16 flex min-w-16 justify-center items-center border-2 border-black-ish">
            <Image src={shop_icon} height={35} width={35} alt="Browse stores icon" />
          </div>
          <div>
            <h1 className="font-black text-xl">Browse Stores</h1>
            <p className="text-[10px] leading-[1.2] font-medium max-w-[300px]">
              Explore the stores listed below to browse their menu or select a drink to save
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {shopData.map((data, index) => (
            <StoreTile
              key={index} 
              storeName={data.storeName} 
              drinksFound={data.drinksFound} 
              onClick={() => handleStoreClick(data)}
            />
          ))}
        </div>
      </div>
      <div>
        {selectedStore && (
          <MenuPopup
            storeName={selectedStore.storeName}
            onClose={handleClosePopup}
            menuItems={selectedStore.menuItems}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseStoresPage;
