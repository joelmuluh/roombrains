import { Avatar } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
function ShowBlockedUsers({ showPopup, setSelectedOption, user, roomData }) {
  const dispatch = useDispatch();
  const blockedUsers = useSelector((state) => state.myRooms.blockedUsers);
  const firstName = user.username.includes(" ")
    ? user.username.split(" ")[0]
    : user.username;
  const [loading, setLoading] = useState(false);
  const unblockMember = async (userId) => {
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API}/room/unblock/${roomData._id}/${userId}`,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      dispatch({
        type: "UNBLOCK_USER",
        payload: {
          conversationId: roomData.conversationId,
          _id: userId,
        },
      });
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  return (
    <div
      onClick={() => {
        showPopup(false);
        setSelectedOption("actions");
      }}
      className={`scale-in fixed z-[1000] top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[white] w-[90%] mx-auto px-[1rem] py-[0.7rem] h-[500px] max-h-[500px] max-w-[500px] text-black rounded-[4px] pb-[1.5rem] overflow-y-auto"
      >
        {blockedUsers.length > 0 ? (
          blockedUsers.map((member) => (
            <div key={member._id} className="mt-[2rem] flex items-center">
              <div className="w-[40px] h-[40px]">
                <Avatar
                  alt={member.username}
                  src={member.image}
                  sx={{ width: "100%", height: "100%" }}
                >
                  {member.username?.split("")[0]}
                </Avatar>
              </div>
              <p className="text-black ml-[1rem] flex-1">{member.username}</p>{" "}
              <button
                onClick={() => unblockMember(member._id)}
                className="border-none ml-[1rem] text-white text-[12px] md:text-[14px] bg-[#1492E6] px-[0.6rem] py-[5px] "
              >
                {!loading ? "Unblock" : <i>unblocking...</i>}
              </button>
            </div>
          ))
        ) : (
          <div className="h-full text-[14px] md:text-[16px] w-full flex items-center justify-center">
            No user is blocked
          </div>
        )}
      </div>
      <VscChromeClose
        onClick={() => {
          showPopup(false);
          setSelectedOption("actions");
        }}
        className="absolute z-[20] top-[1.5rem] lg:top-[2rem] right-[2rem] lg:right-[4rem] text-white text-[30px] font-bold"
      />
    </div>
  );
}

export default ShowBlockedUsers;
