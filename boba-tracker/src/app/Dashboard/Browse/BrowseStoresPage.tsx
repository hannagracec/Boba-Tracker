import Image from "next/image";
import StoreTile from "@/src/components/BrowseStores/StoreTile";
import MenuPopup from "@/src/components/BrowseStores/MenuPopup";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebaseConfig from '@/firebaseConfig';
import { initializeApp } from 'firebase/app';

interface StoreData {
  storeName: string;
  menuItems: Array<any>;
  drinksFound: number;
}

const shop_icon = "/Dashboard/shop.svg";

const BROWSE_STORES_CONTENT_STYLES = "p-4 text-black-ish w-full max-w-[600px] overflow-y-auto pb-[160px] bg-off-white";
const BROWSE_STORES_HEADER_CONTAINER_STYLES = "bg-white-ish border-2 border-black-ish py-4 px-8 rounded-lg flex";
const HEADER_ICON_CONTAINER_STYLES = 
  "mr-4 bg-deep-coral rounded-full p-4 size-16 flex min-w-16 justify-center items-center border-2 border-black-ish";
const HEADER_TEXT_STYLES = "text-[10px] leading-[1.2] font-medium max-w-[300px]";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const BrowseStoresPage = () => {
  const [shopData, setShopData] = useState<StoreData[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      const storesCollection = collection(db, "stores");
      const storesSnapshot = await getDocs(storesCollection);
      const storesList = storesSnapshot.docs.map((doc) => {
        const data = doc.data() as StoreData;
        return {
          ...data,
          drinksFound: data.menuItems.length,
        };
      });
      setShopData(storesList);
    };

    fetchStores();
  }, []);

  const handleStoreClick = (store: StoreData) => {
    setSelectedStore(store);
  };

  const handleClosePopup = () => {
    setSelectedStore(null);
  };

  return (
    <div className={BROWSE_STORES_CONTENT_STYLES}>
      <div className={selectedStore ? 'blur-[1px]' : ''}>
        <div className={BROWSE_STORES_HEADER_CONTAINER_STYLES}>
          <div className={HEADER_ICON_CONTAINER_STYLES}>
            <Image src={shop_icon} height={35} width={35} alt="Browse stores icon" />
          </div>
          <div>
            <h1 className="font-black text-xl">Browse Stores</h1>
            <p className={HEADER_TEXT_STYLES}>
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
