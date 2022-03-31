import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import Alert from "./Alert";
import Loader from "./Loader";
function CreateNewRoom() {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [filled, setFilled] = useState(true);
  const [showVisit, setShowVisit] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myRooms = useSelector((state) => state.myRooms);
  const user = useSelector((state) => state.user);
  const [roomData, setRoomData] = useState("");
  const firstName = user.username.includes(" ")
    ? user.username.split(" ")[0]
    : user.username;
  const createRoom = async () => {
    if (roomName.trim().length > 0 && description.trim().length > 0) {
      try {
        setLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_API}/room/create`,
          {
            name: roomName,
            description,
          },
          {
            headers: {
              authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = response.data;
        setLoading(false);
        if (data.exists) {
          setExists(true);
        } else {
          setShowAlert(true);
          setRoomData(data);
          setExists(false);
          setShowVisit(true);
          dispatch({ type: "ADD_ROOM", payload: data });
          setRoomName("");
          setDescription("");
        }
      } catch (error) {
        console.log(error);
        setRoomName("");
        setDescription("");
      }
    } else {
      setFilled(false);
    }
  };

  const getIn = () => {
    navigate(`/rooms/${roomData.meetingId}`);
  };
  return (
    <div className="h-full overflow-y-auto px-[1rem] lg:px-[1.5rem] mt-[1rem]">
      {loading && (
        <div
          style={{ transform: "translateX(-50%)" }}
          className="fixed top-[3rem] left-[50%]"
        >
          <Loader />
        </div>
      )}
      <div>
        {showAlert && (
          <Alert text="Room successfully Created" setShowAlert={setShowAlert} />
        )}
        {exists && (
          <p className="text-red-500 mb-[10px] text-[12px] lg:text-[14px]">
            {firstName}, you created a room with this name already. Please use
            another name.
          </p>
        )}
        {!filled && (
          <p className="text-red-500 mb-[10px] text-[12px] lg:text-[14px]">
            All fields must be filled
          </p>
        )}

        <label className="font-semibold">Room Name</label>
        <input
          spellCheck={false}
          onFocus={() => {
            setExists(false);
            setFilled(true);
          }}
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
            setShowVisit(false);
          }}
          type="text"
          className="block h-[50px] w-full outline-none px-[1rem] mt-[10px] border-[1px] border-[rgba(0,0,0,0.3)]"
        />
      </div>
      <div className="mt-[1.5rem]">
        <label className="font-semibold">Room Description</label>
        <textarea
          onFocus={() => {
            setFilled(true);
          }}
          spellCheck={false}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setShowVisit(false);
          }}
          type="text"
          className="block resize-none h-[100px] w-full outline-none p-[1rem] mt-[10px] border-[1px] border-[rgba(0,0,0,0.3)]"
        />
      </div>
      <div className="flex justify-between items-center mt-[2rem]">
        <button
          onClick={() => createRoom()}
          className="bg-[#1492E6] hover:opacity-[0.7]  text-white h-[45px] px-[2rem] "
        >
          Create
        </button>
        {showVisit && (
          <button
            onClick={() => getIn()}
            className="bg-transparent text-[#1492E6] text-[1rem] font-semibold"
          >
            GET IN
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateNewRoom;
