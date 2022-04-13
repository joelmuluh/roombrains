import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import Avatar from "@mui/material/Avatar";
import { GrEmoji } from "react-icons/gr";
import { IoMdSend } from "react-icons/io";
import { VscChromeClose } from "react-icons/vsc";
import { AiOutlineCaretLeft } from "react-icons/ai";
import { AiOutlineCaretRight } from "react-icons/ai";
import { ImBlocked } from "react-icons/im";
import { useSelector } from "react-redux";
import Picker from "emoji-picker-react";
import moment from "moment";
import Alert from "../Alert";
import ChatPopup from "../ChatPopup";
import UnblockPopup from "../UnblockPopup";
function Chat({
  conversationId,
  roomData,
  showMobileChat,
  setShowMobileChat,
  setMessageCount,
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
      className={`chat-bar relative z-[100] ${
        showMobileChat ? "show-mobile-chat" : "hide-mobile-chat"
      }  flex-[0.25] bg-[#1F1F1F] h-full text-white flex flex-col`}
    >
      <div
        className={`relative py-[1.5rem] border-b border-[rgba(255,255,255,0.2)] mb-[1rem] h-[9%] lg:h-[7%] ${
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
      {loadChats && (
        <div className="loader w-[30px] h-[30px] rounded-full bg-[white] border-[10px] border-solid border-[#f3f3f3] border-t-[#3498db] border-b-[#3498db] absolute left-[50%] right-[50%] mt-[30%]"></div>
      )}
      {showAlert && <Alert text={alertMessage} setShowAlert={setShowAlert} />}
      {showControls && (
        <div className="flex absolute fixed w-full px-[1rem] top-[3rem] lg:top-[2rem] items-center justify-between mb-[1.5rem]">
          {messages.length > 0 && (
            <>
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
      <div className="h-[83%] lg:h-[80%] overflow-y-auto">
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

      <div className="h-[50px] bg-[#1F1F1F] lg:h-[7%] border-t border-b border-[rgba(255,255,255,0.2)] w-full absolute bottom-0 left-0 md:static">
        <div className="relative h-full w-full flex items-center">
          {showEmoji && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="absolute bottom-[5rem] left-[1rem] lg:left-0"
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
      </div>
      <div className="h-[10%] hidden md:block"></div>
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
  const scrollDown = useRef();
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showUnblockPopup, setShowUnblockPopup] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const user = useSelector((state) => state.user);
  useEffect(() => {
    scrollDown.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-full" ref={scrollDown}>
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
            {roomData.blocked.includes(senderId) || blocked ? (
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
        <ChatPopup
          username={senderName}
          image={senderImage}
          conversationId={conversationId}
          _id={senderId}
          setAlertMessage={setAlertMessage}
          setShowAlert={setShowAlert}
          roomData={roomData}
          setShowPopup={setShowChatPopup}
          setShowMobileChat={setShowMobileChat}
          setBlocked={setBlocked}
        />
      )}
      {showUnblockPopup && (
        <UnblockPopup
          setShowUnblockPopup={setShowUnblockPopup}
          username={senderName}
          _id={senderId}
          image={senderImage}
          roomData={roomData}
          setAlertMessage={setAlertMessage}
          setShowAlert={setShowAlert}
          setBlocked={setBlocked}
        />
      )}
    </div>
  );
};
