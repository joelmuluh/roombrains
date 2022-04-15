import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { VscChromeClose } from "react-icons/vsc";
import { IoIosVideocam } from "react-icons/io";
import { ImBlocked } from "react-icons/im";
import { HiCode } from "react-icons/hi";
import { VscEditorLayout } from "react-icons/vsc";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

function ChatPopup({
  username,
  image,
  conversationId,
  _id,
  roomData,
  setShowAlert,
  setAlertMessage,
  setShowMobileChat,
  setShowPopup,
  setBlocked,
}) {
  const user = useSelector((state) => state.user);
  const streamsData = useSelector((state) => state.streams);
  const socket = useSelector((state) => state.streams.socket);
  const [hasEditorAccess, setHasEditorAccess] = useState(false);
  const [hasWhiteboardAccess, setHasWhiteboardAccess] = useState(false);
  const dispatch = useDispatch();

  const blockMember = async () => {
    setBlocked(true);
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
        setShowPopup(false);
        setAlertMessage(`You had already blocked ${username}`);
        setShowAlert(true);
      } else {
        dispatch({
          type: "BLOCK_USER",
          payload: {
            conversationId: roomData.conversationId,
            _id,
            image,
            username,
          },
        });
        setShowPopup(false);
        setAlertMessage(`${username} has been blocked`);
        setShowAlert(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendInvitation = () => {
    setShowPopup(false);
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
        username,
        adminName: roomData.creatorName,
      });
      if (setShowMobileChat) {
        setTimeout(() => {
          setShowMobileChat(false);
        }, 2000);
      }
    }
  };

  const EditorAccess = () => {
    if (hasEditorAccess) {
      const editorAccess = JSON.parse(
        window.localStorage.getItem("editorAccess")
      );
      if (editorAccess) {
        const myAccesses = editorAccess.find(
          (access) => access.conversationId === conversationId
        );
        if (myAccesses) {
          const newPermissions = myAccesses.permissions.filter(
            (user) => user !== _id
          );
          const permissions = { conversationId, permissions: newPermissions };
          const newData = editorAccess.filter(
            (access) => access.conversationId !== conversationId
          );
          const fullEdit = [...newData, permissions];
          window.localStorage.setItem("editorAccess", JSON.stringify(fullEdit));
          setShowAlert(true);
          setAlertMessage(`${username} has been denied access to the Editor`);
          socket.emit("restrict_access_to_editor", {
            conversationId,
            userId: _id,
            adminName: roomData.creatorName,
          });
        }
      }
    } else {
      const editorAccess = JSON.parse(
        window.localStorage.getItem("editorAccess")
      );
      if (editorAccess) {
        const myAccesses = editorAccess.find(
          (access) => access.conversationId === conversationId
        );
        if (myAccesses) {
          const permissions = {
            conversationId,
            permissions: [...myAccesses.permissions, _id],
          };
          const newData = editorAccess.filter(
            (access) => access.conversationId !== conversationId
          );
          const fullEdit = [...newData, permissions];
          window.localStorage.setItem("editorAccess", JSON.stringify(fullEdit));
          setShowAlert(true);
          setAlertMessage(`${username} now has access to the Editor`);
          socket.emit("give_access_to_editor", {
            conversationId,
            userId: _id,
            adminName: roomData.creatorName,
          });
        } else {
          window.localStorage.setItem(
            "editorAccess",
            JSON.stringify([
              ...editorAccess,
              { conversationId, permissions: [_id] },
            ])
          );
          setShowAlert(true);
          setAlertMessage(`${username} now has access to the Editor`);
          socket.emit("give_access_to_editor", {
            conversationId,
            userId: _id,
            adminName: roomData.creatorName,
          });
        }
      } else {
        window.localStorage.setItem(
          "editorAccess",
          JSON.stringify([{ conversationId, permissions: [_id] }])
        );
        setShowAlert(true);
        setAlertMessage(`${username} now has access to the Editor`);
        socket.emit("give_access_to_editor", {
          conversationId,
          userId: _id,
          adminName: roomData.creatorName,
        });
      }
    }
  };
  const WhiteboardAccess = () => {
    if (hasWhiteboardAccess) {
      const whiteboardAccess = JSON.parse(
        window.localStorage.getItem("whiteboardAccess")
      );
      if (whiteboardAccess) {
        const myAccesses = whiteboardAccess.find(
          (access) => access.conversationId === conversationId
        );
        if (myAccesses) {
          const newPermissions = myAccesses.permissions.filter(
            (user) => user !== _id
          );
          const permissions = { conversationId, permissions: newPermissions };
          const newData = whiteboardAccess.filter(
            (access) => access.conversationId !== conversationId
          );
          const fullEdit = [...newData, permissions];
          window.localStorage.setItem(
            "whiteboardAccess",
            JSON.stringify(fullEdit)
          );
          setShowAlert(true);
          setAlertMessage(`${username} has been denied access to whiteboard`);
          socket.emit("restrict_access_to_whiteboard", {
            conversationId,
            userId: _id,
            adminName: roomData.creatorName,
          });
        }
      }
    } else {
      const whiteboardAccess = JSON.parse(
        window.localStorage.getItem("whiteboardAccess")
      );
      if (whiteboardAccess) {
        const myAccesses = whiteboardAccess.find(
          (access) => access.conversationId === conversationId
        );
        if (myAccesses) {
          const permissions = {
            conversationId,
            permissions: [...myAccesses.permissions, _id],
          };
          const newData = whiteboardAccess.filter(
            (access) => access.conversationId !== conversationId
          );
          const fullEdit = [...newData, permissions];
          window.localStorage.setItem(
            "whiteboardAccess",
            JSON.stringify(fullEdit)
          );
          setShowAlert(true);
          setAlertMessage(`${username} now has access to the whiteboard`);
          socket.emit("give_access_to_whiteboard", {
            conversationId,
            userId: _id,
            adminName: roomData.creatorName,
          });
        } else {
          window.localStorage.setItem(
            "whiteboardAccess",
            JSON.stringify([
              ...whiteboardAccess,
              { conversationId, permissions: [_id] },
            ])
          );
          setShowAlert(true);
          setAlertMessage(`${username} now has access to the whiteboard`);
          socket.emit("give_access_to_whiteboard", {
            conversationId,
            userId: _id,
            adminName: roomData.creatorName,
          });
        }
      } else {
        window.localStorage.setItem(
          "whiteboardAccess",
          JSON.stringify([{ conversationId, permissions: [_id] }])
        );
        setShowAlert(true);
        setAlertMessage(`${username} now has access to the whiteboard`);
        socket.emit("give_access_to_whiteboard", {
          conversationId,
          userId: _id,
          adminName: roomData.creatorName,
        });
      }
    }
  };

  useEffect(() => {
    const editorAccess = JSON.parse(
      window.localStorage.getItem("editorAccess")
    );
    const whiteboardAccess = JSON.parse(
      window.localStorage.getItem("whiteboardAccess")
    );
    if (editorAccess) {
      const myAccesses = editorAccess.find(
        (access) => access.conversationId === conversationId
      );
      if (myAccesses) {
        if (myAccesses.permissions.includes(_id)) {
          setHasEditorAccess(true);
        }
      }
    }
    if (whiteboardAccess) {
      const myAccesses = whiteboardAccess.find(
        (access) => access.conversationId === conversationId
      );
      if (myAccesses) {
        if (myAccesses.permissions.includes(_id)) {
          setHasWhiteboardAccess(true);
        }
      }
    }
  }, []);

  return (
    <div
      onClick={() => setShowPopup(false)}
      className="scale-in fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]  py-[1rem] z-[600] flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="px-[1rem] mobile-max-width w-[450px] py-[2rem] bg-white text-black"
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
            <IoIosVideocam className="text-[16px] lg:text-[25px]" />
            <p className="text-[12px] md:text-[16px] cursor-pointer">
              Invite to Video Stream
            </p>
          </div>
          <div
            onClick={() => {
              WhiteboardAccess();
              setShowPopup(false);
            }}
            className="p-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex items-center space-x-[1rem] hover:bg-gray-300 transition duration-200 cursor-pointer"
          >
            <VscEditorLayout className="text-[16px] lg:text-[25px]" />
            <p className="text-[12px] md:text-[16px] cursor-pointer">
              {hasWhiteboardAccess
                ? "Restrict from Whiteboard"
                : "Grant access to Whiteboard"}
            </p>
          </div>
          <div
            onClick={() => {
              EditorAccess();
              setShowPopup(false);
            }}
            className="p-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex items-center space-x-[1rem] hover:bg-gray-300 transition duration-200 cursor-pointer"
          >
            <HiCode className="text-[16px] lg:text-[25px]" />
            <p className="text-[12px] md:text-[16px] cursor-pointer">
              {hasEditorAccess
                ? "Restrict from Editor"
                : "Grant access to Editor"}
            </p>
          </div>
          <div
            onClick={() => {
              setShowPopup(false);
              blockMember();
            }}
            className="p-[1rem] py-[0.6rem] lg:py-[0.8rem] bg-gray-200 rounded-[6px] flex items-center space-x-[1rem] hover:bg-gray-300 transition duration-200 cursor-pointer"
          >
            <ImBlocked className="text-[16px] lg:text-[25px] text-red-500" />
            <p className="text-[12px] md:text-[16px] cursor-pointer">Block</p>
          </div>
        </div>
      </div>
      <VscChromeClose
        onClick={() => setShowPopup(false)}
        className="absolute top-[2rem] right-[4rem] text-white text-[30px] font-bold"
      />
    </div>
  );
}

export default ChatPopup;
