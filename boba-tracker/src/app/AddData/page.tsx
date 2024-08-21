"use client";
import { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '@/firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const AddStoreData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddStoreData = async () => {
    setIsLoading(true);
    setMessage('');

    const data = {
      storeName: "Thé Moon Tea House",
      menuItems: [
        {
          drinkName: "Thé Moon Mountain Oolong",
          drinkPrices: ["M | $5.99"],
          ingredients: "Taiwanese mountain oolong tea, soy extract creamer",
        },
        {
            drinkName: "Thé Moon Earl Grey",
            drinkPrices: ["M | $5.99"],
            ingredients: "Black tea, vanilla, soy extract creamer",
          },
          {
            drinkName: "Thé Moon Winter Melon",
            drinkPrices: ["M | $4.99"],
            ingredients: "Winter melon tea",
          },
          {
            drinkName: "Thé Moon Winter Melon Latte",
            drinkPrices: ["M | $5.99"],
            ingredients: "Winter melon tea, milk",
          },
          {
            drinkName: "Thé Moon Shizuoka Matcha",
            drinkPrices: ["M | $6.49"],
            ingredients: "Matcha",
          },
          {
            drinkName: "Jasmine Matcha Green",
            drinkPrices: ["M | $6.99"],
            ingredients: "Jasmine green tea, milk",
          },
          {
            drinkName: "Jade Moon",
            drinkPrices: ["M | $6.49"],
            ingredients: "Lime and lemon pressed juice, jasmine green tea, kungfu black tea",
          },
          {
            drinkName: "Golden Moon",
            drinkPrices: ["M | $6.49"],
            ingredients: "Passionfruit juice, mango juice, jasmine green tea, kungfu black tea",
          },
          {
            drinkName: "Hawaiian Light",
            drinkPrices: ["M | $6.49"],
            ingredients: "Kumquat juice, pineapple juice, jasmine green tea, kungfu black tea",
          },
          {
            drinkName: "Orange Sunset",
            drinkPrices: ["M | $6.49"],
            ingredients: "Orange fruit tea, jasmine green tea, kungfu black tea",
          },
          {
            drinkName: "Blush Cloud",
            drinkPrices: ["M | $6.99"],
            ingredients: "Jasmine tea, strawberry slush, cloud foam",
          },
          {
            drinkName: "Tropical Cloud",
            drinkPrices: ["M | $6.99"],
            ingredients: "Jasmine tea, mango slush, cloud foam",
          },
          {
            drinkName: "Flame Cloud",
            drinkPrices: ["M | $6.99"],
            ingredients: "Okinawa brown sugar, milk, cloud foam",
          },
          {
            drinkName: "Taro Cloud",
            drinkPrices: ["M | $6.99"],
            ingredients: "Milk, taro slush, cloud foam",
          },
      ],
      toppings: ["Brown Sugar Pearls", "Honey Moon Pearls", "Coconut Jelly", "Vegan Moon Stones", "Aloe Vera", "Grass Jelly", "Pudding", "Coffee Jelly", "Yam & Taro Mochi", "Lychee Popping Pearls", "Mango Popping Pearls", "Strawberry Popping Pearls", "Cloud/Coco Foam"],
    };

    try {
      await addDoc(collection(db, 'stores'), data);
      setMessage('Store data added successfully!');
    } catch (error: any) {
      setMessage('Error adding store data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        className="px-4 py-2 bg-pink-pink text-white rounded-lg shadow hover:bg-pink-700"
        onClick={handleAddStoreData}
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Store Data'}
      </button>
      {message && (
        <p className="mt-4 text-black-ish">
          {message}
        </p>
      )}
    </div>
  );
};

export default AddStoreData;
