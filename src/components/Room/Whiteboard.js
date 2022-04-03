import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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
  } = useOutletContext();
  const [coordinates, setCoordinates] = useState(null);
  const container = useRef();
  const canvasRef = useRef();
  const canvas = canvasRef.current;
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState("10");
  const [eraserActive, setEraserActive] = useState(false);
  useEffect(() => {
    const canvasApi = document.querySelector(".board");
    canvasApi.height = container.current.clientHeight;
    canvasApi.width = container.current.clientWidth;
    const CanvasContent = canvasApi.getContext("2d");
    const rect = canvasApi.getBoundingClientRect();
    CanvasContent.translate(-rect.x, -rect.y);
    setContext(CanvasContent);
  }, []);

  const mouseDown = () => {
    setDrawing(true);
    context.beginPath();
    setCoordinates(null);
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
      context.lineTo(coordinates.x, coordinates.y);

      context.stroke();
      const canvasData = {
        x: e.clientX,
        y: e.clientY,
      };
      socket.emit("canvasData", {
        conversationId: roomData.conversationId,
        canvasData,
      });
    } else return;
  };

  const touchStart = (e) => {};
  const touchEnd = (e) => {};
  const touchMove = (e) => {};

  const clearCanvas = () => {
    context.save();

    // Use the identity matrix while clearing the canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    context.restore();
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

  socket.off("canvasData").on("canvasData", (data) => {
    setCoordinates({
      x: data.canvasData.x,
      y: data.canvasData.y,
    });

    context.lineTo(data.canvasData.x, data.canvasData.y);
    context.stroke();
    setCoordinates(null);
  });
  return (
    <div className="h-full ">
      <div className="pb-[1rem] border-b border-[rgba(255,255,255,0.1)]">
        <h1 className="font-bold text-[1rem] lg:text-[1.5rem]  text-center">
          {roomData.name}
        </h1>
      </div>
      <div className="flex justify-between ">
        <button
          onClick={() => clearCanvas()}
          className="text-white w-[100px] h-[40px] bg-red-400"
        >
          Clear page
        </button>
        <button
          onClick={() => Eraser()}
          className={`text-white w-[100px] h-[40px] ${
            eraserActive ? "bg-[black]" : "bg-blue-400"
          } transition duration-200 `}
        >
          Eraser
        </button>
      </div>
      <div ref={container} className="h-full w-full overflow-y-auto">
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => mouseDown(e)}
          onMouseUp={(e) => mouseUp(e)}
          onMouseMove={(e) => mouseMove(e)}
          onTouchStart={(e) => touchStart(e)}
          onTouchEnd={(e) => touchEnd(e)}
          onTouchMove={(e) => touchMove(e)}
          className="board bg-white"
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
