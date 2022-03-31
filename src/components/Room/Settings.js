import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";
import { BiClipboard } from "react-icons/bi";
import copy from "copy-to-clipboard";
import Alert from "../Alert";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import DeleteRoom from "../DeleteRoom";
import CheckPopup from "../CheckPopup";
import { socket } from "../../socket/socketConnection";

function Settings() {
  const { roomData } = useOutletContext();
  const [showAlert, setShowAlert] = useState(false);
  const [roomName, setRoomName] = useState(roomData?.name);
  const [description, setDescription] = useState(roomData?.description);
  const [showCheckPopup, setShowCheckPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [filled, setFilled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [generateNewId, setGenerateNewId] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const firstName = user.username.includes(" ")
    ? user.username.split(" ")[1]
    : user.username;
  const copyToClipboard = () => {
    copy(`https://www.roombrains.com/rooms/${roomData.meetingId}`);
    setAlertMessage("Link has been copied to clipboard");
    setShowAlert(true);
  };

  const saveChanges = async () => {
    if (roomName.trim().length > 0 && description.trim().length > 0) {
      try {
        setLoading(true);
        const response = await axios.put(
          `${process.env.REACT_APP_API}/room/update/${roomData._id}`,
          {
            roomName,
            description,
            generateNewId,
          },
          {
            headers: {
              authorization: `Bearer ${user.token}`,
            },
          }
        );
        setLoading(false);
        if (response.data.success && response.data.newId) {
          setAlertMessage("Update successfully: Integrating changes...");
          setShowAlert(true);
          setTimeout(() => {
            navigate(`/rooms/${response.data.updatedRoom.meetingId}/settings`);
          }, 3000);
        }
        if (response.data.success && !response.data.newId) {
          setAlertMessage("Your details have been successfully updated");
          setShowAlert(true);
          setRoomName(response.data.updatedRoom.name);
          setDescription(response.data.updatedRoom.description);
          dispatch({ type: "DELETE_ALL_ROOMS", payload: roomData._id });
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setFilled(false);
    }
  };

  const deleteRoom = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/room/${roomData._id}`,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.success) {
        dispatch({ type: "DELETE_ROOM", payload: roomData._id });
        setAlertMessage("Room successfully deleted");
        showAlert(true);
        navigate("/profile");
      }
    } catch (error) {}
  };

  useEffect(() => {
    socket.off("invitation-accepted").on("invitation-accepted", (data) => {
      if (roomData.creator === user._id) {
        setAlertMessage(`${data.username} just accepted your invitation`);
        setShowAlert(true);
      }
    });
  }, []);
  return (
    <div className="h-full">
      {showAlert && <Alert text={alertMessage} setShowAlert={setShowAlert} />}
      {loading && (
        <div
          style={{ transform: "translateX(-50%)" }}
          className="fixed top-[3rem] left-[50%]"
        >
          <Loader />
        </div>
      )}
      {showCheckPopup && (
        <CheckPopup
          setGenerateNewId={setGenerateNewId}
          showCheckPopup={showCheckPopup}
          setShowCheckPopup={setShowCheckPopup}
        />
      )}
      {showDeletePopup && (
        <DeleteRoom
          deleteRoom={deleteRoom}
          setShowDeletePopup={setShowDeletePopup}
        />
      )}

      <div className="pb-[1rem] border-b border-[rgba(255,255,255,0.1)]">
        <h1 className="font-bold text-[1rem] lg:text-[1.5rem]  text-center">
          {roomData?.name}
        </h1>
      </div>

      <div
        className={`pt-[1.5rem] lg:px-[2rem] ${
          !filled && "space-y-[1rem]"
        } space-y-[2rem]`}
      >
        {!filled && (
          <p className="text-red-500 mb-[16x]">All fields must be filled</p>
        )}
        <div className="flex flex-col space-y-[0.5rem]">
          <label className="text-white text-[1rem]">Room Name</label>
          <input
            onFocus={() => setFilled(true)}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="min-h-[50px] px-[1rem] text-white opacity-[0.79] outline-none bg-[#373333]"
            type="text"
            placeholder="Please Enter your Room Name"
          />
        </div>
        <div className="flex flex-col space-y-[0.5rem]">
          <label className="text-white text-[1rem]">Description</label>
          <textarea
            onFocus={() => setFilled(true)}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="min-h-[100px] p-[1rem] text-white opacity-[0.79] outline-none bg-[#373333]"
            type="text"
            placeholder="Give a description to help others understand your room"
          />
        </div>
        <div className="flex flex-col space-y-[0.5rem]">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-[1rem] ">Share meeting link</h1>
            <BiClipboard
              onClick={() => copyToClipboard()}
              className="text-white text-[20px] lg:text-[25px]"
            />
          </div>
          <div className="flex justify-between items-center px-[1rem] lg:px-[2rem] h-[55px] bg-[#373333]">
            <span
              style={{ wordBreak: "break-all" }}
              className="text-white opacity-[0.59] text-[12px] md:text-[1rem]"
            >
              https://www.roombrains.com/rooms/{roomData?.meetingId}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-[0.5rem]">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-[1rem]">
              Generate a new Meeting ID{" "}
            </h1>

            <Checkbox
              checked={generateNewId}
              onChange={() => {
                if (generateNewId === false) {
                  setShowCheckPopup(true);
                  setGenerateNewId(true);
                } else {
                  setGenerateNewId(false);
                }
              }}
              className="transform scale-[1.5]"
            />
          </div>
          <div className="px-[0.7rem] py-[0.3rem] lg:px-[2rem] flex items-center h-[55px] bg-[#373333]">
            <span className="text-white opacity-[0.59] ">
              {roomData?.meetingId}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => saveChanges()}
            className="text-white bg-[#005FEE] h-[50px] w-[90px] border-none"
          >
            Save
          </button>
          <button
            onClick={() => setShowDeletePopup(true)}
            className="text-white bg-red-700 h-[50px] w-[120px] border-none"
          >
            Delete Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
