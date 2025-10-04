"use client";

import { RxCross1, RxHamburgerMenu } from "react-icons/rx";

import { useChat } from "@/context/ChatContext";
import Link from "next/link";
import { useState } from "react";

function Navbar() {
  const { setFile, setIsLoading } = useChat();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = () => {
    setFile(null);
    setIsLoading(false);
    setMenuOpen(false);
  };

  return (
    <nav className="flex bg-amber-900 justify-between items-center px-6 md:px-12 py-4 relative">
      <Link
        className="text-lg font-medium cursor-pointer text-white"
        href={"/"}
        onClick={handleLogoClick}
      >
        PostGen
      </Link>
      {/* Desktop links */}
      <div className="gap-6 text-sm font-medium cursor-pointer text-white hidden md:flex">
        <div className="hover:underline ">future scope</div>
      </div>
      {/* Hamburger for small screens */}
      <div className="md:hidden">
        <button
          className="text-white focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Close menu"
        >
          {menuOpen ? <RxCross1 size={28} /> : <RxHamburgerMenu size={28} />}
        </button>

        {menuOpen && (
          <div className="absolute right-6 top-16 bg-amber-900 rounded shadow-lg flex flex-col w-40 z-50">
            <button
              className="text-left px-4 py-2 hover:underline text-white"
              onClick={() => setMenuOpen(false)}
            >
              future scope:
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
