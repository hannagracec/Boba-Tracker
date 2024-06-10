import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";

const house_icon = "/Navbar/house.svg";
const catalogue_icon = "/Navbar/book.svg";
const plus_icon = "/Navbar/plus.svg";
const shop_icon = "/Navbar/shop.svg";
const profile_icon = "/Navbar/profile.svg";

const CURRENT_PAGE_ICON_STYLES =
  "bg-medium-pink py-1 px-[18px] rounded-3xl border-2 border-black-ish shadow-b";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const Navbar = () => {
  const [currentPath, setCurrentPath] =
    useState<string>("");

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };

    updatePath();

    window.addEventListener("popstate", updatePath);

    return () => {
      window.removeEventListener("popstate", updatePath);
    };
  }, []);

  const NavLink = ({ href, children }: NavLinkProps) => {
    const isActive = currentPath === href;

    const handleClick = () => {
      setCurrentPath(href);
    };

    return (
      <Link href={href}>
        <div
          className={
            isActive
              ? CURRENT_PAGE_ICON_STYLES
              : "mx-[20px]"
          }
          onClick={handleClick}
        >
          {children}
        </div>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 w-full bg-white-ish shadow-t rounded-t-[18px]">
      <div className="flex items-center justify-center py-10">
        <NavLink href="/Dashboard">
          <Image
            src={house_icon}
            height={30}
            width={25}
            alt="Home icon"
          />
        </NavLink>
        <NavLink href="/Dashboard/Catalogue">
          <Image
            src={catalogue_icon}
            height={30}
            width={25}
            alt="Catalogue icon"
          />
        </NavLink>
        <NavLink href="/Dashboard/AddDrink">
          <Image
            src={plus_icon}
            height={30}
            width={25}
            alt="Add icon"
          />
        </NavLink>
        <NavLink href="/Dashboard/Browse">
          <Image
            src={shop_icon}
            height={30}
            width={25}
            alt="Browse shops icon"
          />
        </NavLink>
        <NavLink href="/Dashboard/Profile">
          <Image
            src={profile_icon}
            height={30}
            width={25}
            alt="Profile icon"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
