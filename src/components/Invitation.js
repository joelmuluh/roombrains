import Peer from "peerjs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStream } from "../functions/getStream";
import { socket } from "../socket/socketConnection";

function Invitation({
  roomData,
  conversationId,
  adminName,
  receivedInvitation,
  setReceivedInvitation,
  setShowMobileChat,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const meeting = useSelector((state) => state.meeting);
  const streams = useSelector((state) => state.streams);
  const peer = meeting.peer;
  const firstName = user.username.includes(" ")
    ? user.username.split(" ")[1]
    : user.username;
  const navigate = useNavigate();
  const acceptionInvitation = async () => {
    const localstream = await getStream();

    dispatch({
      type: "ADD_STREAM",
      payload: {
        _id: user._id,
        username: user.username,
        image: user.image,
        stream: localstream,
        conversationId: roomData?.conversationId,
      },
    });

    dispatch({
      type: "ADD_STREAMER",
      payload: {
        conversationId: roomData?.conversationId,
        _id: user._id,
      },
    });

    socket.emit("invitation-accepted", {
      conversationId,
      username: user.username,
      userId: user._id,
    });
    // setShowMobileChat(false);
    // navigate("/");
  };

  return (
    <div
      className={`scale-in ${
        !receivedInvitation && "scale-out"
      } fixed z-[1000] top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center`}
    >
      <div className="bg-[white] w-[90%] mx-auto p-[1rem] max-w-[500px]">
        <div className="text-black">
          <h1 className="font-semibold text-center text-[black] text-[1.2rem] lg:text-[1.5rem] mb-[2rem]">
            Invitation to Stream
          </h1>
          <p className="my-[1rem] text-[14px] lg:text-[16px]">
            {" "}
            Hey {firstName}, the Admin of this Room, {adminName}, has invited
            you for a video stream.
          </p>
          <div className=" flex justify-between my-[2rem] items-center">
            <button
              onClick={() => {
                acceptionInvitation();
                setReceivedInvitation(false);
              }}
              className="border-none bg-[#005FEE] text-white w-[100px] h-[40px]"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setReceivedInvitation(false);
              }}
              className="border-none bg-red-500 text-white w-[100px] h-[40px]"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invitation;
