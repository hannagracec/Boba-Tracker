import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/src/app/firebaseClient';
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from 'next/navigation';

const star_icon = "/Catalogue/star_outline.svg";
const hollow_heart = "/Catalogue/heart_hollow.svg";
const heart_icon = "/Catalogue/heart.svg";
const add_icon = "/Catalogue/add_circle.svg";
const edit_icon = "/Catalogue/edit_icon.svg";
const delete_icon = "/Catalogue/delete_icon.svg";

const CATALOGUE_PAGE_STLYES = "p-4 flex justify-center text-black-ish overflow-y-auto pb-[160px] bg-off-white";

const FILTERS_CONTAINER_STYLES = "px-4 py-1 border-2 border-black-ish rounded-[20px]";
const SELECTED_FILTER_STYLES = "bg-black-ish text-white";
const UNSELECTED_FILTER_STYLES = "bg-white text-black-ish";

const SAVED_DRINK_TILE_STYLES = 
  "p-3 bg-white rounded-lg border-2 shadow-b border-black-ish flex flex-col justify-between relative";

const SELECTED_TILE_STYLES = 
  "shadow-none translate-y-0.5";

const ADD_DRINKS_TILE_STYLES = 
  "p-3 h-full bg-white rounded-lg border-2 shadow-b border-black-ish flex justify-center items-center";

const BUTTON_PRESSED_STYLES = 
  'focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish';

const SavedDrinksPage = () => {
  const [savedDrinks, setSavedDrinks] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'highestRated' | 'favourites'>('all');
  const [sort, setSort] = useState<'none' | 'byStore' | 'byName'>('none');
  const [selectedDrinkIndex, setSelectedDrinkIndex] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchSavedDrinks = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }
    
        const userDocRef = doc(db, 'users', user.uid);
        const drinksCollectionRef = collection(userDocRef, 'drinks');
        const drinksSnapshot = await getDocs(drinksCollectionRef);
    
        const drinksData = drinksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavedDrinks(drinksData);
      } catch (error: any) {
        console.log(`Error fetching drinks: ${error.message}`);
      }
    };    

    fetchSavedDrinks();
  }, []);

  const filteredDrinks = savedDrinks
    .filter((drink) => {
      if (filter === 'highestRated') {
        return drink.rating >= 4.5;
      } else if (filter === 'favourites') {
        return drink.isFavourite;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === 'byStore') {
        return a.store.localeCompare(b.store);
      } else if (sort === 'byName') {
        return a.drink.localeCompare(b.drink);
      }
      return 0;
    });

    const handleEditClick = (index: number) => {
      const drink = savedDrinks[index];
      router.push(`/Dashboard/EditDrink?drinkId=${drink.id}`);
    };

    const handleDeleteClick = async (index: number) => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }
    
        const drink = savedDrinks[index];
        if (!drink || !drink.id) {
          throw new Error('Invalid drink or missing ID');
        }
    
        const userDocRef = doc(db, 'users', user.uid);
        const drinkDocRef = doc(userDocRef, 'drinks', drink.id);

        await deleteDoc(drinkDocRef);
    
        const updatedDrinks = savedDrinks.filter((_, i) => i !== index);
        setSavedDrinks(updatedDrinks);
    
        console.log(`Drink at index ${index} deleted successfully.`);
      } catch (error: any) {
        console.log(`Error deleting drink: ${error.message}`);
      }
    };
    

  return (
    <div className={CATALOGUE_PAGE_STLYES}>
      <div className="max-w-[600px]">
        <h1 className="text-4xl mb-2 font-bold">Saved Drinks</h1>
        <div className="mb-6">
          <h2 className="font-semibold">Filters</h2>
          <div className="text-sm flex gap-2 mb-2">
            <button
              className={`${FILTERS_CONTAINER_STYLES} ${filter === 'all' ? SELECTED_FILTER_STYLES : UNSELECTED_FILTER_STYLES}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`${FILTERS_CONTAINER_STYLES} ${filter === 'highestRated' ? SELECTED_FILTER_STYLES : UNSELECTED_FILTER_STYLES}`}
              onClick={() => setFilter('highestRated')}
            >
              Highest Rated
            </button>
            <button
              className={`${FILTERS_CONTAINER_STYLES} ${filter === 'favourites' ? SELECTED_FILTER_STYLES : UNSELECTED_FILTER_STYLES}`}
              onClick={() => setFilter('favourites')}
            >
              Favourites
            </button>
          </div>
          <h2 className="font-semibold">Sort By</h2>
          <div className="text-sm flex gap-2">
            <button
              className={`${FILTERS_CONTAINER_STYLES} ${sort === 'none' ? SELECTED_FILTER_STYLES : UNSELECTED_FILTER_STYLES}`}
              onClick={() => setSort('none')}
            >
              None
            </button>
            <button
              className={`${FILTERS_CONTAINER_STYLES} ${sort === 'byStore' ? SELECTED_FILTER_STYLES : UNSELECTED_FILTER_STYLES}`}
              onClick={() => setSort('byStore')}
            >
              Store
            </button>
            <button
              className={`${FILTERS_CONTAINER_STYLES} ${sort === 'byName' ? SELECTED_FILTER_STYLES : UNSELECTED_FILTER_STYLES}`}
              onClick={() => setSort('byName')}
            >
              Drink
            </button>
          </div>
        </div>

        {filteredDrinks.length === 0 ? (
          <Link href="/Dashboard/AddDrink">
            <div className={!savedDrinks ? "h-full" : ""}>
              <div className={`w-1/2 flex-col ${ADD_DRINKS_TILE_STYLES} ${BUTTON_PRESSED_STYLES}`}>
                <Image src={add_icon} height={50} width={50} alt="Add icon" className="mt-14" />
                <p className="font-semibold text-center mb-14">Start saving drinks!</p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredDrinks.map((drink, index) => (
              <div
                key={index}
                className={`${SAVED_DRINK_TILE_STYLES} ${selectedDrinkIndex === index ? SELECTED_TILE_STYLES : ''}`}
                onClick={() => setSelectedDrinkIndex(index === selectedDrinkIndex ? null : index)}
              >
                <div className="mb-2">
                  <div className="border-2 border-black-ish rounded-lg mb-4 p-2 bg-pink-pink">
                    <h2 className="text-xl font-bold">{drink.drink}</h2>
                    <p className="font-semibold">{drink.store}</p>
                  </div>
                  <p><strong>Toppings:</strong> {drink.toppings.join(', ') || 'None'}</p>
                  <p><strong>Sugar:</strong> {typeof drink.sugarLevel === 'number' ? `${drink.sugarLevel}%` : drink.sugarLevel}</p>
                  <p><strong>Temp/Ice:</strong> {typeof drink.iceLevel === 'number' ? `${drink.iceLevel}%` : drink.iceLevel}</p>
                </div>
                <div className="mt-auto flex justify-between items-center">
                  {drink.isFavourite ? (
                    <Image 
                      src={heart_icon} 
                      height={20} width={20} 
                      alt="Favourited icon" 
                    />
                  ) : (
                    <Image 
                      src={hollow_heart} 
                      height={20} width={20} 
                      alt="Not favourited icon" 
                    />
                  )}
                  <div className="flex items-center">
                    <p className="mr-1">{drink.rating.toFixed(1)}</p>
                    <Image src={star_icon} height={17} width={17} alt="Star rating icon" /> 
                  </div>
                </div>

                {selectedDrinkIndex === index && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEditClick(index)}
                      className="p-1 bg-white rounded-full shadow-b border-2 border-black-ish"
                    >
                      <Image src={edit_icon} height={20} width={20} alt="Edit icon" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(index)}
                      className="p-1 bg-white rounded-full shadow-b border-2 border-black-ish"
                    >
                      <Image src={delete_icon} height={20} width={20} alt="Delete icon" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <Link href="/Dashboard/AddDrink">
              <div className={`${ADD_DRINKS_TILE_STYLES} ${BUTTON_PRESSED_STYLES}`}>
                <Image src={add_icon} height={50} width={50} alt="Add icon" className="my-16" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedDrinksPage;
