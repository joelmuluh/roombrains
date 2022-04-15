import React from "react";
import { VscChromeClose } from "react-icons/vsc";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
function UnblockPopup({
  setShowUnblockPopup,
  username,
  _id,
  image,
  roomData,
  setAlertMessage,
  setShowAlert,
  setBlocked,
}) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const unblockMember = async () => {
    setBlocked(false);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/room/unblock/${roomData._id}/${_id}`,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "UNBLOCK_USER",
        payload: {
          conversationId: roomData.conversationId,
          _id,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowUnblockPopup(false)}
      className="scale-in fixed top-0 left-0 right-0  bottom-0 bg-[rgba(0,0,0,0.7)]  py-[1rem] z-[600] flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-[1rem] mobile-max-width w-[400px] h-[300px] bg-white text-black"
      >
        <div className="mb-[1rem] flex items-center justify-between">
          <p className="font-bold">{username}</p>
          <Avatar alt={username} src={image} sx={{ width: 50, height: 50 }}>
            {username?.split("")[0]}
          </Avatar>
        </div>
        <div className="mt-[3rem]">
          <p className="my-[1rem] text-[14px] lg:text-[16px]">
            Are you sure you want to unblock {username}?
          </p>
          <div className=" flex justify-between my-[1rem] items-center">
            <button
              onClick={() => {
                setShowUnblockPopup(false);
                setAlertMessage(`You just Unblocked ${username}`);
                setShowAlert(true);
                unblockMember();
              }}
              className="border-none bg-[#005FEE] text-white w-[100px] h-[40px]"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setShowUnblockPopup(false);
              }}
              className="border-none text-[#005FEE] w-[100px]"
            >
              No
            </button>
          </div>
        </div>
      </div>
      <VscChromeClose
        onClick={() => setShowUnblockPopup(false)}
        className="absolute top-[2rem] right-[4rem] text-white text-[30px] font-bold"
      />
    </div>
  );
}

export default UnblockPopup;
