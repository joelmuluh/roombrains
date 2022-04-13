import axios from "axios";
import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
function JoinRoom({ setShowJoinRoom }) {
  const [exists, setExists] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [filled, setFilled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState("");
  const user = useSelector((state) => state.user);
  const { username } = user;
  const firstName = username.includes(" ") ? username.split(" ")[0] : username;
  const navigate = useNavigate();
  const join = () => {
    if (meetingId.trim().length > 0) {
      navigate(`/rooms/${meetingId}`);
    } else {
      setFilled(false);
    }
  };
  const verify = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/room/${meetingId}`,
        {
          headers: {
            authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setLoading(false);

      if (response.data.exists) {
        setRoomData(response.data.roomData);
        setExists(true);
        setModalOpen(true);
      } else {
        console.log(response.data);
        setExists(false);
        setModalOpen(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  return (
    <div className="fixed z-[10] top-0 bottom-0 left-0 right-0 bg-[#1F1F1F] scale-in text-black flex items-center lg:block">
      <div className=" mt-[1.5rem] lg:mt-[2.5rem] max-w-[800px] w-[80%] mx-auto lg:mt-[4rem">
        <div className="flex lg:mb-[2rem] lg:mb-[3rem] lg:block justify-between items-center px-[1rem] lg:px-0 pb-[1rem]">
          <h1 className="  font-[400] text-[1rem] lg:text-[1.5rem] lg:text-[2rem] text-white">
            Join Room
          </h1>
          <VscChromeClose
            onClick={() => setShowJoinRoom(false)}
            className="lg:absolute top-[2rem] right-[2rem] lg:right-[5rem] text-[25px] lg:text-[40px]  text-white  "
            color="white"
          />
        </div>
        <div className=" lg:mt-[4rem] bg-[white] py-[20px] px-[1rem]">
          {exists && modalOpen && (
            <div className="mb-[2rem] slide">
              <div className="flex justify-end">
                <div className="w-[30px] h-[30px] flex items-center justify-center  bg-[rgba(0,0,0,0.8)] hover:bg-[rgba(0,0,0,1)]">
                  <VscChromeClose
                    onClick={() => setModalOpen(false)}
                    className="text-[20px] text-white"
                    color="white"
                  />
                </div>
              </div>
              <p className="text-[12px] lg:text-[14px] bg-[#2BC99E] px-[1rem] py-[1rem] text-black">
                You are good to go {firstName}. The room exists. It was created
                and managed by{" "}
                {roomData.creatorName === user.username
                  ? "You"
                  : roomData.creatorName}
                . Click on the Join button below to get in.
              </p>
            </div>
          )}

          {loading && (
            <div
              style={{ transform: "translateX(-50%)" }}
              className="fixed top-[3rem] left-[50%]"
            >
              <Loader />
            </div>
          )}

          {!exists && modalOpen && (
            <div className="mb-[2rem] slide">
              <div className="flex justify-end">
                <div className="w-[30px] h-[30px] flex items-center justify-center  bg-[rgba(0,0,0,0.8)] hover:bg-[rgba(0,0,0,1)]">
                  <VscChromeClose
                    onClick={() => setModalOpen(false)}
                    className="text-[20px] text-white"
                    color="white"
                  />
                </div>
              </div>
              <p className="text-[12px] lg:text-[14px] bg-[#2BC99E] px-[1rem] py-[1rem] text-black">
                Sorry {firstName}, the room you're trying to access does not
                exist. Either it was never created or the admin changed its Room
                ID or you're not entering the correct digits.
              </p>
            </div>
          )}
          {!filled && (
            <p className="text-red-500 text-[12px] lg:text-[14px]  mt-[1rem] mb-[10px]">
              This field must be filled
            </p>
          )}

          <div className="flex flex-col mb-[2rem]">
            <label className="mb=[10px]">Enter the Room ID</label>
            <input
              value={meetingId}
              onFocus={() => setFilled(true)}
              onChange={(e) => setMeetingId(e.target.value)}
              type="text"
              className="block h-[50px] w-full outline-none px-[1rem] mt-[10px] border-[1px] border-[rgba(0,0,0,0.3)]"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={() => join()}
              className="bg-[#1492E6] text-white h-[35px] sm:h-[45px] px-[2rem] transition duration-200 hover:bg-[#005FEE] text-[14px] md:text-[16px]"
            >
              JOIN
            </button>
            {meetingId.length > 0 && (
              <button
                onClick={() => verify()}
                className="bg-transparent text-[#1492E6] text-[14px] lg:text-[1rem] font-semibold"
              >
                VERIFY
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
