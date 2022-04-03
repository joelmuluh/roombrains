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
      context.strokeStyle = "black";
      context.lineWidth = "10";
      context.lineTo(coordinates.x, coordinates.y);

      context.stroke();
    } else return;
  };

  const touchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDrawing(true);
    context.beginPath();
  };
  const touchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDrawing(false);
    context.beginPath();
  };
  const touchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (drawing) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    } else return;
  };

  const clearCanvas = () => {
    context.save();

    // Use the identity matrix while clearing the canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    context.restore();
  };

  // context.clearRect(0, 0, canvas.width, canvas.height);
  return (
    <div className="h-full ">
      <button
        onClick={() => clearCanvas()}
        className="text-white w-[100px] h-[40px] bg-red-400"
      >
        Clear page
      </button>
      <div className="pb-[1rem] border-b border-[rgba(255,255,255,0.1)]">
        <h1 className="font-bold text-[1rem] lg:text-[1.5rem]  text-center">
          {roomData.name}
        </h1>
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
