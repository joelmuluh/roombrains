import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { VscChromeClose } from "react-icons/vsc";
import { BsMicMuteFill } from "react-icons/bs";
import { BsFillMicFill } from "react-icons/bs";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsFillCameraVideoOffFill } from "react-icons/bs";
import { BsShareFill } from "react-icons/bs";
import { ImExit } from "react-icons/im";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { getDisplayMedia, getStream } from "../../functions/getStream";
function Home() {
  const {
    Invitation,
    Alert,
    adminName,
    receivedInvitation,
    setReceivedInvitation,
    setAdminName,
    showAlert,
    setShowAlert,
    alertMessage,
    setAlertMessage,
    setShowMobileChat,
    user,
    peer,
    meeting,
    streamsData,
    socket,
    roomData,
    dispatch,
    navigate,
  } = useOutletContext();
  return (
    <div className="px-[1rem] lg:px-[1.5rem] w-full h-full">
      <div className="pb-[0.8rem] px-[1rem] lg:pb-[1rem] border-b border-[rgba(255,255,255,0.1)]">
        <h1 className="font-bold text-[14px] lg:text-[1.5rem] text-center">
          {roomData?.name}
        </h1>
      </div>

      {streamsData.streams.length > 0 ? (
        <div className="pt-[2rem] video-wrapper gap-[1rem] w-[80%] lg:max-w-[900px] lg:mx-auto pb-[5rem]">
          {streamsData.streams
            .filter(
              (stream) => stream.conversationId === roomData.conversationId
            )
            .map((streamData) => (
              <Stream
                key={streamData._id}
                _id={streamData._id}
                stream={streamData.stream}
                image={streamData.image}
                username={streamData.username}
                conversationId={roomData.conversationId}
                roomData={roomData}
                peer={peer}
                streamsData={streamsData}
                user={user}
              />
            ))}
        </div>
      ) : (
        <div className="h-[80%] max-w-[600px] mx-auto flex justify-center items-center text-center">
          {roomData?.creator === user._id ? (
            <p className="text-[14px] lg:text-[16px]">
              No video stream yet. Click on the switch at the sidebar to start a
              stream. Also, you can invite someone or at most 4 people to stream
              while the others view from the chat section.
            </p>
          ) : (
            <p>
              No one is doing a video stream. The Admin of this room,{" "}
              <span className="font-semibold">{roomData?.creatorName}</span>,
              has not given permissions.
            </p>
          )}
        </div>
      )}
      <>
        {receivedInvitation && (
          <Invitation
            conversationId={roomData.conversationId}
            adminName={adminName}
            setReceivedInvitation={setReceivedInvitation}
            receivedInvitation={receivedInvitation}
            roomData={roomData}
            setShowMobileChat={setShowMobileChat}
          />
        )}
        {showAlert && <Alert text={alertMessage} setShowAlert={setShowAlert} />}
      </>
    </div>
  );
}

export default Home;

const Stream = ({
  _id,
  stream,
  username,
  image,
  conversationId,
  roomData,
  streamsData,
  user,
}) => {
  const streamRef = useRef();
  const dispatch = useDispatch();
  const [mute, setMute] = useState(false);
  const [generalMute, setGeneralMute] = useState(false);
  const [enableVideo, setEnableVideo] = useState(true);
  const [sharingScreen, setSharingScreen] = useState(false);
  const socket = useSelector((state) => state.streams.socket);
  const [showControlsPopup, setShowControlsPopup] = useState(false);
  useEffect(() => {
    if (streamRef) {
      streamRef.current.srcObject = stream;
    }
  }, [streamsData]);

  const muteUser = () => {
    setMute(true);
    dispatch({
      type: "MUTE_USER",
      payload: {
        conversationId,
        _id,
      },
    });
    setShowControlsPopup(false);
  };
  const unMuteUser = () => {
    setMute(false);
    dispatch({
      type: "UNMUTE_USER",
      payload: {
        conversationId,
        _id,
      },
    });
    setShowControlsPopup(false);
  };
  const enableVideoChat = () => {
    setEnableVideo(true);
    dispatch({
      type: "ENABLE_VIDEO",
      payload: {
        conversationId,
        _id,
      },
    });
    setShowControlsPopup(false);
  };
  const disableVideoChat = () => {
    setEnableVideo(false);
    dispatch({
      type: "DISABLE_VIDEO",
      payload: {
        conversationId,
        _id,
      },
    });
    setShowControlsPopup(false);
  };

  const leaveChat = () => {
    dispatch({
      type: "REMOVE_STREAM",
      payload: {
        conversationId,
        _id,
        myId: user._id,
      },
    });
    dispatch({
      type: "REMOVE_STREAMER",
      payload: {
        conversationId,
        _id,
      },
    });
    if (roomData.creator === _id) {
      dispatch({
        type: "STOP_STREAMING",
        payload: conversationId,
      });
    }
    socket.emit("user_left_stream", {
      conversationId,
      username,
      _id,
    });
    setShowControlsPopup(false);
  };

  const muteForEveryone = () => {
    setGeneralMute(true);
    dispatch({
      type: "MUTE_USER",
      payload: {
        conversationId,
        _id,
      },
    });
    socket.emit("mute_user_by_admin", {
      conversationId,
      _id,
    });
    setShowControlsPopup(false);
  };
  const unMuteForEveryone = () => {
    setGeneralMute(false);
    dispatch({
      type: "UNMUTE_USER",
      payload: {
        conversationId,
        _id,
      },
    });
    socket.emit("unmute_user_by_admin", {
      conversationId,
      _id,
    });
    setShowControlsPopup(false);
  };

  const removeFromChat = () => {
    dispatch({
      type: "REMOVE_STREAM",
      payload: {
        conversationId,
        _id,
      },
    });
    dispatch({
      type: "REMOVE_STREAMER",
      payload: {
        conversationId,
        _id,
      },
    });
    socket.emit("remove_user_by_admin", {
      conversationId,
      username,
      _id,
    });
    setShowControlsPopup(false);
  };

  const shareScreen = async () => {
    const screen = await getDisplayMedia();
    streamRef.current.srcObject = screen;
    setSharingScreen(true);
    setShowControlsPopup(false);
    const normalVideo = streamsData.streams.find(
      (stream) => stream._id === _id && stream.conversationId === conversationId
    );
    const screenTrack = screen.getTracks()[0];

    const handlers = streamsData.callHandlers.filter(
      (callHandler) => callHandler.conversationId === roomData.conversationId
    );

    if (handlers.length > 0) {
      handlers.forEach((handler) => {
        handler.call.peerConnection.getSenders().forEach((sender) => {
          if (sender.track.kind === "video") {
            sender.replaceTrack(screenTrack);
          }
        });
      });
    }

    screenTrack.onended = () => {
      streamRef.current.srcObject = normalVideo.stream;
      const handlers = streamsData.callHandlers.filter(
        (callHandler) => callHandler.conversationId === roomData.conversationId
      );
      if (handlers.length > 0) {
        handlers.forEach((handler) => {
          handler.call.peerConnection.getSenders().forEach((sender) => {
            if (sender.track.kind === "video") {
              sender.replaceTrack(normalVideo.stream.getVideoTracks()[0]);
            }
          });
        });
      }
      setSharingScreen(false);
    };
  };

  const quitScreenShare = () => {
    const normalVideo = streamsData.streams.find(
      (stream) => stream._id === _id && stream.conversationId === conversationId
    );
    streamRef.current.srcObject = normalVideo.stream;

    const handlers = streamsData.callHandlers.filter(
      (callHandler) => callHandler.conversationId === roomData.conversationId
    );
    if (handlers.length > 0) {
      handlers.forEach((handler) => {
        handler.call.peerConnection.getSenders().forEach((sender) => {
          if (sender.track.kind === "video") {
            sender.replaceTrack(normalVideo.stream.getVideoTracks()[0]);
          }
        });
      });
    }

    setSharingScreen(false);
    setShowControlsPopup(false);
  };

  return (
    <>
      <div className="video-player">
        <video
          className="w-[100%] max-h-[50vh]"
          ref={streamRef}
          autoPlay
          controls
        />

        <div className="flex items-center h-[55px] bg-[#3A3A3A] px-[1rem]">
          <Avatar alt={username} src={image} sx={{ width: 30, height: 30 }}>
            {username?.split("")[0]}
          </Avatar>
          <p className="flex-1 ml-[12px] text-[14px]">
            {_id === roomData.creator ? `${username} (The Admin)` : username}
          </p>

          <BsThreeDots
            onClick={() => setShowControlsPopup(true)}
            className="text-white"
            size={20}
          />
        </div>
      </div>
      <>
        {showControlsPopup && (
          <div
            onClick={() => setShowControlsPopup(false)}
            className="scale-in fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]  py-[1rem] z-[600] flex justify-center items-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="p-[1rem] mobile-max-width w-[350px] py-[1.5rem] bg-white text-black"
            >
              <div className="mb-[1.5rem] flex items-center justify-between">
                <p className="font-bold">{username}</p>
                <Avatar
                  alt={username}
                  src={image}
                  sx={{ width: 30, height: 30 }}
                >
                  {username?.split("")[0]}
                </Avatar>
              </div>
              <div className="">
                <div className="space-y-[0.7rem] lg:space-y-[1rem]">
                  {mute ? (
                    <div
                      onClick={() => unMuteUser()}
                      className=" lg:mb-[1rem] px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                    >
                      <BsMicMuteFill className="text-20px" />
                      <p className="text-[14px] cursor-pointer">unMute</p>
                    </div>
                  ) : (
                    <div
                      onClick={() => muteUser()}
                      className="px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                    >
                      <BsFillMicFill className="text-20px" />
                      <p className="text-[14px] cursor-pointer">Mute</p>
                    </div>
                  )}

                  {roomData.creator === user._id && roomData.creator !== _id && (
                    <>
                      {generalMute ? (
                        <div
                          onClick={() => unMuteForEveryone()}
                          className=" lg:mb-[1rem] px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                        >
                          <BsMicMuteFill className="text-20px" />
                          <p className="text-[14px] cursor-pointer">
                            Unmute For everyone
                          </p>
                        </div>
                      ) : (
                        <div
                          onClick={() => muteForEveryone()}
                          className="px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                        >
                          <BsFillMicFill className="text-20px" />
                          <p className="text-[14px] cursor-pointer">
                            Mute for everyone
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {enableVideo ? (
                    <div
                      onClick={() => disableVideoChat()}
                      className="px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                    >
                      <BsFillCameraVideoOffFill className="text-20px" />
                      <p className="text-[14px] cursor-pointer">
                        Disable Video
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => enableVideoChat()}
                      className="px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                    >
                      <BsCameraVideoFill className="text-20px" />
                      <p className="text-[14px] cursor-pointer">Enable Video</p>
                    </div>
                  )}

                  {_id === user._id && (
                    <>
                      {!sharingScreen ? (
                        <div
                          onClick={() => shareScreen()}
                          className=" lg:mb-[1rem] px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                        >
                          <BsShareFill className="text-20px" />
                          <p className="text-[14px] cursor-pointer">
                            share screen
                          </p>
                        </div>
                      ) : (
                        <div
                          onClick={() => quitScreenShare()}
                          className=" lg:mb-[1rem] px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                        >
                          <BsShareFill className="text-20px" />
                          <p className="text-[14px] cursor-pointer">
                            Stop ScreenShare
                          </p>
                        </div>
                      )}
                      <div
                        onClick={() => leaveChat()}
                        className=" lg:mb-[1rem] px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                      >
                        <ImExit className="text-20px" />
                        <p className="text-[14px] cursor-pointer">Leave Chat</p>
                      </div>
                    </>
                  )}

                  {roomData.creator === user._id && roomData.creator !== _id && (
                    <div
                      onClick={() => removeFromChat()}
                      className=" lg:mb-[1rem] px-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex space-x-[1rem] items-center hover:bg-gray-300 transition duration-200 cursor-pointer"
                    >
                      <ImExit className="text-20px" />
                      <p className="text-[14px] cursor-pointer">
                        Remove from Chat
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <VscChromeClose
              onClick={() => setShowControlsPopup(false)}
              className="absolute top-[2rem] right-[4rem] text-white text-[30px] font-bold"
            />
          </div>
        )}
      </>
    </>
  );
};
