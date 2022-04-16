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
    <div className="lg:px-[2.5rem] w-[90%] sm:w-[75%] md:w-[80%] mx-auto h-full pb-[3rem]">
      <div className="pb-[1rem] px-[1rem] border-b border-[rgba(255,255,255,0.1)] text-center text-[13px] lg:text-[16px]">
        <h1 className="font-[600]">{roomData?.name}</h1>
      </div>
      <div className="flex flex-col-reverse gap-[1rem] text-center md:text-left md:space-y-0 md:flex-row items-center justify-between pt-[3rem] mb-[4rem]">
        <div>
          <h1 className="font-[500] mb-[0.3rem] text-[1.3rem]">
            {roomData.creatorName}
          </h1>
          <p className="opacity-[0.8]">Creator and Admin</p>
        </div>
        <div className="w-[80px] h-[80px] lg:w-[120px] lg:h-[120px]">
          <Avatar
            alt={roomData.creatorName}
            src={roomData.creatorImage}
            sx={{ width: "100%", height: "100%" }}
          >
            {roomData.creatorName?.split("")[0]}
          </Avatar>
        </div>
      </div>
      <div className="space-y-[1rem] md:space-y-[3rem]">
        <div>
          <h1 className="font-[500] mb-[0.2rem] text-[1rem] lg:text-[1.3rem]">
            Room Name
          </h1>
          <p className="opacity-[0.8] text-[12px] md:text-[14px]">
            {roomData.name}
          </p>
        </div>
        <div className="mt-[1rem] pb-[3rem]">
          <h1 className="font-[500] mb-[0.2rem] text-[1rem] lg:text-[1.3rem]">
            Description
          </h1>
          <p className="opacity-[0.8] text-[12px] md:text-[14px]">
            {roomData.description}
          </p>
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
