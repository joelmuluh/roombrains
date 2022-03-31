import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { socket } from "../../socket/socketConnection";
import Alert from "../Alert";
import Invitation from "../Invitation";

function About() {
  const { roomData } = useOutletContext();
  const [receivedInvitation, setReceivedInvitation] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const user = useSelector((state) => state.user);

  useEffect(() => {
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
        console.log("el");
      }
    });
  }, []);
  return (
    <div>
      About
      <>
        {receivedInvitation && (
          <Invitation
            conversationId={roomData.conversationId}
            adminName={adminName}
            setReceivedInvitation={setReceivedInvitation}
            receivedInvitation={receivedInvitation}
          />
        )}
        {showAlert && <Alert text={alertMessage} setShowAlert={setShowAlert} />}
      </>
    </div>
  );
}

export default About;
