import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import CreateNewRoom from "./CreateNewRoom";
import MyRooms from "./MyRooms";

function CreateRoom({ setShowCreateRoom }) {
  const [currentTab, setCurrentTab] = useState("CreateNewRoom");

  return (
    <div className="fixed z-[10] overflow-y-scroll lg:overflow-y-auto top-0 bottom-0 left-0 right-0 lg:bg-[#1F1F1F] bg-[white] scale-in text-black">
      <div className=" lg:mt-[2.5rem] max-w-[800px] mx-auto ">
        <div className="flex bg-[#1F1F1F] py-[1rem] lg:py-0 lg:block justify-between items-center px-[1rem] lg:px-0">
          <h1 className=" lg:mb-[2rem] lg:mb-[3rem] font-[400] text-[1rem] lg:text-[1.5rem] lg:text-[2rem] text-white">
            Room Mangement
          </h1>
          <VscChromeClose
            onClick={() => setShowCreateRoom(false)}
            className="lg:absolute top-[2rem] right-[2rem] lg:right-[5rem] text-[25px] lg:text-[30px] lg:text-[40px] text-white  "
            color="white"
          />
        </div>
        <div className="lg:mt-[1rem] relative lg:mt-[4rem] bg-[white] lg:h-[600px] pb-[50px] lg:pb-[60px]">
          <div className="sticky top-0 bg-[white]">
            <div className="flex border-b-2 border-[rgba(0,0,0,0.2)]">
              <div
                onClick={() =>
                  currentTab !== "CreateNewRoom" &&
                  setCurrentTab("CreateNewRoom")
                }
                className="h-[50px] flex-1 cursor-pointer"
              >
                <div className="h-full">
                  <div className="h-full text-[14px] lg:text-[17px] flex items-center justify-center  cursor-pointer">
                    Create New Room
                  </div>
                </div>
              </div>
              <div
                onClick={() =>
                  currentTab !== "MyRooms" && setCurrentTab("MyRooms")
                }
                className="h-[50px] flex-1  cursor-pointer"
              >
                <div className="h-full">
                  <div className="h-full flex items-center justify-center  cursor-pointer text-[14px] lg:text-[17px]">
                    My Rooms
                  </div>
                </div>
              </div>
            </div>
            {currentTab === "CreateNewRoom" ? (
              <div className="h-[5px] flex">
                <div className="bg-[#1492E6] h-full flex-1 slide-in"></div>
                <div className="bg-transparent h-full flex-1"></div>
              </div>
            ) : (
              <div className="h-[5px] flex">
                <div className="bg-transparent h-full  flex-1 slide-in"></div>
                <div className="bg-[#1492E6] h-full flex-1"></div>
              </div>
            )}
          </div>
          <div className="h-full">
            {currentTab === "CreateNewRoom" ? <CreateNewRoom /> : <MyRooms />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
