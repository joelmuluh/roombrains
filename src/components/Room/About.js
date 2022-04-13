import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { useOutletContext } from "react-router-dom";
function About() {
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
    <div className="lg:px-[2.5rem] w-[90%] sm:w-[75%] md:w-[80%] mx-auto h-full">
      <div className="pb-[1rem] border-b border-[rgba(255,255,255,0.1)]">
        <h1 className="font-bold text-[1rem] lg:text-[1.5rem]  text-center">
          {roomData?.name}
        </h1>
      </div>
      <div className="flex flex-col-reverse gap-[1rem] text-center md:text-left md:space-y-0 md:flex-row items-center justify-between pt-[3rem] mb-[4rem]">
        <div>
          <h1 className="font-bold mb-[0.3rem] text-[1.3rem]">
            {roomData.creatorName}
          </h1>
          <p>Creator and Admin</p>
        </div>
        <Avatar
          alt={roomData.creatorName}
          src={roomData.creatorImage}
          sx={{ width: 180, height: 180 }}
        >
          {roomData.creatorName?.split("")[0]}
        </Avatar>
      </div>
      <div className="space-y-[1rem] md:space-y-[3rem]">
        <div>
          <h1 className="font-semibold mb-[0.2rem] text-[1.3rem]">Room Name</h1>
          <p>{roomData.name}</p>
        </div>
        <div className="mt-[1rem]">
          <h1 className="font-semibold mb-[0.2rem] text-[1.3rem]">
            Description
          </h1>
          <p className="text-[14px] md:text-[16px]">{roomData.description}</p>
        </div>
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

export default About;
