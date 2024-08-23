"use client";
import { useState, useEffect } from 'react';
import { FaStar, FaHeart, FaCaretDown } from 'react-icons/fa';
import Image from 'next/image';
import { auth, db } from '@/src/app/firebaseClient';
import Link from 'next/link';
import { collection, doc, updateDoc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const edit_icon = '/SelectDrink/edit_heart.svg';
const shop_icon = '/SelectDrink/add_shop.svg';
const heart_add = '/SelectDrink/heart_add.svg';
const star_icon = '/SelectDrink/star_icon.svg';

const FORM_SELECT_CONTAINER_STYLES = 'flex items-center bg-white justify-between w-full border-2 border-black-ish px-4 py-2 rounded-lg cursor-pointer';
const DISABLED_DROPDOWN_STYLES = 'flex items-center bg-gray-200 justify-between w-full border-2 border-gray-400 px-4 py-2 rounded-lg cursor-not-allowed';
const SAVE_BUTTON_STYLES = 'w-full py-2 px-4 bg-pink-pink rounded-full border-2 border-black-ish shadow-b mb-4 font-bold';
const CANCEL_BUTTON_STYLES = 'w-full py-2 px-4 bg-deep-coral rounded-full border-2 border-black-ish shadow-b mb-4 font-bold';
const BUTTON_PRESSED_STYLES = 'focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish';
const DROPDOWN_MENU_STYLES = 'absolute z-10 w-full bg-white border border-black-ish rounded-lg mt-1 max-h-40 overflow-y-auto';

interface StoreData {
  id: string;
  storeName: string;
  menuItems: { drinkName: string; drinkPrices: string[]; ingredients: string; }[];
  toppings?: string[]; 
}

const EditDrinkPage = () => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<{ name: string; toppings: string[] } | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<Set<string>>(new Set());
  const [sugarLevel, setSugarLevel] = useState(50);
  const [iceLevel, setIceLevel] = useState(50);
  const [rating, setRating] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isDrinkDropdownOpen, setIsDrinkDropdownOpen] = useState(false);
  const [isToppingDropdownOpen, setIsToppingDropdownOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [documentId, setDocumentId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesCollection = collection(db, 'stores');
        const storesSnapshot = await getDocs(storesCollection);
  
        const storesList = storesSnapshot.docs.map((doc) => {
          const data = doc.data() as {
            storeName: string;
            menuItems: { drinkName: string; drinkPrices: string[]; ingredients: string; }[];
            toppings?: string[];
          };
  
          return {
            id: doc.id,
            ...data,
          };
        });
  
        setStores(storesList);
      } catch (error) {
        console.error('Error fetching stores: ', error);
      }
    };
  
    fetchStores();
  }, []);
  
  useEffect(() => {
    const drinkId = searchParams.get('drinkId');
  
    if (drinkId && stores.length > 0) {
      const fetchDrinkDetails = async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            throw new Error('User not authenticated');
          }
  
          const userDocRef = doc(db, 'users', user.uid);
          const drinksCollectionRef = collection(userDocRef, 'drinks');
          const drinkDocRef = doc(drinksCollectionRef, drinkId);
  
          const drinkDoc = await getDoc(drinkDocRef);
          if (drinkDoc.exists()) {
            const drinkData = drinkDoc.data();
  
            setDocumentId(drinkId);
  
            const normalizedStoreName = drinkData.store.trim().toLowerCase();
            const store = stores.find((s) => s.storeName.trim().toLowerCase() === normalizedStoreName);
  
            if (store) {
              setSelectedStore(store);
              const drink = store.menuItems.find((d) => d.drinkName === drinkData.drink);
              if (drink) {
                setSelectedDrink({ name: drink.drinkName, toppings: store.toppings || [] });
                setSelectedToppings(new Set(drinkData.toppings || []));
                setSugarLevel(drinkData.sugarLevel === 'Extra' ? 100 : Number(drinkData.sugarLevel.replace('%', '')));
                setIceLevel(drinkData.iceLevel === 'Extra' ? 100 : Number(drinkData.iceLevel.replace('%', '')));
                setRating(drinkData.rating || 0);
                setIsFavourite(drinkData.isFavourite || false);
              }
            } else {
              console.warn('No matching store found');
            }
          } else {
            console.warn('No document found at path:', drinkDocRef.path);
          }
        } catch (error: any) {
          console.error('Error fetching drink details: ', error);
        }
      };
  
      fetchDrinkDetails();
    }
  }, [searchParams, stores]);
  

  const handleStoreChange = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    setSelectedStore(store || null);
    setSelectedDrink(null);
    setSelectedToppings(new Set());
    setIsStoreDropdownOpen(false);
  };

  const handleDrinkChange = (drinkName: string) => {
    if (selectedStore) {
      const drink = selectedStore.menuItems.find((d) => d.drinkName === drinkName);
      if (drink) {
        setSelectedDrink({ name: drink.drinkName, toppings: selectedStore.toppings || [] });
        setSelectedToppings(new Set());
      } else {
        setSelectedDrink(null);
      }
      setIsDrinkDropdownOpen(false);
    }
  };

  const handleToppingToggle = (topping: string) => {
    setSelectedToppings((prevToppings) => {
      const newToppings = new Set(prevToppings);
      if (newToppings.has(topping)) {
        newToppings.delete(topping);
      } else {
        newToppings.add(topping);
      }
      return newToppings;
    });
  };

  const getSugarLabel = (value: number) => {
    if (value === 0) return '0%';
    if (value <= 30) return '30%';
    if (value <= 50) return '50%';
    if (value <= 70) return '70%';
    if (value < 100) return 'Regular';
    return 'Extra';
  };

  const getIceLabel = (value: number) => {
    if (value === 0) return 'Hot';
    if (value <= 20) return 'Warm';
    if (value <= 40) return 'None';
    if (value <= 60) return 'Less';
    if (value <= 80) return 'Regular';
    if (value <= 100) return 'Extra';
    return 'Extra';
  };


  const handleSave = async () => {
    if (!selectedStore || !selectedDrink) {
      setMessage('Please select a store and a drink');
      setMessageType('error');
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      const sugarLabel = getSugarLabel(sugarLevel);
      const iceLabel = getIceLabel(iceLevel);
  
      const userDocRef = doc(db, 'users', user.uid);
      const drinksCollectionRef = collection(userDocRef, 'drinks');
      const drinkDocRef = documentId ? doc(drinksCollectionRef, documentId) : undefined;
  
      if (!drinkDocRef) {
        setMessage('Cannot find the document reference.');
        setMessageType('error');
        return;
      }
  
      const drinkDoc = await getDoc(drinkDocRef);

      if (drinkDoc.exists()) {
        await updateDoc(drinkDocRef, {
          store: selectedStore.storeName,
          drink: selectedDrink.name,
          toppings: Array.from(selectedToppings),
          sugarLevel: sugarLabel,
          iceLevel: iceLabel,
          rating,
          isFavourite,
        });
        setMessage('Drink updated successfully!');
        setMessageType('success');
      } else {
        setMessage('Drink does not exist and cannot be updated.');
        setMessageType('error');
      }
  
      router.push('/Dashboard/Catalogue');
    } catch (error: any) {
      console.error('Error updating drink:', error);
      setMessage(`Error updating drink: ${error.message}`);
      setMessageType('error');
    }
  };  

  return (
    <div className="p-4 text-black-ish overflow-y-auto flex justify-center pb-[160px] bg-off-white">
      <div className="bg-white-ish rounded-lg border-2 shadow-b border-black-ish p-4 max-w-[600px]">
        <div className="flex items-center mb-6">
          <div className="mr-4 bg-pink-pink flex items-center justify-center rounded-lg border-2 border-black-ish p-6">
            <Image src={edit_icon} height={70} width={70} alt="Heart Icon" />
          </div>
          <h1 className="text-4xl font-bold">Edit Drink</h1>
        </div>

        <div className="mb-4">
          <div className="relative">
            <div
              className={stores.length > 0 ? FORM_SELECT_CONTAINER_STYLES : DISABLED_DROPDOWN_STYLES}
              onClick={() => stores.length > 0 && setIsStoreDropdownOpen(!isStoreDropdownOpen)}
            >
              <div className="flex items-center">
                <Image src={shop_icon} height={25} width={25} alt="Select shop icon" className="mr-2" />
                <span>{selectedStore ? selectedStore.storeName : 'Select a store'}</span>
              </div>
              <FaCaretDown />
            </div>
            {isStoreDropdownOpen && (
              <div className={DROPDOWN_MENU_STYLES}>
                {stores.length > 0 ? (
                  stores.map((store) => (
                    <div
                      key={store.id}
                      className={`px-4 py-2 ${selectedStore?.id === store.id ? 'bg-gray-100' : ''}`}
                      onClick={() => handleStoreChange(store.id)}
                    >
                      {store.storeName}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2">No stores available</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <div
              className={selectedStore ? FORM_SELECT_CONTAINER_STYLES : DISABLED_DROPDOWN_STYLES}
              onClick={() => selectedStore && setIsDrinkDropdownOpen(!isDrinkDropdownOpen)}
            >
              <div className="flex items-center">
                <Image src={star_icon} height={25} width={25} alt="Select drink icon" className="mr-2" />
                <span>{selectedDrink ? selectedDrink.name : 'Select a drink'}</span>
              </div>
              <FaCaretDown />
            </div>
            {isDrinkDropdownOpen && selectedStore && (
              <div className={DROPDOWN_MENU_STYLES}>
                {selectedStore.menuItems.length > 0 ? (
                  selectedStore.menuItems.map((drink) => (
                    <div
                      key={drink.drinkName}
                      className={`px-4 py-2 ${selectedDrink?.name === drink.drinkName ? 'bg-gray-100' : ''}`}
                      onClick={() => handleDrinkChange(drink.drinkName)}
                    >
                      {drink.drinkName}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2">No drinks available</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <div
              className={selectedDrink && selectedDrink.toppings.length > 0 ? FORM_SELECT_CONTAINER_STYLES : DISABLED_DROPDOWN_STYLES}
              onClick={() => selectedDrink && selectedDrink.toppings.length > 0 && setIsToppingDropdownOpen(!isToppingDropdownOpen)}
            >
              <div className="flex items-center">
                <Image src={heart_add} height={25} width={25} alt="Select topping icon" className="mr-2" />
                <span>{selectedToppings.size > 0 ? `Toppings: ${Array.from(selectedToppings).join(', ')}` : 'Select toppings'}</span>
              </div>
              <FaCaretDown />
            </div>
            {isToppingDropdownOpen && selectedDrink && selectedDrink.toppings && (
              <div className={DROPDOWN_MENU_STYLES}>
                {selectedDrink.toppings.length > 0 ? (
                  selectedDrink.toppings.map((topping) => (
                    <div
                      key={topping}
                      className={`px-4 py-2 ${selectedToppings.has(topping) ? 'bg-gray-100' : ''}`}
                      onClick={() => handleToppingToggle(topping)}
                    >
                      {topping}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2">No toppings available</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-2">
          <label className="block mb-1">
            <span className="font-semibold">Sugar Level: </span>
            {getSugarLabel(sugarLevel)}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={sugarLevel}
            className="w-full h-4 accent-black-ish border-2 border-black-ish bg-white rounded-lg appearance-none cursor-pointer"
            onChange={(e) => setSugarLevel(Number(e.target.value))}
            style={{
              background: `linear-gradient(90deg, #FFA1AB ${sugarLevel}%, #fff ${sugarLevel}%)`,
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            <span className="font-semibold">Temperature/Ice Level: </span>
            {getIceLabel(iceLevel)}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={iceLevel}
            className="w-full accent-black-ish h-4 border-2 border-black-ish rounded-lg appearance-none cursor-pointer"
            onChange={(e) => setIceLevel(Number(e.target.value))}
            style={{
              background: `linear-gradient(90deg, #FFA1AB ${iceLevel}%, #fff ${iceLevel}%)`,
            }}
          />
        </div>

        <div className="flex justify-between">
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Rating</label>
            <div className="flex text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                    key={star}
                    className={`cursor-pointer ${rating >= star ? 'text-deep-coral' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                    />
                ))}
            </div>
          </div>

          <div className="mb-6">
            <button
                onClick={() => setIsFavourite(!isFavourite)}
            >
                <label className="block mb-1 font-semibold">Favourite</label>
                <FaHeart className={`${isFavourite ? 'text-deep-coral' : 'text-gray-300'} mx-auto text-2xl`}/>
            </button>
          </div>
        </div>

        <div className="flex">
          <button
            onClick={handleSave}
            className={`mr-4 ${SAVE_BUTTON_STYLES} ${BUTTON_PRESSED_STYLES}`}
          >
            Save Changes
          </button >
          <Link href="/Dashboard/Catalogue" >
            <button
              className={`${CANCEL_BUTTON_STYLES} ${BUTTON_PRESSED_STYLES}`}
            >
                Cancel
            </button>
          </Link>
        </div>

        {message && (
            <div className="flex items-center justify-center mb-2">
            <FontAwesomeIcon
              icon={messageType === 'error' ? faTimesCircle : faCheckCircle}
              className="text-black-ish mr-2"
            />
            <p className="text-black-ish">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditDrinkPage;
