import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStream } from "../functions/getStream";
import Alert from "./Alert";

function Invitation({
  roomData,
  conversationId,
  adminName,
  receivedInvitation,
  setReceivedInvitation,
}) {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const user = useSelector((state) => state.user);
  const streamsData = useSelector((state) => state.streams);
  const socket = useSelector((state) => state.streams.socket);
  const firstName = user.username.includes(" ")
    ? user.username.split(" ")[1]
    : user.username;
  const acceptionInvitation = async () => {
    const streamers = streamsData.streamers;
    if (streamers.length >= 4) {
      setAlertMessage(
        `Sorry ${user.username} the admin has already invited more than 4 people`
      );
      setShowAlert(true);
      setTimeout(() => {
        setReceivedInvitation(false);
      }, 3000);
    } else {
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
        _id: user._id,
      });
      setReceivedInvitation(false);
    }
  };
  const declineInvitation = () => {
    socket.emit("invitation_declined", {
      conversationId: roomData?.conversationId,
      username: user.username,
    });
    setReceivedInvitation(false);
  };
  return (
    <div
      className={`scale-in ${
        !receivedInvitation && "scale-out"
      } fixed z-[1000] top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center`}
    >
      {showAlert && <Alert text={alertMessage} setShowAlert={setShowAlert} />}
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
              }}
              className="border-none bg-[#005FEE] text-white w-[100px] h-[40px]"
            >
              Accept
            </button>
            <button
              onClick={() => {
                declineInvitation();
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
