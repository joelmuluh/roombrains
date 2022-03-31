import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { socket } from "../../socket/socketConnection";
import Invitation from "../Invitation";
import Alert from "../Alert";
import { getStream } from "../../functions/getStream";
function Home() {
  const { setShowMobileChat, roomData } = useOutletContext();
  const user = useSelector((state) => state.user);
  const streamsData = useSelector((state) => state.streams);
  const meeting = useSelector((state) => state.meeting);
  const firstName = user.username?.includes(" ")
    ? user?.username.split(" ")[1]
    : user.username;
  const [receivedInvitation, setReceivedInvitation] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const peer = meeting.peer;

  useEffect(() => {
    peer?.on("call", (call) => {
      call.answer();
      call?.on("stream", (remoteStream) => {
        const payload = {
          _id: call.metadata._id,
          image: call.metadata.image,
          username: call.metadata.username,
          stream: remoteStream,
          conversationId: roomData.conversationId,
        };
        dispatch({ type: "ADD_STREAM", payload });
        dispatch({
          type: "ADD_STREAMER",
          payload: {
            conversationId: roomData.conversationId,
            _id: call.metadata._id,
          },
        });
        //remove this line in production
      });
    });

    socket.off("invitation-from-admin").on("invitation-from-admin", (data) => {
      if (data.userId === user._id) {
        setReceivedInvitation(true);
        setAdminName(data.adminName);
      }
    });

    socket
      .off("invitation-accepted")
      .on("invitation-accepted", async (data) => {
        if (roomData.creator === user._id) {
          setAlertMessage(`${data.username} just accepted your invitation`);
          setShowAlert(true);
        } else {
          setAlertMessage(`${data.username} has been invited on stream`);
          setShowAlert(true);
        }
        socket.emit("others_peerId", {
          peerId: peer?.id,
          conversationId: roomData.conversationId,
          inviteeId: data.userId,
        });
      });
    //The invited member is getting other other users peerId and passing

    socket.off("admin-calling").on("admin-calling", (data) => {
      setAlertMessage(
        `The admin of this room, ${data.username}, just joined the stream`
      );
      setShowAlert(true);
      socket.emit("users_peerId", {
        conversationId: data.conversationId,
        peerId: peer?.id,
        username: user.username,
      });
    });

    socket.off("admin-stopped-call").on("admin-stopped-call", (data) => {
      dispatch({
        type: "REMOVE_STREAM",
        payload: {
          conversationId: roomData.conversationId,
          _id: data._id,
        },
      });
      setAlertMessage("The admin just left the stream");
      setShowAlert(true);
    });
  }, []);

  socket.off("users_peerId").on("users_peerId", async (data) => {
    if (roomData?.creator === user._id) {
      const localStream = streamsData.streams.find(
        (stream) =>
          stream._id === user._id &&
          stream.conversationId === roomData?.conversationId
      );
      peer?.call(data.peerId, localStream?.stream, {
        metadata: {
          _id: user._id,
          image: user.image,
          username: user.username,
        },
      });
    }
  });

  socket.off("new-connection").on("new-connection", async (data) => {
    const streamers = streamsData.streamers.find(
      (stream) => stream.conversationId === roomData?.conversationId
    );

    if (streamers?.myStreamers.includes(user._id)) {
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

  socket.off("user-disconnected").on("user-disconnected", (data) => {
    dispatch({
      type: "REMOVE_STREAM",
      payload: {
        conversationId: data.conversationId,
        _id: data._id,
      },
    });
  });

  useEffect(() => {
    socket.off("block-user").on("block-user", (data) => {
      if (data._id === user._id) {
        setAlertMessage(
          `${firstName}, the admin of this group just blocked you`
        );

        setShowAlert(true);
        setTimeout(() => {
          setAlertMessage("You are about to be sent out");
          setShowAlert(true);
          setTimeout(() => {
            dispatch({
              type: "REMOVE_STREAM",
              payload: {
                _id: user._id,
                conversationId: roomData.conversationId,
              },
            });
            navigate("/profile");
          }, 3000);
        }, 4000);
        socket.emit("block-me", data);
      }
    });
  }, []);

  socket.off("others_peerId").on("others_peerId", (data) => {
    if (data.inviteeId === user._id) {
      const streamData = streamsData.streams.find(
        (stream) =>
          stream.conversationId === roomData.conversationId &&
          stream._id === user._id
      );
      console.log(streamData);
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
    <div className="lg:px-[1.5rem] w-full h-full">
      <div className="pb-[1rem] border-b border-[rgba(255,255,255,0.1)]">
        <h1 className="font-bold text-[1rem] lg:text-[1.5rem]  text-center">
          {roomData?.name}
        </h1>
      </div>
      {showAlert && <Alert text={alertMessage} setShowAlert={setShowAlert} />}

      {streamsData.streams.length > 0 ? (
        <div className="pt-[2rem] video-wrapper gap-[1rem] lg:max-w-[900px] lg:mx-auto ">
          {streamsData?.streams
            ?.filter(
              (stream) => stream.conversationId === roomData.conversationId
            )
            .map((streamData) => (
              <Stream
                key={streamData._id}
                _id={streamData._id}
                stream={streamData?.stream}
                image={streamData.image}
                username={streamData.username}
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
              No one is doing a video stream. The executive president(admin) of
              this room,{" "}
              <span className="font-semibold">{roomData?.creatorName}</span>,
              has not give permissions.
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
      </>
    </div>
  );
}

export default Home;

const Stream = ({ _id, stream, username, image }) => {
  const streamsData = useSelector((state) => state.streams);
  const streamRef = useRef();
  useEffect(() => {
    streamRef.current.srcObject = stream;
  }, []);

  return (
    <div className="video-player">
      <video className="w-[100%]" ref={streamRef} autoPlay controls />
      <div className="flex items-center h-[50px] bg-[#3A3A3A] px-[1rem]">
        <Avatar alt={username} src={image} sx={{ width: 35, height: 35 }}>
          {username?.split("")[0]}
        </Avatar>
        <p className="flex-1 ml-[12px] text-[14px]">{username}</p>
        <BsThreeDots className="text-white" size={20} />
      </div>
    </div>
  );
};
