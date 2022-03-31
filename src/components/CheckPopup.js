import React from "react";
import { useSelector } from "react-redux";

function CheckPopup({ setGenerateNewId, setShowCheckPopup, showCheckPopup }) {
  const user = useSelector((state) => state.user);
  const firstName = user.username.includes(" ")
    ? user.username.split(" ")[1]
    : user.username;
  return (
    <div
      className={`scale-in ${
        !showCheckPopup && "scale-out"
      } fixed z-[1000] top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center`}
    >
      <div className="bg-[white] w-[90%] mx-auto p-[1rem] max-w-[500px]">
        <div className="text-black">
          <p className="text-[14px] lg:text-[16px]">
            {firstName}, Please make sure you are the only one in the room
            before changing the Meeting ID. This is to ensure any other
            participant is not disturbed. In addition, the page will refresh to
            integrate the new ID.
          </p>
          <p className="my-[1rem] text-[14px] lg:text-[16px]">
            Are you still willing to proceed?
          </p>
          <div className=" flex justify-between my-[1rem] items-center">
            <button
              onClick={() => {
                setGenerateNewId(true);
                setShowCheckPopup(false);
              }}
              className="border-none bg-[#005FEE] text-white w-[100px] h-[40px]"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setGenerateNewId(false);
                setShowCheckPopup(false);
              }}
              className="border-none text-[#005FEE] w-[100px]"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckPopup;
