import React from "react";
import { useSelector } from "react-redux";

function DeleteRoom({ setShowDeletePopup, deleteRoom }) {
  const user = useSelector((state) => state.user);
  const firstName = user.username.includes(" ")
    ? user.username.split(" ")[1]
    : user.username;
  return (
    <div
      className={`scale-in fixed z-[1000] top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center`}
    >
      <div className="bg-[white] w-[90%] mx-auto p-[1rem] max-w-[500px]">
        <div className="text-black">
          <p className="text-[14px] lg:text-[16px]">
            {firstName}, If you delete this room, all Chats and Data related to
            this room will be gone. Also, any current participant of this room
            will lose access immediately.
          </p>
          <p className="my-[1rem] text-[14px] lg:text-[16px]">
            Are you still willing to proceed?
          </p>
          <div className=" flex justify-between my-[2rem] items-center">
            <button
              onClick={() => {
                setShowDeletePopup(false);

                deleteRoom();
              }}
              className="border-none bg-red-500 text-white w-[100px] h-[40px]"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setShowDeletePopup(false);
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

export default DeleteRoom;
