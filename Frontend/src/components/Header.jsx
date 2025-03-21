import React from "react";
import { Img } from "react-image";
import { useNavigate } from "react-router-dom";

const Header = ({ UI }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center p-2 bg-black text-white">
      <Img
        src={UI.header.logo}
        alt="Anime-Lover Logo"
        className="w-28 ml-4"
        loader={<p>Loading...</p>}
        unloader={<p>Failed to load</p>}
      />{" "}
      <nav className=" text-white py-4">
        <ul className="flex space-x-8 ml-12">
          {UI.header.menu.map((item, index) => (
            <li
              key={index}
              className="relative cursor-pointer text-lg font-medium hover:text-red-500 transition duration-300 after:block after:content-[''] after:w-0 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="bg-red-700 px-4 py-2 ml-auto"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
