import { useState, useEffect } from 'react';
import { FaStar, FaHeart, FaCaretDown } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { initializeApp } from 'firebase/app';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, addDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '@/firebaseConfig';

const heart_icon = '/SelectDrink/chat_heart.svg';
const shop_icon = '/SelectDrink/add_shop.svg';
const heart_add = '/SelectDrink/heart_add.svg';
const star_icon = '/SelectDrink/star_icon.svg';

const FORM_SELECT_CONTAINER_STYLES = 'flex items-center bg-white justify-between w-full border-2 border-black-ish px-4 py-2 rounded-lg cursor-pointer';
const ADD_DRINK_BUTTON_STYLES = 'w-full py-2 px-4 bg-pink-pink rounded-full border-2 border-black-ish shadow-b mb-4 font-bold';
const BUTTON_PRESSED_STYLES = 'focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish';

const stores = [
  {
    name: 'Gong Cha',
    drinks: [
      { name: 'Milk Tea', toppings: ['Pearl', 'Pudding', 'Grass Jelly'] },
      { name: 'Green Tea', toppings: ['Aloe', 'Pearl', 'Basil Seed'] },
    ],
  },
  {
    name: 'CoCo Fresh Tea',
    drinks: [
      { name: 'Bubble Milk Tea', toppings: ['Pearl', 'Red Bean', 'Pudding'] },
      { name: 'Matcha Latte', toppings: ['Aloe', 'Coconut Jelly', 'Pearl'] },
    ],
  },
];

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const AddDrinkPage = () => {
  const [selectedStore, setSelectedStore] = useState<{ name: string; drinks: { name: string; toppings: string[]; }[] } | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<{ name: string; toppings: string[]; } | null>(null);
  const [selectedTopping, setSelectedTopping] = useState('');
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

  const handleStoreChange = (store: string) => {
    const selectedStore = stores.find((s) => s.name === store);
    setSelectedStore(selectedStore || null);
    setSelectedDrink(null);
    setIsStoreDropdownOpen(false);
  };

  const handleDrinkChange = (drink: string) => {
    if (selectedStore) {
      const selectedDrink = selectedStore.drinks.find((d) => d.name === drink);
      setSelectedDrink(selectedDrink || null);
      setIsDrinkDropdownOpen(false);
    }
  };

  const handleToppingChange = (topping: string) => {
    setSelectedTopping(topping);
    setIsToppingDropdownOpen(false);
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

  const addDrinkToDatabase = async () => {
    if (!selectedStore || !selectedDrink || !user) {
      setMessage('Please select a store and a drink.');
      setMessageType('error');
      return;
    }

    const newDrink = {
      store: selectedStore.name,
      drink: selectedDrink.name,
      topping: selectedTopping,
      sugarLevel,
      iceLevel,
      rating,
      isFavourite,
    };

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userEmail = user.email;
      const username = user.displayName;

      await setDoc(userDocRef, { email: userEmail, username: username || '' }, { merge: true });

      const drinksCollectionRef = collection(userDocRef, 'drinks');
      await addDoc(drinksCollectionRef, newDrink);

      setMessage('Drink added successfully!');
      setMessageType('success');

    } catch (error: any) {
      setMessage(`Error adding drink: ${error.message}`);
      setMessageType('error');
    }
  };

  return (
    <div className="p-4 text-black-ish overflow-y-auto pb-[160px] bg-off-white">
      <div className="bg-white-ish rounded-lg border-2 border-black-ish p-4">
        <div className="flex items-center mb-6">
          <div className="mr-4 bg-pink-pink flex items-center justify-center rounded-lg border-2 border-black-ish p-4">
            <Image src={heart_icon} height={90} width={90} alt="Heart Icon" />
          </div>
          <h1 className="text-4xl font-bold">Add New Drink</h1>
        </div>

        <div className="mb-4">
          <div className="relative">
            <div
              className={FORM_SELECT_CONTAINER_STYLES}
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
            >
              <div className="flex items-center">
                <Image src={shop_icon} height={25} width={25} alt="Select shop icon" className="mr-2" />
                <span>{selectedStore ? selectedStore.name : 'Select a store'}</span>
              </div>
              <FaCaretDown />
            </div>
            {isStoreDropdownOpen && (
              <div className="absolute z-10 w-full bg-white border border-black-ish rounded-lg mt-1">
                {stores.map((store) => (
                  <div
                    key={store.name}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center"
                    onClick={() => handleStoreChange(store.name)}
                  >
                    {store.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedStore && (
          <div className="mb-4">
            <div className="relative">
              <div
                className={FORM_SELECT_CONTAINER_STYLES}
                onClick={() => setIsDrinkDropdownOpen(!isDrinkDropdownOpen)}
              >
                <div className="flex">
                  <Image src={heart_add} height={25} width={25} alt="Add drink icon" className="mr-2" />
                  <span>{selectedDrink ? selectedDrink.name : 'Select a drink'}</span>
                </div>
                <FaCaretDown />
              </div>
              {isDrinkDropdownOpen && (
                <div className="absolute z-10 w-full bg-white border border-black-ish rounded-lg mt-1">
                  {selectedStore.drinks.map((drink) => (
                    <div
                      key={drink.name}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleDrinkChange(drink.name)}
                    >
                      {drink.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedDrink && (
          <div className="mb-4">
            <div className="relative">
              <div
                className={FORM_SELECT_CONTAINER_STYLES}
                onClick={() => setIsToppingDropdownOpen(!isToppingDropdownOpen)}
              >
                <div className="flex">
                  <Image src={star_icon} height={25} width={25} alt="Add topping icon" className="mr-2" />
                  <span>{selectedTopping ? `Topping: ${selectedTopping}` : 'Select a topping'}</span>
                </div>
                <FaCaretDown />
              </div>
              {isToppingDropdownOpen && (
                <div className="absolute z-10 w-full bg-white border border-black-ish rounded-lg mt-1">
                  {selectedDrink.toppings.map((topping) => (
                    <div
                      key={topping}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleToppingChange(topping)}
                    >
                      {topping}
                    </div>
                  ))}
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

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer ${rating >= star ? 'text-deep-coral text-xl' : 'text-gray-300 text-xl'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <button
            className={`flex items-center ${isFavourite ? 'text-deep-coral' : 'text-black-ish'}`}
            onClick={() => setIsFavourite(!isFavourite)}
          >
            <FaHeart className="mr-2 text-xl" />
            {isFavourite ? 'Favourited' : 'Mark as Favourite'}
          </button>
        </div>

        <button
          className={`${ADD_DRINK_BUTTON_STYLES} ${BUTTON_PRESSED_STYLES}`}
          onClick={addDrinkToDatabase}
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

export default AddDrinkPage;
