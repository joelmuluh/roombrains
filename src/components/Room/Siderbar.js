import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronUp } from "react-icons/fi";
import { VscChromeClose } from "react-icons/vsc";
import { FiSettings } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getStream } from "../../functions/getStream";
import { links } from "../../utils/sidelinks";
import axios from "axios";
import Alert from "../Alert";
import ChatPopup from "../ChatPopup";
import UnblockPopup from "../UnblockPopup";
function Siderbar({ roomData, showSidebar, setShowSidebar }) {
  const socket = useSelector((state) => state.streams.socket);
  const [participants, setParticipants] = useState([]);
  const [activeLink, setActiveLink] = useState("Home");
  const [chevronDown, setChevronDown] = useState(false);
  const user = useSelector((state) => state.user);
  const meeting = useSelector((state) => state.meeting);
  const peer = meeting.peer;
  const streamsData = useSelector((state) => state.streams);
  const dispatch = useDispatch();
  const conversationId = roomData?.conversationId;
  const streamingState = streamsData.streaming.find(
    (streamState) => streamState.conversationId === roomData.conversationId
  );
  window.addEventListener("click", () => {
    setShowSidebar(false);
  });
  const startStream = async () => {
    dispatch({ type: "START_STREAMING", payload: roomData?.conversationId });
    const localstream = await getStream();
    const payload = {
      _id: user._id,
      image: user.image,
      username: user.username,
      stream: localstream,
      conversationId: conversationId,
    };

    dispatch({ type: "ADD_STREAM", payload });
    dispatch({
      type: "ADD_STREAMER",
      payload: {
        conversationId: conversationId,
        _id: user._id,
      },
    });

    socket.emit("admin-calling", {
      conversationId,
      username: user.username,
    });
  };

  const stopStream = () => {
    dispatch({ type: "STOP_STREAMING", payload: roomData?.conversationId });
    dispatch({
      type: "REMOVE_STREAM",
      payload: {
        conversationId: conversationId,
        _id: user._id,
      },
    });

    dispatch({
      type: "REMOVE_STREAMER",
      payload: {
        conversationId,
        _id: user._id,
      },
    });
    socket.emit("admin-stopped-call", {
      _id: user._id,
      username: user.username,
      conversationId,
    });
  };

  socket.off("get-participants").on("get-participants", (myusers) => {
    setParticipants(myusers);
  });

  socket.off("others_peerId").on("others_peerId", (data) => {
    if (data.inviteeId === user._id) {
      const streamData = streamsData.streams.find(
        (stream) =>
          stream.conversationId === roomData.conversationId &&
          stream._id === user._id
      );
      peer?.call(data.peerId, streamData?.stream, {
        metadata: {
          _id: user._id,
          image: user.image,
          username: user.username,
        },
      });
    }
  });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`flex-[0.2] ${
        showSidebar ? "show-sidebar" : "hide-sidebar"
      } xl:block xl:static h-full bg-[#1F1F1F] overflow-y-auto pb-[4rem]`}
    >
      <VscChromeClose
        onClick={() => setShowSidebar(false)}
        className="absolute top-[1rem] right-[1rem] xl:hidden text-white text-[1.6rem]"
      />

      <div className="border-b border-[rgba(255,255,255,0.1)] pb-[1rem]">
        <div className="mt-[1rem] px-[1rem]">
          <h1 className="text-[16px] font-bold lg:text-[18px]">
            {user.username}
          </h1>
          <p className="text-[13px] lg:text-[16px] opacity-[0.75] mt-[6px]">
            {roomData?.creatorName === user.username ? "Admin" : "Member"}
          </p>
        </div>
      </div>

      <div className="mt-[1rem] border-b border-[rgba(255,255,255,0.1)] pb-[1.5rem]">
        {links.map((link, index) => (
          <Utility
            key={index}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            setShowSidebar={setShowSidebar}
            text={link.text}
            icon={link.icon}
            url={link.url}
          />
        ))}
        {roomData?.creator === user._id && (
          <Settings
            activeLink={activeLink}
            setShowSidebar={setShowSidebar}
            setActiveLink={setActiveLink}
            text={"Settings"}
            icon={<FiSettings className="text-[18px] lg:text-[25px]" />}
            url={"settings"}
          />
        )}
      </div>
      {user._id === roomData?.creator && (
        <div className="w-full flex items-center justify-between px-[1rem] mt-[1rem]">
          <p>Video</p>
          <div className="flex items-center justify-center space-x-[10px]">
            <div
              className={`${
                streamingState.value ? "#1492E6" : "bg-[white]"
              } w-[50px] h-[20px] rounded-full bg-white flex items-center`}
            >
              <div
                onClick={() => {
                  if (!streamingState.value) {
                    startStream();
                  } else {
                    stopStream();
                  }
                  setShowSidebar(false);
                }}
                className={`w-[40%] h-[90%] rounded-full bg-[#1492E6] transform ${
                  streamingState.value
                    ? "bg-[white] translate-x-[150%] transition duration-[400ms]"
                    : "bg-[#1F1F1F] translate-x-0 transition duration-[400ms]"
                }`}
              ></div>
            </div>
            <p>{streamingState.value ? "On" : "Off"}</p>
          </div>
        </div>
      )}

      <div className="mt-[3rem]">
        <div
          className={`text-[17px] py-[10px] px-[1rem] flex justify-between items-center cursor-pointer`}
        >
          <div className="opacity-[0.7] hover:opacity-[1] ">
            <span>Participants</span>
            <span className="font-bold"> ({participants.length}) </span>
          </div>{" "}
          <FiChevronUp
            className={`transition duration-200 hover:scale-[1.3] mr-[0.8rem] ${
              chevronDown && "rotate-180"
            }  `}
            onClick={() => setChevronDown((prev) => !prev)}
            size={25}
          />
        </div>
        {chevronDown && (
          <div className="mt-[0.6rem] space-y-[0.9rem]">
            {participants.map((participant) => (
              <Participant
                key={participant._id}
                conversationId={roomData.conversationId}
                username={participant.username}
                _id={participant._id}
                image={participant.image}
                roomData={roomData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Siderbar;

const Utility = ({
  activeLink,
  setActiveLink,
  setShowSidebar,
  icon,
  text,
  url,
}) => {
  return (
    <Link
      to={url}
      onClick={() => {
        setActiveLink(text);
        setShowSidebar(false);
      }}
    >
      <div
        className={`w-full mt-[0.7rem] hover:bg-[#005FEE] transition duration-[150ms] ease-in py-[10px] px-[1rem] ${
          activeLink === text && "bg-[#005FEE]"
        }`}
      >
        <div className="flex items-center">
          {icon}
          <p
            className={`text-[17px] ml-[0.8rem] lg:ml-[1.5rem] hover:opacity-[1]  ${
              activeLink === text ? "opacity-[1]" : "opacity-[0.7]"
            }`}
          >
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Settings = ({
  activeLink,
  setActiveLink,
  setShowSidebar,
  text,
  icon,
}) => {
  return (
    <Link
      to={"settings"}
      onClick={() => {
        setActiveLink(text);
        setShowSidebar(false);
      }}
    >
      <div
        className={`w-full mt-[0.7rem] hover:bg-[#005FEE] transition duration-[150ms] ease-in py-[10px] px-[1rem] ${
          activeLink === text && "bg-[#005FEE]"
        }`}
      >
        <div className="flex items-center">
          {icon}
          <p
            className={`text-[17px] ml-[0.8rem] lg:ml-[1.5rem] hover:opacity-[1]  ${
              activeLink === text ? "opacity-[1]" : "opacity-[0.7]"
            }`}
          >
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Participant = ({ username, conversationId, _id, image, roomData }) => {
  const socket = useSelector((state) => state.streams.socket);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showUnblockPopup, setShowUnblockPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [blocked, setBlocked] = useState(false);
  const user = useSelector((state) => state.user);

  return (
    <>
      <div className="flex items-center justify-between px-[1rem]">
        <p className=" opacity-[0.9]">{username}</p>
        {user._id === roomData.creator && _id !== roomData.creator && (
          <BsThreeDots
            onClick={() => setShowChatPopup(true)}
            className="mr-[1rem]"
            size={20}
          />
        )}
      </div>

      {showChatPopup && (
        <ChatPopup
          username={username}
          image={image}
          conversationId={conversationId}
          _id={_id}
          setAlertMessage={setAlertMessage}
          setShowAlert={setShowAlert}
          roomData={roomData}
          setShowPopup={setShowChatPopup}
          setBlocked={setBlocked}
        />
      )}
      {showUnblockPopup && (
        <UnblockPopup
          setShowUnblockPopup={setShowUnblockPopup}
          username={username}
          _id={_id}
          image={image}
          roomData={roomData}
          setAlertMessage={setAlertMessage}
          setShowAlert={setShowAlert}
          setBlocked={setBlocked}
        />
      )}
      {showAlert && <Alert text={alertMessage} setShowAlert={setShowAlert} />}
    </>
  );
};
