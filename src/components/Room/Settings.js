import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";
import { BiClipboard } from "react-icons/bi";
import copy from "copy-to-clipboard";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Loader from "../Loader";
import DeleteRoom from "../DeleteRoom";
import CheckPopup from "../CheckPopup";
import ShowBlockedUsers from "../ShowBlockedUsers";
import { useSelector } from "react-redux";
function Settings() {
  const {
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
  const [roomName, setRoomName] = useState(roomData?.name);
  const [showCheckPopup, setShowCheckPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [filled, setFilled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generateNewId, setGenerateNewId] = useState(false);
  const [description, setDescription] = useState(roomData?.description);
  const [selectedOption, setSelectedOption] = useState("More functions");
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);
  const blockedUsers = useSelector((state) => state.myRooms.blockedUsers);
  const blocked_users_id = useSelector(
    (state) => state.myRooms.blocked_users_id
  );

  const copyLinkToClipboard = () => {
    copy(`${window.location.origin}/rooms/${roomData.meetingId}`);
    setAlertMessage("Link has been copied to clipboard");
    setShowAlert(true);
  };
  const copyIdToClipboard = () => {
    copy(roomData.meetingId);
    setAlertMessage("Meeting Id has been copied to clipboard");
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

  const changeOption = (e) => {
    setSelectedOption(e.target.value);
    switch (e.target.value) {
      case "blocked_users":
        setShowBlockedPopup(true);
        break;
      default:
        return "";
    }
  };

  const getUser = async (userId) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/users/find/${userId}`,
      {
        headers: {
          authorization: `Bearer ${user?.token}`,
        },
      }
    );
    return data;
  };
  const dispatchBlockedUsers = async () => {
    if (blocked_users_id.length !== 0) {
      if (blockedUsers.length === 0) {
        const userDetails = await Promise.all(
          blocked_users_id.map(async (userId) => {
            return getUser(userId);
          })
        );
        const usersForDispatch = userDetails.map((user) => {
          return { conversationId: roomData.conversationId, ...user };
        });
        dispatch({ type: "FILL_BLOCK", payload: usersForDispatch });
      }
    }
  };
  useEffect(() => {
    dispatchBlockedUsers();
  }, []);

  return (
    <div className="h-full px-[1rem] pb-[4rem]">
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
      {showBlockedPopup && (
        <ShowBlockedUsers
          showPopup={setShowBlockedPopup}
          setSelectedOption={setSelectedOption}
          user={user}
          roomData={roomData}
        />
      )}

      <div className="pb-[1rem] px-[1rem] border-b border-[rgba(255,255,255,0.1)]">
        <h1 className="font-bold text-[1rem] lg:text-[1.5rem] text-center">
          {roomData?.name}
        </h1>
      </div>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={"actions"}
        onChange={(e) => changeOption(e)}
        variant="outlined"
        className="my-[7px] text-left w-[70%] md:w-[150px] h-[35px] md:w-[100px] bg-white my-[1rem] lg:ml-[2rem]"
      >
        <MenuItem value={"actions"}>Actions</MenuItem>
        <MenuItem value={"blocked_users"}>Blocked users</MenuItem>
      </Select>
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
              onClick={() => copyLinkToClipboard()}
              className="text-white text-[20px] lg:text-[25px]"
            />
          </div>
          <div className="flex justify-between items-center px-[1rem] lg:px-[2rem] h-[55px] bg-[#373333]">
            <span
              style={{ wordBreak: "break-all" }}
              className="text-white opacity-[0.59] text-[12px] md:text-[1rem]"
            >
              {window.location.origin}/rooms/{roomData.meetingId}
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
          <div className="flex justify-end mt-[10px]">
            <BiClipboard
              onClick={() => copyIdToClipboard()}
              className="text-white text-[20px] lg:text-[25px]"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => saveChanges()}
            className="text-white bg-[#005FEE] h-[35px] md:h-[50px] w-[90px] border-none text-[14px] lg:text-[16px]"
          >
            Save
          </button>
          <button
            onClick={() => setShowDeletePopup(true)}
            className="text-white bg-red-700 h-[35px] md:h-[50px] w-[100px] text-[14px] lg:text-[16px] lg:w-[120px] border-none"
          >
            Delete Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
