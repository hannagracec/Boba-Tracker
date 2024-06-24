import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, doc, getDocs } from "firebase/firestore";
import firebaseConfig from '@/firebaseConfig';
import { initializeApp } from 'firebase/app';

const profile_icon = "/Dashboard/profile.svg";
const right_arrow = "/Dashboard/arrow_right.svg";
const circle_arrow = "/Dashboard/circle_arrow_right.svg";
const shop_icon = "/Dashboard/shop.svg";
const add_icon = "/Dashboard/add_circle.svg";

const DASHBOARD_PAGE_STYLES = "overflow-y-auto pb-[160px] bg-off-white text-black-ish p-4 flex flex-col items-center mt-2";

const PROFILE_TILE_STYLES =
  "bg-white-ish px-4 py-3 w-full max-w-[600px] border-2 border-black-ish rounded-lg shadow-b";
const PROFILE_ICON_CONTAINER_STYLES = 
  "mr-6 border-2 border-black-ish shadow-s bg-pastel-pink size-[100px] flex justify-center rounded-[50px]";
const PROFILE_BUTTON_STYLES =
  "flex items-center bg-medium-pink py-0.5 px-6 rounded-[30px] border-2 border-black-ish shadow-s w-full mb-4";

const DASHBOARD_CONTENT_STYLES = "mt-10 max-w-[600px] w-full";
const DASHBOARD_CONTENT_HEADER_STYLES = "font-semibold text-2xl ml-2 mb-2";

const BOBA_SAVED_CONTAINER_STYLES =
  "mr-3 text-center flex flex-col justify-center border-2 border-black-ish rounded-md bg-pink-pink size-[105px]";
const CATALOGUE_TEXT_STYLES = "font-semibold text-xs leading-[1.2] max-w-[230px]";

const STORES_ICON_CONTAINER_STYLES = "border-2 border-black-ish p-4 bg-deep-coral rounded-[50px] mb-4";
const ADD_DRINK_ICON_CONTAINER_STYLES = "border-2 border-black-ish p-4 bg-medium-pink rounded-[50px] mb-4";

const BUTTON_PRESSED_STYLES =
  "focus:outline-black-ish transition-all duration-200 active:shadow-none active:translate-y-0.5 active:border-black-ish";
const BOBA_CATALOGUE_PANEL_STYLES =
  "flex bg-white-ish border-2 border-black-ish shadow-b rounded-lg p-3 text-left w-full";

const VERTICAL_TILE_STYLES =
  "flex flex-col items-center justify-center h-[220px] bg-white-ish px-4 w-full max-w-[350px] border-2 border-black-ish rounded-lg shadow-b";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const DashboardPage = () => {
  const [userName, setUserName] = useState("Loading...");
  const [numDrinksSaved, setNumDrinksSaved] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || "User");

        const userDocRef = doc(db, 'users', user.uid);
        const drinksCollectionRef = collection(userDocRef, 'drinks');
        const drinksQuery = query(drinksCollectionRef);

        try {
          const querySnapshot = await getDocs(drinksQuery);
          setNumDrinksSaved(querySnapshot.size);
        } catch (error) {
          console.error("Error fetching drinks:", error);
        }
      } else {
        window.location.href = "/SignUp";
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={DASHBOARD_PAGE_STYLES}>
      <div className={PROFILE_TILE_STYLES}>
        <div className="flex">
          <div className={PROFILE_ICON_CONTAINER_STYLES}>
            <Image
              src={profile_icon}
              height={80}
              width={80}
              alt="Profile icon"
            />
          </div>
          <div>
            <div className="leading-[1]">
              <h1 className="font-black text-2xl">
                Hi, {userName}
              </h1>
              <h3 className="font-semibold mb-3">
                Welcome Back!
              </h3>
            </div>
            <Link href="/Dashboard/Profile">
              <button
                className={`${BUTTON_PRESSED_STYLES} ${PROFILE_BUTTON_STYLES}`}
              >
                <p className="font-medium">Go to Profile</p>
                <Image
                  src={right_arrow}
                  height={20}
                  width={20}
                  alt="Arrow icon"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className={DASHBOARD_CONTENT_STYLES}>
        <h1 className={DASHBOARD_CONTENT_HEADER_STYLES}>
          Your Dashboard
        </h1>
        <Link href="/Dashboard/Catalogue">
          <button
            className={`${BOBA_CATALOGUE_PANEL_STYLES} ${BUTTON_PRESSED_STYLES}`}
          >
            <div className={BOBA_SAVED_CONTAINER_STYLES}>
              {/* DYNAMICALLY CHANGE */}
              <h1 className="font-black text-[40px]">{numDrinksSaved}</h1>
              <h3 className="font-semibold text-xs">
                BOBA SAVED
              </h3>
            </div>
            <div className="w-4/5">
              <h1 className="font-black text-2xl mb-1">
                Boba Catalogue
              </h1>
              <p className={CATALOGUE_TEXT_STYLES}>
                Add more drinks to your catalogue to track
                your preferences!
              </p>
              <Image
                src={circle_arrow}
                height={35}
                width={35}
                alt="Right arrow icon"
                className="ml-auto mr-3"
              />
            </div>
          </button>
        </Link>
        <div className="flex mt-4">
          <Link
            href="/Dashboard/Browse"
            className="w-1/2 mr-1"
          >
            <button
              className={`${VERTICAL_TILE_STYLES} ${BUTTON_PRESSED_STYLES}`}
            >
              <div className={STORES_ICON_CONTAINER_STYLES}>
                <Image
                  src={shop_icon}
                  height={40}
                  width={45}
                  alt="Shop icon"
                />
              </div>
              <h1 className="font-black text-2xl leading-[1]">
                Browse Stores
              </h1>
            </button>
          </Link>
          <Link
            href="/Dashboard/AddDrink"
            className="w-1/2 ml-1"
          >
            <button
              className={`${VERTICAL_TILE_STYLES} ${BUTTON_PRESSED_STYLES}`}
            >
              <div className={ADD_DRINK_ICON_CONTAINER_STYLES}>
                <Image
                  src={add_icon}
                  height={40}
                  width={45}
                  alt="Shop icon"
                />
              </div>
              <h1 className="font-black text-2xl leading-[1]">
                Add New Drink
              </h1>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
