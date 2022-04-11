import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Button } from "@mui/material";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function UserBlocked() {
  const [username, setUsername] = useState(null);
  const [adminName, setAdminName] = useState(null);
  const user = useSelector((state) => state.user);
  const meeting = useSelector((state) => state.meeting);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = "Roombrains | Page Not Found";
    if (user.token && meeting.blocked_info) {
      const firstName = user.username.includes(" ")
        ? user.username.split(" ")[1]
        : user.username;
      setUsername(firstName);
      setAdminName(meeting.blocked_info);
      dispatch({ type: "CLEAR_BLOCKED_INFO" });
    } else {
      navigate("*");
    }
  }, []);
  return (
    <div>
      <Header />
      <div className="mt-[5rem] lg:mt-0 px-[1rem]">
        <div className="h-full flex flex-col-reverse md:flex-row items-center md:mt-[3rem]">
          <div className="md:w-[50%]">
            <img
              className="w-[100%]"
              src="/images/access_denied.png"
              alt="Page Not Found"
            />
          </div>
          <div className="md:w-[50%] text-center md:text-left">
            <h1 className="font-[500] text-[20px] lg:text-[25px] mb-[1rem] lg:max-w-[800px]">
              Sorry {username && username}, the admin of this Room
              {adminName && `, ${adminName},`} has blocked you. You cannot
              access this page until you are unblocked.
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-[1rem] text-[12px]">
              <Button
                variant="contained"
                onClick={() => navigate("/profile")}
                color="primary"
                startIcon={
                  <AiOutlineArrowLeft className="font-bold text-white" />
                }
                sx={{ height: "45px" }}
              >
                <span className="text-[12px]">Go to Profile</span>
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

export default UserBlocked;
