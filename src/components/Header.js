import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user?.token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user?.token]);
  return (
    <header className="text-white h-[60px] sm:h-[70px] bg-[#0B1753] sticky top-0 left-0 z-[5000] w-full">
      <div className="h-full max-w-[1300px] mx-auto w-[90%] flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center">
            <img
              src="/images/brain.jpg"
              alt="logo"
              className="w-[30px] h-[30px]"
            />
            <h1 className="text-white font-semibold ml-[0.5rem] text-[14px] lg:text-[16px]">
              ROOMBRAINS
            </h1>
          </div>
        </Link>
        <div>
          {loggedIn ? (
            <>
              {window.location.pathname === "/profile" ? (
                <button
                  onClick={() => navigate("/")}
                  className="font-[500] text-white hover:text-[#31FDF4] transition duration-200"
                >
                  Home
                </button>
              ) : (
                <button
                  onClick={() => navigate("/profile")}
                  className="font-[500] text-white hover:text-[#31FDF4] transition duration-200"
                >
                  Profile
                </button>
              )}
            </>
          ) : (
            <>
              {window.location.pathname !== "/login" ? (
                <button
                  onClick={() => navigate("/login")}
                  className="font-[500] text-white hover:text-[#31FDF4] transition duration-200"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => navigate("/")}
                  className="font-[500] text-white hover:text-[#31FDF4] transition duration-200"
                >
                  Home
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
