import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { templates } from "../utils/code_templates";
import Alert from "./Alert";
import Invitation from "./Invitation";
function Container({ setShowMobileChat, roomData }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const meeting = useSelector((state) => state.meeting);
  const [receivedInvitation, setReceivedInvitation] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [canvasData, setCanvasData] = useState(null);
  const [clearTheCanvas, setClearTheCanvas] = useState(0);
  const [newPath, setNewPath] = useState(0);
  const [language, setLanguage] = useState("c_cpp");
  const [code, setCode] = useState(templates.c);
  const peer = meeting.peer;
  const streamsData = useSelector((state) => state.streams);
  const socket = streamsData.socket;
  const navigate = useNavigate();
  const firstName = user.username?.includes(" ")
    ? user?.username.split(" ")[1]
    : user.username;

  useEffect(() => {
    socket.on("disconnect", () => {
      socket.connect();
    });
    peer.on("call", (call) => {
      call.answer();
      call.on("stream", (remoteStream) => {
        const payload = {
          _id: call.metadata._id,
          image: call.metadata.image,
          username: call.metadata.username,
          stream: remoteStream,
        };
        dispatch({ type: "ADD_STREAM", payload });
        dispatch({
          type: "ADD_STREAMER",
          payload: {
            _id: call.metadata._id,
          },
        });
      });
    });

    socket.off("invitation-from-admin").on("invitation-from-admin", (data) => {
      if (data.userId === user._id) {
        setReceivedInvitation(true);
        setAdminName(data.adminName);
      }
    });

    socket.off("invitation-accepted").on("invitation-accepted", (data) => {
      if (roomData.creator === user._id) {
        setAlertMessage(`${data.username} just accepted your invitation`);
        setShowAlert(true);
      } else {
        setAlertMessage(`${data.username} has been invited on stream`);
        setShowAlert(true);
      }
      socket.emit("peerId_to_invitee", {
        peerId: peer?.id,
        conversationId: roomData.conversationId,
        inviteeId: data._id,
        _id: user._id,
      });
    });
    socket.off("invitation_declined").on("invitation_declined", (data) => {
      if (user._id === roomData.creator) {
        setAlertMessage(
          `Sorry ${firstName}, ${data.username} declined your Invitation`
        );
        setShowAlert(true);
      }
    });

    socket.off("invitee_not_available").on("invitee_not_available", (data) => {
      if (roomData.creator === user._id) {
        setAlertMessage(`${data.username} is not presently in this room`);
        setShowAlert(true);
      }
    });

    socket.off("admin-calling").on("admin-calling", (data) => {
      setAlertMessage(
        `The admin of this room, ${data.username}, just joined the stream`
      );
      setShowAlert(true);
      socket.emit("admin_getting_peerId", {
        conversationId: data.conversationId,
        peerId: peer?.id,
        username: user.username,
      });
    });

    socket.off("admin-stopped-call").on("admin-stopped-call", (data) => {
      dispatch({
        type: "REMOVE_STREAM",
        payload: {
          _id: data._id,
        },
      });
      dispatch({
        type: "REMOVE_STREAMER",
        payload: {
          _id: data._id,
        },
      });
      setAlertMessage("The admin just left the stream");
      setShowAlert(true);
    });

    socket.off("block-user").on("block-user", (data) => {
      if (data._id === user._id) {
        socket.emit("block-me", data);
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
              },
            });
            dispatch({
              type: "REMOVE_STREAMER",
              payload: {
                _id: user._id,
              },
            });
            navigate("/profile");
          }, 3000);
        }, 4000);
      }
    });
  }, []);

  socket
    .off("admin_getting_peerId")
    .on("admin_getting_peerId", async (data) => {
      if (roomData?.creator === user._id) {
        const localStream = streamsData.streams.find(
          (stream) =>
            stream._id === user._id &&
            stream.conversationId === roomData?.conversationId
        );
        const call = peer?.call(data.peerId, localStream?.stream, {
          metadata: {
            _id: user._id,
            image: user.image,
            username: user.username,
          },
        });
        dispatch({
          type: "ADD_CALL_HANDLER",
          payload: {
            _id: data._id,
            call,
          },
        });
      }
    });

  socket.off("peerId_to_invitee").on("peerId_to_invitee", async (data) => {
    if (data.inviteeId === user._id) {
      const localstream = streamsData.streams.find(
        (stream) => stream._id === user._id
      );

      dispatch({
        type: "ADD_STREAM",
        payload: {
          _id: user._id,
          username: user.username,
          image: user.image,
          stream: localstream.stream,
        },
      });

      dispatch({
        type: "ADD_STREAMER",
        payload: {
          _id: user._id,
        },
      });

      const call = peer.call(data.peerId, localstream.stream, {
        metadata: {
          _id: user._id,
          image: user.image,
          username: user.username,
        },
      });

      dispatch({
        type: "ADD_CALL_HANDLER",
        payload: {
          _id: data._id,
          call,
        },
      });
    }
  });

  socket.off("user_left_stream").on("user_left_stream", (data) => {
    dispatch({
      type: "REMOVE_STREAM",
      payload: {
        _id: data._id,
      },
    });
    dispatch({
      type: "REMOVE_STREAMER",
      payload: {
        _id: data._id,
      },
    });
    setAlertMessage(`${data.username} just left the stream`);
    setShowAlert(true);
  });
  socket.off("remove_user_by_admin").on("remove_user_by_admin", (data) => {
    dispatch({
      type: "REMOVE_STREAM",
      payload: {
        _id: data._id,
      },
    });
    dispatch({
      type: "REMOVE_STREAMER",
      payload: {
        _id: data._id,
      },
    });
    if (data._id === user._id) {
      setAlertMessage(`${data.username}, the Admin just removed you`);
      setShowAlert(true);
    } else {
      setAlertMessage(`The admin just removed ${data.username}`);
      setShowAlert(true);
    }
  });

  socket.off("mute_user_by_admin").on("mute_user_by_admin", (data) => {
    dispatch({
      type: "MUTE_USER",
      payload: {
        _id: data._id,
      },
    });

    if (data._id === user._id) {
      setAlertMessage("The admin just muted you.");
      setShowAlert(true);
    }
  });
  socket.off("unmute_user_by_admin").on("unmute_user_by_admin", (data) => {
    if (data._id === user._id) {
      dispatch({
        type: "UNMUTE_USER",
        payload: {
          _id: data._id,
        },
      });
    }
    if (data._id === user._id) {
      setAlertMessage("You have been unmuted.");
      setShowAlert(true);
    }
  });

  useEffect(() => {
    socket.off("canvasData").on("canvasData", (data) => {
      if (data.canvasData) {
        setCanvasData(data);
      }
    });

    socket.off("clear-canvas").on("clear-canvas", () => {
      setClearTheCanvas((prev) => prev + 1);
    });

    socket.off("begin-new-mouse-path").on("begin-new-mouse-path", (data) => {
      setNewPath((prev) => prev + 1);
    });

    socket
      .off("give_access_to_whiteboard")
      .on("give_access_to_whiteboard", (data) => {
        if (data.userId === user._id) {
          const myWhiteboardAccess = JSON.parse(
            window.localStorage.getItem("myWhiteboardAccess")
          );
          if (myWhiteboardAccess) {
            if (!myWhiteboardAccess.includes(data.conversationId)) {
              setAlertMessage(
                "The Admin has given you permission to share the whiteboard data with everyone."
              );
              setShowAlert(true);
              window.localStorage.setItem(
                "myWhiteboardAccess",
                JSON.stringify([...myWhiteboardAccess, data.conversationId])
              );
            }
          } else {
            window.localStorage.setItem(
              "myWhiteboardAccess",
              JSON.stringify([data.conversationId])
            );
          }
        }
      });
    socket.off("give_access_to_editor").on("give_access_to_editor", (data) => {
      if (data.userId === user._id) {
        const myEditorAccess = JSON.parse(
          window.localStorage.getItem("myEditorAccess")
        );
        if (myEditorAccess) {
          if (!myEditorAccess.includes(data.conversationId)) {
            setAlertMessage(
              "The Admin has given you permission to share your code with everyone."
            );
            setShowAlert(true);
            window.localStorage.setItem(
              "myEditorAccess",
              JSON.stringify([...myEditorAccess, data.conversationId])
            );
          }
        } else {
          window.localStorage.setItem(
            "myEditorAccess",
            JSON.stringify([data.conversationId])
          );
        }
      }
    });

    socket
      .off("restrict_access_to_editor")
      .on("restrict_access_to_editor", (data) => {
        if (data.userId === user._id) {
          const myEditorAccess = JSON.parse(
            window.localStorage.getItem("myEditorAccess")
          );
          if (myEditorAccess) {
            if (myEditorAccess.includes(data.conversationId)) {
              setAlertMessage(
                "The Admin just restricted you from sharing your code."
              );
              setShowAlert(true);
              const newEditorAccess = myEditorAccess.filter(
                (theConversationId) => theConversationId !== data.conversationId
              );
              window.localStorage.setItem(
                "myEditorAccess",
                JSON.stringify(newEditorAccess)
              );
            }
          }
        }
      });
    socket
      .off("restrict_access_to_whiteboard")
      .on("restrict_access_to_whiteboard", (data) => {
        if (data.userId === user._id) {
          const myWhiteboardAccess = JSON.parse(
            window.localStorage.getItem("myWhiteboardAccess")
          );

          if (myWhiteboardAccess) {
            if (myWhiteboardAccess.includes(data.conversationId)) {
              setAlertMessage(
                "The Admin just restricted you from sharing the whiteboard."
              );
              setShowAlert(true);
              const newWhiteboardAccess = myWhiteboardAccess.filter(
                (theConversationId) => theConversationId !== data.conversationId
              );

              window.localStorage.setItem(
                "myWhiteboardAccess",
                JSON.stringify(newWhiteboardAccess)
              );
            }
          }
        }
      });

    socket.off("code_from_editor").on("code_from_editor", (data) => {
      setCode(data.code);
    });
    socket
      .off("change_programming_language")
      .on("change_programming_language", (data) => {
        setLanguage(data.language);
      });
  }, []);

  socket.off("user-disconnected").on("user-disconnected", (data) => {
    const streamers = streamsData.streamers;
    if (streamers.includes(data._id)) {
      setAlertMessage(`${data.username} just disconnected`);
      setShowAlert(true);
      dispatch({
        type: "REMOVE_STREAM",
        payload: {
          _id: data._id,
        },
      });
      dispatch({
        type: "REMOVE_STREAMER",
        payload: {
          _id: data._id,
        },
      });
    }
    if (streamers.includes(user._id)) {
      dispatch({
        type: "REMOVE_CALL_HANDLER",
        payload: {
          _id: data._id,
        },
      });
    }
  });

  socket.off("new-connection").on("new-connection", async (data) => {
    const streamers = streamsData.streamers;
    if (streamers.includes(user._id)) {
      const screenStream = streamsData.screenStream;
      const streamData = streamsData.streams.find(
        (stream) => stream._id === user._id
      );
      const myStream = screenStream.screening
        ? screenStream.stream
        : streamData.stream;

      const call = peer.call(data.peerId, myStream, {
        metadata: {
          _id: user._id,
          image: user.image,
          username: user.username,
        },
      });

      dispatch({
        type: "ADD_CALL_HANDLER",
        payload: {
          _id: data._id,
          call,
        },
      });
    }
  });

  return (
    <>
      <Outlet
        context={{
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
          Alert,
          Invitation,
          canvasData,
          newPath,
          clearTheCanvas,
          code,
          setCode,
          language,
          setLanguage,
        }}
      />
    </>
  );
}

export default Container;
