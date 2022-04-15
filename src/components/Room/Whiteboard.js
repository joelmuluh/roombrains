import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useOutletContext } from "react-router-dom";
function WhiteBoard() {
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
    canvasData,
    newPath,
    clearTheCanvas,
  } = useOutletContext();
  const [coordinates, setCoordinates] = useState(null);
  const container = useRef();
  const canvasRef = useRef();
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState("10");
  const [eraserActive, setEraserActive] = useState(false);
  useEffect(() => {
    canvasRef.current.height = container.current.clientHeight;
    canvasRef.current.width = container.current.clientWidth;
    const CanvasContent = canvasRef.current.getContext("2d");
    const rect = container.current.getBoundingClientRect();
    CanvasContent.translate(-rect.x, -rect.y);
    setContext(CanvasContent);
  }, []);
  window.addEventListener("resize", () => {
    canvasRef.current.height = container.current?.clientHeight;
    canvasRef.current.width = container.current?.clientWidth;
    const rect = container?.current?.getBoundingClientRect();
    context?.translate(-rect.x, -rect.y);
  });
  const mouseDown = () => {
    setDrawing(true);
    context.beginPath();
    setCoordinates(null);
    const myWhiteboardAccess = JSON.parse(
      window.localStorage.getItem("myWhiteboardAccess")
    );
    if (myWhiteboardAccess || roomData.creator === user._id) {
      if (
        myWhiteboardAccess?.includes(roomData.conversationId) ||
        roomData.creator === user._id
      ) {
        socket.emit("begin-new-mouse-path", {
          conversationId: roomData.conversationId,
          lineWidth,
          color,
        });
      }
    }
  };
  const mouseUp = () => {
    setDrawing(false);
    context.beginPath();
  };
  const mouseMove = (e) => {
    if (drawing) {
      setCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineTo(coordinates?.x, coordinates?.y);

      context.stroke();

      const xValue =
        ((e.clientX - container.current.getBoundingClientRect().x) /
          container.current.clientWidth) *
        100;

      const yValue =
        ((e.clientY - container.current.getBoundingClientRect().y) /
          container.current.clientHeight) *
        100;
      const canvasData = {
        x: xValue,
        y: yValue,
      };

      const myWhiteboardAccess = JSON.parse(
        window.localStorage.getItem("myWhiteboardAccess")
      );
      if (myWhiteboardAccess || roomData.creator === user._id) {
        if (
          myWhiteboardAccess?.includes(roomData.conversationId) ||
          roomData.creator === user._id
        ) {
          socket.emit("canvasData", {
            conversationId: roomData.conversationId,
            canvasData,
            lineWidth,
            color,
          });
        }
      }
    } else return;
  };

  const touchStart = (e) => {
    setDrawing(true);
    context.beginPath();
    setCoordinates(null);

    const myWhiteboardAccess = JSON.parse(
      window.localStorage.getItem("myWhiteboardAccess")
    );
    if (myWhiteboardAccess || roomData.creator === user._id) {
      if (
        myWhiteboardAccess?.includes(roomData.conversationId) ||
        roomData.creator === user._id
      ) {
        socket.emit("begin-new-mouse-path", {
          conversationId: roomData.conversationId,
          lineWidth,
          color,
        });
      }
    }
  };
  const touchEnd = (e) => {
    setDrawing(false);
    context.beginPath();
  };
  const touchMove = (e) => {
    if (drawing) {
      setCoordinates({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineTo(coordinates?.x, coordinates?.y);

      context.stroke();
      const xValue =
        ((e.touches[0].clientX - container.current.getBoundingClientRect().x) /
          container.current.clientWidth) *
        100;
      const yValue =
        ((e.touches[0].clientY - container.current.getBoundingClientRect().y) /
          container.current.clientHeight) *
        100;
      const canvasData = {
        x: xValue,
        y: yValue,
      };
      const myWhiteboardAccess = JSON.parse(
        window.localStorage.getItem("myWhiteboardAccess")
      );
      if (myWhiteboardAccess || roomData.creator === user._id) {
        if (
          myWhiteboardAccess?.includes(roomData.conversationId) ||
          roomData.creator === user._id
        ) {
          socket.emit("canvasData", {
            conversationId: roomData.conversationId,
            canvasData,
            lineWidth,
            color,
          });
        }
      }
    } else return;
  };

  const clear = () => {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.restore();
  };

  const clearCanvas = () => {
    clear();

    const myWhiteboardAccess = JSON.parse(
      window.localStorage.getItem("myWhiteboardAccess")
    );
    if (myWhiteboardAccess || roomData.creator === user._id) {
      if (
        myWhiteboardAccess?.includes(roomData.conversationId) ||
        roomData.creator === user._id
      ) {
        socket.emit("clear-canvas", {
          conversationId: roomData.conversationId,
        });
      }
    }
  };

  const Eraser = () => {
    setEraserActive(!eraserActive);
    if (eraserActive) {
      setColor("black");
      setLineWidth("10");
    } else {
      setColor("white");
      setLineWidth("50");
    }
  };

  useEffect(() => {
    if (canvasData) {
      if (context) {
        context.strokeStyle = canvasData.color;
        context.lineWidth = canvasData.lineWidth;
        const xValue =
          (canvasData.canvasData?.x * container.current.clientWidth) / 100;
        const yValue =
          (canvasData.canvasData?.y * container.current.clientHeight) / 100;
        setCoordinates({
          x: xValue + container.current.getBoundingClientRect().x,
          y: yValue + container.current.getBoundingClientRect().y,
        });

        context.lineTo(
          xValue + container.current.getBoundingClientRect().x,
          yValue + container.current.getBoundingClientRect().y
        );
        context.stroke();
      }
    }
  }, [canvasData]);
  useEffect(() => {
    if (clearTheCanvas !== 0) {
      if (context) {
        clear();
      }
    }
  }, [clearTheCanvas]);
  useEffect(() => {
    if (newPath !== 0) {
      if (context) {
        context.beginPath();
      }
    }
  }, [newPath]);
  return (
    <div className="h-full overflow-y-auto pt-[1rem]">
      <div className="sticky top-0 x-0 w-full bg-[#1F1F1F] px-[1rem]">
        {streamsData.streams.length > 0 && (
          <div className="py-[0.8rem] small-video-wrapper gap-[1rem] ">
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
                  conversationId={roomData.conversationId}
                  streamsData={streamsData}
                />
              ))}
          </div>
        )}
        <div className="flex justify-between text-[13px] lg:text-[15px]">
          <button
            onClick={() => clearCanvas()}
            className="text-white w-[90px] h-[30px] lg:w-[100px] lg:h-[40px] bg-red-400"
          >
            Clear page
          </button>
          <button
            onClick={() => Eraser()}
            className={`text-white w-[90px] h-[30px] lg:w-[100px] lg:h-[40px] ${
              eraserActive ? "bg-[red]" : "bg-blue-600"
            } transition duration-200 `}
          >
            Eraser
          </button>
        </div>
      </div>
      <div ref={container} className="h-full w-full">
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => mouseDown(e)}
          onMouseUp={(e) => mouseUp(e)}
          onMouseMove={(e) => mouseMove(e)}
          onTouchStart={(e) => touchStart(e)}
          onTouchEnd={(e) => touchEnd(e)}
          onTouchMove={(e) => touchMove(e)}
          className="canvas-board bg-white overflow-y-hidden"
        ></canvas>
      </div>

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

export default WhiteBoard;

const Stream = ({ stream }) => {
  const streamRef = useRef();
  useEffect(() => {
    if (streamRef) {
      streamRef.current.srcObject = stream;
      streamRef.current.play();
    }
  }, []);
  return <video className="w-[60px] md:w-[100px]" ref={streamRef} autoPlay />;
};
