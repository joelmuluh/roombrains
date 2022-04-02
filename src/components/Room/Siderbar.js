import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronUp } from "react-icons/fi";
import { VscChromeClose } from "react-icons/vsc";
import { FiSettings } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getStream } from "../../functions/getStream";
import { links } from "../../utils/sidelinks";
import Avatar from "@mui/material/Avatar";
import { IoIosVideocam } from "react-icons/io";
import { ImBlocked } from "react-icons/im";
import axios from "axios";
import Alert from "../Alert";
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
      className={`xl:flex-[0.2] ${
        showSidebar ? "show-sidebar" : "hide-sidebar"
      } xl:translate-x-0 xl:block xl:static bg-[#1F1F1F] h-full`}
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
            {roomData?.creatorName === user.username
              ? "Executive President"
              : "Member"}
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
          {/* <div></div> show list of participants and buttons for admin to operate on them */}
        </div>
        {chevronDown && (
          <div className="mt-[0.6rem] space-y-[0.9rem] h-[250px] overflow-y-auto relative">
            {participants.map((participant, index) => (
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
  const user = useSelector((state) => state.user);
  const streamsData = useSelector((state) => state.streams);

  const sendInvitation = () => {
    setShowChatPopup(false);
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
    }
  };

  const blockMember = async () => {
    socket.emit("block-user", { conversationId, _id });
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
        setShowChatPopup(false);
        setAlertMessage(`You had already blocked ${username}`);
        setShowAlert(true);
      } else {
        setShowChatPopup(false);
        setAlertMessage(`${username} has been blocked`);
        setShowAlert(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const unblockMember = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/room/unblock/${roomData._id}/${_id}`,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-[1rem]">
        <p className=" opacity-[0.9]">{username}</p>
        <BsThreeDots
          onClick={() => setShowChatPopup(true)}
          className="mr-[1rem]"
          size={20}
        />
      </div>
      {showAlert && <Alert text={alertMessage} setShowAlert={setShowAlert} />}
      {showChatPopup && (
        <div
          onClick={() => setShowChatPopup(false)}
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
                  setShowChatPopup(false);
                  blockMember();
                }}
                className="p-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex items-center space-x-[1rem] hover:bg-gray-300 transition duration-200 cursor-pointer"
              >
                <ImBlocked className="text-20px text-red-500" />
                <p className="text-[14px] lg:text-[16px] cursor-pointer">
                  Block
                </p>
              </div>
            </div>
          </div>
          <VscChromeClose
            onClick={() => setShowChatPopup(false)}
            className="absolute top-[2rem] right-[4rem] text-white text-[30px] font-bold"
          />
        </div>
      )}
      {showUnblockPopup && (
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
      )}
    </>
  );
};
