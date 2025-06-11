import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const {token,setToken,userData}=useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const logout=()=>{
    setToken(false)
    localStorage.removeItem("token");
  }
  

  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "auto";
  }, [showMenu]);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6fff] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6fff] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6fff] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6fff] w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointment
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5f6fff] text-white px-8 py-3 rounded-full front-light hidden md:block"
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-screen z-50 bg-white transition-transform duration-300 ${
            showMenu ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <div className="flex justify-items-center-safe items-center px-2 py-2 gap-0">
            <img className="w-32 ml-4" src={assets.logo} alt="Logo" />
            <img
              className="w-6 cursor-pointer ml-auto mr-4"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="Close"
            />
          </div>
          <ul className="flex flex-col items-start px-6 pt-4 text-base font-semibold gap-4">
            <NavLink to="/" onClick={() => setShowMenu(false)} className={({ isActive }) => `${isActive ? "text-[#5f6fff]" : ""}`}>
              HOME
            </NavLink>
            <NavLink to="/doctors" onClick={() => setShowMenu(false)} className={({ isActive }) => `${isActive ? "text-[#5f6fff]" : ""}`}>
              ALL DOCTORS
            </NavLink>
            <NavLink to="/about" onClick={() => setShowMenu(false)} className={({ isActive }) => `${isActive ? "text-[#5f6fff]" : ""}`}>
              ABOUT
            </NavLink>
            <NavLink to="/contact" onClick={() => setShowMenu(false)} className={({ isActive }) => `${isActive ? "text-[#5f6fff]" : ""}`}>
              CONTACT
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
