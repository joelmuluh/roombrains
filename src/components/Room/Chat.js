import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import Avatar from "@mui/material/Avatar";
import { GrEmoji } from "react-icons/gr";
import { IoMdSend } from "react-icons/io";
import { VscChromeClose } from "react-icons/vsc";
import { AiOutlineCaretLeft } from "react-icons/ai";
import { AiOutlineCaretRight } from "react-icons/ai";
import { IoIosVideocam } from "react-icons/io";
import { ImBlocked } from "react-icons/im";
import { useSelector } from "react-redux";
import Picker from "emoji-picker-react";
import moment from "moment";
import Alert from "../Alert";
function Chat({
  conversationId,
  roomData,
  showMobileChat,
  setShowMobileChat,
  setMessageCount,
  messageCount,
}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [backToFirstPage, setBackToFirstPage] = useState(false);
  const [loadChats, setLoadChats] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const socket = useSelector((state) => state.streams.socket);

  const user = useSelector((state) => state.user);
  const streamsData = useSelector((state) => state.streams);
  const info = {
    userId: user._id,
    token: user.token,
    senderImage: user.image,
    senderName: user.username,
  };
  const { senderImage, senderName, userId, token } = info;
  const firstName = user.username?.includes(" ")
    ? user?.username.split(" ")[1]
    : user.username;

  const getMessages = async () => {
    try {
      setLoadChats(true);
      setShowControls(false);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/message/room/${conversationId}?page=${page}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setLoadChats(false);
      setShowControls(true);
      const data = response.data;

      if (page === data.totalPages) {
        setLastPage(true);
      }
      if (page !== data.totalPages) {
        setLastPage(false);
      }
      if (page === 1) {
        setBackToFirstPage(true);
      }
      if (page !== 1) {
        setBackToFirstPage(false);
      }

      setMessages([...data.messages.reverse()]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [page]);

  useEffect(() => {
    window.addEventListener("click", () => {
      setShowEmoji(false);
    });
  }, []);

  const handleEmojiClick = (e, emojiObject) => {
    const emoji = emojiObject.emoji;
    setMessage((prev) => `${prev}${emoji}`);
  };

  const sendMessage = async () => {
    if (message.trim().length > 0) {
      const data = {
        senderId: userId,
        conversationId,
        message,
        senderImage,
        senderName,
        createdAt: Date.now(),
      };
      socket.emit("chatMessage", data);
      setMessages((prev) => [...prev, data]);
      try {
        const sentMessage = await axios.post(
          `${process.env.REACT_APP_API}/message/room`,

          data,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error.message);
      }

      setMessage("");
    } else {
      setMessage("");
    }
  };
  useEffect(() => {
    socket
      .off("chatMessage")
      .on(
        "chatMessage",
        ({
          senderId,
          conversationId,
          message,
          senderImage,
          senderName,
          createdAt,
        }) => {
          setMessages((prev) => [
            ...prev,
            {
              senderId,
              conversationId,
              message,
              senderImage,
              senderName,
              createdAt,
            },
          ]);
          if (!showMobileChat) {
            setMessageCount((prev) => prev + 1);
          }
        }
      );
  }, []);

  return (
    <div
      className={`chat-bar relative ${
        showMobileChat ? "show-mobile-chat" : "hide-mobile-chat"
      } flex-[0.25] bg-[#1F1F1F] h-full text-white flex flex-col`}
    >
      <div
        className={`relative py-[1.5rem] border-b border-[rgba(255,255,255,0.2)] mb-[1rem] h-[7%] ${
          showMobileChat && "flex items-center justify-between pl-[1rem]"
        }`}
      >
        <h1
          className={`text-center ${
            showMobileChat && "text-left"
          } font-semibold text-[1rem]`}
        >
          Room Chat
        </h1>
        <VscChromeClose
          onClick={() => {
            setShowMobileChat(false);
            setMessageCount(0);
          }}
          className="chat-close-btn hidden text-white text-[1.6rem] absolute top-[1rem] right-[1rem]"
        />
      </div>
      {showAlert && <Alert text={alertMessage} setShowAlert={setShowAlert} />}
      {showControls && (
        <div className="flex absolute fixed w-full px-[1rem] top-[3rem] lg:top-[2rem] items-center justify-between mb-[1.5rem]">
          {messages.length > 0 && (
            <>
              {loadChats && (
                <div className="loader w-[30px] h-[30px] rounded-full bg-[white] border-[10px] border-solid border-[#f3f3f3] border-t-[#3498db] border-b-[#3498db] absolute left-[50%] right-[50%] mt-[1rem]"></div>
              )}
              {!lastPage && (
                <AiOutlineCaretLeft
                  onClick={() => setPage((prev) => prev + 1)}
                  className="text-white  hover:text-[#005FEE] transition duration-200 text-[1.5rem] absolute left-[2rem] top-[0.08rem]"
                />
              )}
              {!backToFirstPage && (
                <AiOutlineCaretRight
                  onClick={() => setPage((prev) => prev - 1)}
                  className="text-white absolute right-[2rem] top-[0.08rem] text-[1.5rem] hover:text-[#005FEE] transition duration-200"
                />
              )}
            </>
          )}
        </div>
      )}
      <div className="h-[80%] overflow-y-auto">
        <div className="space-y-[0.7rem] mb-[1rem]">
          <>
            {messages?.length > 0 ? (
              messages?.map((chat, index) => (
                <ChatMessage
                  key={index}
                  senderId={chat.senderId}
                  conversationId={chat.conversationId}
                  message={chat.message}
                  senderImage={chat.senderImage}
                  senderName={chat.senderName}
                  messages={messages}
                  createdAt={chat.createdAt}
                  roomData={roomData}
                  setShowAlert={setShowAlert}
                  setAlertMessage={setAlertMessage}
                  setShowMobileChat={setShowMobileChat}
                />
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                No messages Yet
              </div>
            )}
          </>
        </div>
      </div>

      <div className="h-[7%] relative border-t border-b border-[rgba(255,255,255,0.2)]">
        {showEmoji && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="absolute bottom-[5rem] bg-red-400 left-[1rem] lg:left-0"
          >
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <div className="h-full flex items-center px-[2rem]">
          <div className="">
            <GrEmoji
              className={`${showEmoji && "text-[yellow]"}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowEmoji(true);
              }}
              size={25}
            />
          </div>
          <input
            className="flex-1 flex flexwrap-wrap text-white outline-none border-none h-full bg-transparent pl-[1rem] pr-[0.6rem] mobile-input"
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                sendMessage();
              }
            }}
          />

          <IoMdSend
            className="text-[25px] absolute right-[1rem]"
            color="#1492E6 "
            onClick={() => sendMessage()}
          />
        </div>
      </div>
      <div className="h-[10%]"></div>
    </div>
  );
}

export default Chat;

const ChatMessage = ({
  senderId,
  conversationId,
  message,
  senderImage,
  senderName,
  createdAt,
  messages,
  roomData,
  setShowAlert,
  setAlertMessage,
  setShowMobileChat,
}) => {
  const socket = useSelector((state) => state.streams.socket);
  const scrollDown = useRef();
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showUnblockPopup, setShowUnblockPopup] = useState(false);

  const user = useSelector((state) => state.user);
  const streamsData = useSelector((state) => state.streams);
  useEffect(() => {
    scrollDown.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const blockMember = async () => {
    socket.emit("block-user", { conversationId, _id: senderId });
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/room/block/${roomData._id}/${senderId}`,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.alreadyBlocked) {
        setShowChatPopup(false);
        setAlertMessage(`You had already blocked ${senderName}`);
        setShowAlert(true);
      } else {
        setShowChatPopup(false);
        setAlertMessage(`${senderName} has been blocked`);
        setShowAlert(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const unblockMember = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/room/unblock/${roomData._id}/${senderId}`,
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

  const sendInvitation = () => {
    setShowChatPopup(false);
    const streamArray = streamsData.streamers.find(
      (stream) => stream.conversationId === roomData.conversationId
    );

    if (streamArray.myStreamers.length >= 4) {
      setAlertMessage("You can't invite more than 4 people");
      setShowAlert(true);
    } else {
      setAlertMessage(`An invitation has been sent to ${senderName}`);
      setShowAlert(true);
      socket.emit("stream-invitation", {
        conversationId,
        userId: senderId,
        adminName: roomData.creatorName,
      });
      setTimeout(() => {
        setShowMobileChat(false);
      }, 2000);
    }
  };

  const streamArray = streamsData.streamers.find(
    (stream) => stream.conversationId === roomData.conversationId
  );

  return (
    <div
      className=""
      ref={scrollDown}
      // className={`${senderId === userId && "bg-[#545454] py-[10px]"}`}
    >
      <div className="px-[1rem] flex">
        <Avatar
          alt={senderName}
          src={senderImage}
          sx={{ width: 40, height: 40 }}
        >
          {senderName?.split("")[0]}
        </Avatar>
        <div className="ml-[0.7rem] flex-1 ">
          <p className="wrap font-semibold text-[13px]">
            {senderId === user._id ? "You" : senderName}
          </p>
          <p className="wrap mt-[0.2rem] opacity-[0.8] text-[14px]">
            {message}
          </p>
        </div>
        {roomData.creator === user._id && senderId !== user._id && (
          <>
            {roomData.blocked.includes(senderId) ? (
              <ImBlocked
                className="text-20px text-red-900"
                onClick={() => setShowUnblockPopup(true)}
                size={25}
              />
            ) : (
              <BsThreeDots onClick={() => setShowChatPopup(true)} size={25} />
            )}
          </>
        )}
      </div>
      <div className="wrap flex justify-end px-[1rem] text-[12px] text-[gray]">
        {moment(createdAt).fromNow()}
      </div>

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
              <p className="font-bold">{senderName}</p>
              <Avatar
                alt={senderName}
                src={senderImage}
                sx={{ width: 50, height: 50 }}
              >
                {senderName?.split("")[0]}
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
              <p className="font-bold">{senderName}</p>
              <Avatar
                alt={senderName}
                src={senderImage}
                sx={{ width: 50, height: 50 }}
              >
                {senderName?.split("")[0]}
              </Avatar>
            </div>
            <div className="mt-[3rem]">
              <p className="my-[1rem] text-[14px] lg:text-[16px]">
                Are you sure you want to unblock {senderName}?
              </p>
              <div className=" flex justify-between my-[1rem] items-center">
                <button
                  onClick={() => {
                    setShowUnblockPopup(false);
                    setAlertMessage(`You just Unblocked ${senderName}`);
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
    </div>
  );
};
