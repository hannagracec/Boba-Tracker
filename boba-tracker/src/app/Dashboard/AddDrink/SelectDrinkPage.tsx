import { useState, useEffect } from 'react';
import { FaStar, FaHeart, FaCaretDown } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { initializeApp } from 'firebase/app';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, getDoc, getDocs } from 'firebase/firestore';
import firebaseConfig from '@/firebaseConfig';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

const heart_icon = '/SelectDrink/chat_heart.svg';
const shop_icon = '/SelectDrink/add_shop.svg';
const heart_add = '/SelectDrink/heart_add.svg';
const star_icon = '/SelectDrink/star_icon.svg';

const FORM_SELECT_CONTAINER_STYLES = 'flex items-center bg-white justify-between w-full border-2 border-black-ish px-4 py-2 rounded-lg cursor-pointer';
const DISABLED_DROPDOWN_STYLES = 'flex items-center bg-gray-200 justify-between w-full border-2 border-gray-400 px-4 py-2 rounded-lg cursor-not-allowed';
const ADD_DRINK_BUTTON_STYLES = 'w-full py-2 px-4 bg-pink-pink rounded-full border-2 border-black-ish shadow-b mb-4 font-bold';
const BUTTON_PRESSED_STYLES = 'focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish';
const DROPDOWN_MENU_STYLES = 'absolute z-10 w-full bg-white border border-black-ish rounded-lg mt-1 max-h-40 overflow-y-auto';


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

interface StoreData {
  id: string;
  storeName: string;
  menuItems: { drinkName: string; drinkPrices: string[]; ingredients: string; }[];
  toppings: string[];
}

const SelectDrinkPage = () => {
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
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesCollection = collection(db, 'stores');
        const storesSnapshot = await getDocs(storesCollection);

        const storesList = storesSnapshot.docs.map((doc) => {
          const data = doc.data() as {
            storeName: string;
            menuItems: { drinkName: string; drinkPrices: string[]; ingredients: string; }[];
            toppings: string[];
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
    const storeName = searchParams.get('storeName');
    const drinkName = searchParams.get('drinkName');

    if (storeName && drinkName) {
      const store = stores.find((s) => s.storeName === storeName);
      if (store) {
        setSelectedStore(store);

        const drink = store.menuItems.find((d) => d.drinkName === drinkName);
        if (drink) {
          setSelectedDrink({ name: drink.drinkName, toppings: store.toppings });
          setSelectedToppings(new Set());
        }
      }
    }
  }, [searchParams, stores]);

  const fetchUserData = async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData?.username || '');
      } else {
        console.error('Error fetching user document');
      }
    } catch (error) {
      console.error('Error getting user information: ', error);
    }
  };

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
        setSelectedDrink({ name: drink.drinkName, toppings: selectedStore.toppings });
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

  const handleAddDrink = async () => {
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

      await addDoc(drinksCollectionRef, {
        store: selectedStore.storeName,
        drink: selectedDrink.name,
        toppings: Array.from(selectedToppings),
        sugarLevel: sugarLabel,
        iceLevel: iceLabel,
        rating,
        isFavourite,
      });

      setMessage('Drink added successfully!');
      setMessageType('success');
    } catch (error: any) {
      setMessage(`Error adding drink: ${error.message}`);
      setMessageType('error');
    }
  };

  return (
    <div className="p-4 text-black-ish overflow-y-auto flex justify-center pb-[160px] bg-off-white">
      <div className="bg-white-ish rounded-lg border-2 shadow-b border-black-ish p-4 max-w-[600px]">
        <div className="flex items-center mb-6">
          <div className="mr-4 bg-pink-pink flex items-center justify-center rounded-lg border-2 border-black-ish p-4">
            <Image src={heart_icon} height={90} width={90} alt="Heart Icon" />
          </div>
          <h1 className="text-4xl font-bold">Add New Drink</h1>
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
            {isStoreDropdownOpen && stores.length > 0 && (
              <div className={DROPDOWN_MENU_STYLES}>
                {stores.length > 0 ? (
                  stores.map((store) => (
                    <div
                      key={store.id}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleStoreChange(store.id)}
                    >
                      {store.storeName}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No stores found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedStore && (
          <div className="mb-4">
            <div className="relative">
              <div
                className={selectedStore.menuItems.length > 0 ? FORM_SELECT_CONTAINER_STYLES : DISABLED_DROPDOWN_STYLES}
                onClick={() => selectedStore.menuItems.length > 0 && setIsDrinkDropdownOpen(!isDrinkDropdownOpen)}
              >
                <div className="flex">
                  <Image src={heart_add} height={25} width={25} alt="Add drink icon" className="mr-2" />
                  <span>{selectedDrink ? selectedDrink.name : 'Select a drink'}</span>
                </div>
                <FaCaretDown />
              </div>
              {isDrinkDropdownOpen && selectedStore.menuItems.length > 0 && (
                <div className={DROPDOWN_MENU_STYLES}>
                  {selectedStore.menuItems.length > 0 ? (
                    selectedStore.menuItems.map((drink) => (
                      <div
                        key={drink.drinkName}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleDrinkChange(drink.drinkName)}
                      >
                        {drink.drinkName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No drinks found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedDrink && selectedStore && (
          <div className="mb-4">
            <div className="relative">
              <div
                className={selectedStore.toppings.length > 0 ? FORM_SELECT_CONTAINER_STYLES : DISABLED_DROPDOWN_STYLES}
                onClick={() => selectedStore.toppings.length > 0 && setIsToppingDropdownOpen(!isToppingDropdownOpen)}
              >
                <div className="flex">
                  <Image src={star_icon} height={25} width={25} alt="Add topping icon" className="mr-2" />
                  <span>{selectedToppings.size > 0 ? `Toppings: ${Array.from(selectedToppings).join(', ')}` : 'Select toppings'}</span>
                </div>
                <FaCaretDown />
              </div>
              {isToppingDropdownOpen && selectedStore.toppings.length > 0 && (
                <div className={DROPDOWN_MENU_STYLES}>
                  {selectedStore.toppings.length > 0 ? (
                    selectedStore.toppings.map((topping) => (
                      <div
                        key={topping}
                        className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${selectedToppings.has(topping) ? 'bg-gray-200' : ''}`}
                        onClick={() => handleToppingToggle(topping)}
                      >
                        {topping}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No toppings found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

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
        <button
          className={`${ADD_DRINK_BUTTON_STYLES} ${BUTTON_PRESSED_STYLES}`}
          onClick={handleAddDrink}
        >
          Add Drink
        </button>
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

export default SelectDrinkPage;
