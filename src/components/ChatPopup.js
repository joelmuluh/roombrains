import React from "react";
import Avatar from "@mui/material/Avatar";
import { VscChromeClose } from "react-icons/vsc";
import { IoIosVideocam } from "react-icons/io";
import { ImBlocked } from "react-icons/im";
import axios from "axios";
import { useSelector } from "react-redux";
function ChatPopup({
  username,
  image,
  conversationId,
  _id,
  roomData,
  setShowAlert,
  setAlertMessage,
  setShowMobileChat,
  setShowPopup,
  setBlocked,
}) {
  const user = useSelector((state) => state.user);
  const streamsData = useSelector((state) => state.streams);
  const socket = useSelector((state) => state.streams.socket);

  const blockMember = async () => {
    setBlocked(true);
    socket.emit("block-user", { conversationId, _id: _id });
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/room/block/${roomData._id}/${_id}`,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.alreadyBlocked) {
        setShowPopup(false);
        setAlertMessage(`You had already blocked ${username}`);
        setShowAlert(true);
      } else {
        setShowPopup(false);
        setAlertMessage(`${username} has been blocked`);
        setShowAlert(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendInvitation = () => {
    setShowPopup(false);
    const streamArray = streamsData.streamers.find(
      (stream) => stream.conversationId === roomData.conversationId
    );

    if (streamArray.myStreamers.length >= 4) {
      setAlertMessage("You can't invite more than 4 people");
      setShowAlert(true);
    } else {
      setAlertMessage(`An invitation has been sent to ${username}`);
      setShowAlert(true);
      socket.emit("stream-invitation", {
        conversationId,
        userId: _id,
        adminName: roomData.creatorName,
      });
      if (setShowMobileChat) {
        setTimeout(() => {
          setShowMobileChat(false);
        }, 2000);
      }
    }
  };

  return (
    <div
      onClick={() => setShowPopup(false)}
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
        <div className="space-y-[0.7rem] mt-[2rem]">
          <div
            onClick={() => {
              sendInvitation();
            }}
            className="px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
          >
            <IoIosVideocam className="text-20px" />
            <p className="text-[14px] lg:text-[16px] cursor-pointer">
              Invite to Video Stream
            </p>
          </div>
          <div
            onClick={() => {
              setShowPopup(false);
              blockMember();
            }}
            className="p-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex items-center space-x-[1rem] hover:bg-gray-300 transition duration-200 cursor-pointer"
          >
            <ImBlocked className="text-20px text-red-500" />
            <p className="text-[14px] lg:text-[16px] cursor-pointer">Block</p>
          </div>
        </div>
      </div>
      <VscChromeClose
        onClick={() => setShowPopup(false)}
        className="absolute top-[2rem] right-[4rem] text-white text-[30px] font-bold"
      />
    </div>
  );
}

export default ChatPopup;
