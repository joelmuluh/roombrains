import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../components/Room/Chat";
import Siderbar from "../components/Room/Siderbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../components/Loader";
import { GoThreeBars } from "react-icons/go";
import { BsFillChatDotsFill } from "react-icons/bs";
import Container from "../components/Container";
import Peer from "peerjs";
function Room() {
  const socket = useSelector((state) => state.streams.socket);
  const user = useSelector((state) => state.user);
  const { meetingId } = useParams();
  const [roomData, setRoomData] = useState();
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const streamsData = useSelector((state) => state.streams);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const info = {
    userId: user?._id,
    username: user?.username,
    token: user?.token,
    image: user?.image,
  };
  const { username, userId, image } = info;
  const peer = new Peer(undefined, {
    path: "/peer",
    host: "localhost",
    port: "5000",
  });
  const getRoom = async () => {
    dispatch({ type: "GET_PEER", payload: peer });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/room/${meetingId}`,
        {
          headers: {
            authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.exists) {
        if (!response.data.roomData.blocked.includes(user._id)) {
          setRoomData(response.data.roomData);
          document.title = response.data.roomData.name;
          socket.emit("addUser", userId);
          socket.emit("join-conversation", {
            conversationId: response.data.roomData.conversationId,
            userId,
            username,
          });
          dispatch({
            type: "INITIAL_STREAMERS",
            payload: response.data.roomData.conversationId,
          });

          peer.on("open", (id) => {
            socket.emit("new-connection", {
              conversationId: response.data.roomData.conversationId,
              _id: user._id,
              username,
              peerId: id,
              image: user.image,
            });
          });
          if (response.data.roomData.creator === user._id) {
            dispatch({
              type: "INITIAL_STREAMING_STATE",
              payload: response.data.roomData.conversationId,
            });
          } else {
          }

          setLoading(false);
          navigate("home");
        } else {
          dispatch({
            type: "SET_BLOCKED_INFO",
            payload: response.data.roomData.creatorName,
          });
          navigate("/room/blocked");
        }
      } else {
        navigate("*");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!user?.token) {
      dispatch({ type: "SAVE_INTENTED_ROOM", payload: meetingId });
      navigate("/login");
    } else {
      getRoom();
      dispatch({ type: "REMOVE_INTENTED_ROOM" });
    }
  }, [user, meetingId, userId, username]);

  return (
    <>
      {loading && !roomData?.exists ? (
        <div
          style={{ transform: "translate(-50%, -50%)" }}
          className="fixed top-[50%] right-[50%] left-[50%]"
        >
          <Loader />
        </div>
      ) : (
        <div className="h-[100vh] text-white">
          <div className="flex h-full bg-[#1C1C1C]">
            <div className="bg-[#1C1C1C] hidden show-nav h-[50px] w-full fixed flex justify-between items-center">
              {!showSidebar && (
                <div
                  className={`z-[2] xl:hidden absolute top-[0.7rem] left-[1rem]`}
                >
                  <GoThreeBars
                    onClick={() => setShowSidebar(true)}
                    className="text-white text-[1.6rem]"
                  />
                </div>
              )}
              <div className="fixed chat-icon hidden top-[0.7rem] right-[1rem] ">
                <div className="relative">
                  <BsFillChatDotsFill
                    onClick={() => {
                      setShowSidebar(false);
                      setShowMobileChat(true);
                      setMessageCount(0);
                    }}
                    className="text-white text-[25px]"
                  />
                  {messageCount !== 0 && (
                    <div className="flex items-center justify-center h-[20px] w-[20px] rounded-full bg-red-500 text-white text-[12px] position absolute top-[-8px] right-[-8px] pointer-events-none">
                      <span>{messageCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Siderbar
              roomData={roomData}
              setShowMobileChat={setShowMobileChat}
              setShowSidebar={setShowSidebar}
              showSidebar={showSidebar}
            />
            <div className="xl:flex-[0.55] flex-1 pt-[3rem] xl:py-[1rem] xl:mt-0 bg-[#1C1C1C] h-full overflow-y-auto overflow-x-hidden">
              <Container
                roomData={roomData}
                setShowMobileChat={setShowMobileChat}
              />
            </div>
            <Chat
              setShowMobileChat={setShowMobileChat}
              showMobileChat={showMobileChat}
              setShowSidebar={setShowSidebar}
              roomData={roomData}
              conversationId={roomData.conversationId}
              messageCount={messageCount}
              setMessageCount={setMessageCount}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Room;
