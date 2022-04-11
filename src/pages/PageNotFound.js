import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Button } from "@mui/material";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PageNotFound() {
  const [username, setUsername] = useState(null);
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Roombrains | Page Not Found";
    if (user.token) {
      const firstName = user.username.includes(" ")
        ? user.username.split(" ")[1]
        : user.username;
      setUsername(firstName);
    }
  }, []);
  return (
    <div>
      <Header />
      <div className="mt-[4rem] lg:mt-0 px-[1rem]">
        <div className="flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-[60%] h-full">
            <img
              className="w-[100%] xl:max-h-[900px] xl:object-contain"
              src="/images/404.jpg"
              alt="Page Not Found"
            />
          </div>
          <div className="md:w-[40%] text-center md:text-left">
            <h1 className="font-[500] text-[25px] lg:text-[35px] mb-[1rem] lg:max-w-[600px]">
              Sorry{username && ` ${username}`}, the page you were trying to
              access doesn't exist.
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-[1rem] text-[12px]">
              <Button
                variant="contained"
                onClick={() => {
                  if (user.token) {
                    navigate("/profile");
                  } else {
                    navigate("/login");
                  }
                }}
                color="primary"
                startIcon={
                  <AiOutlineArrowLeft className="font-bold text-white" />
                }
                sx={{ height: "45px" }}
              >
                <span className="text-[12px]">
                  {user.token ? "Go to Profile" : "Login"}
                </span>
              </Button>
              <Button
                // variant="outline"
                onClick={() => navigate("/")}
                color="primary"
                startIcon={
                  <AiOutlineArrowLeft className="font-bold text-white" />
                }
                sx={{ height: "45px" }}
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
