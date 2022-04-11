import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "./Loader";

function MyRooms() {
  const user = useSelector((state) => state.user);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const stateRooms = useSelector((state) => state.myRooms);
  const { username } = user;
  const firstName = username.includes(" ") ? username.split(" ")[0] : username;
  const getMyRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/room/myrooms`,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = response.data;
      setLoading(false);
      setRooms(data);
      dispatch({ type: "FILL_ROOMS", payload: data });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (stateRooms.myRooms === null) {
      getMyRooms();
    } else {
      setRooms(stateRooms.myRooms);
    }
  }, []);
  return (
    <div className="h-full overflow-y-auto px-[1rem] lg:px-[1.5rem] pb-[3rem]">
      {rooms.length > 0 ? (
        rooms.map((data, index) => <MyRoom key={index} data={data} />)
      ) : (
        <div className="flex justify-center items-center mt-[5rem] text-[1rem]">
          {!loading ? (
            `You currently don't have any room ${firstName}`
          ) : (
            <i>Getting your Rooms...</i>
          )}
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
    </div>
  );
}

export default MyRooms;

const MyRoom = ({ data }) => {
  return (
    <div className="mt-[2rem] flex items-center">
      <span className="w-[10px] h-[10px] lg:w-[15px] lg:h-[15px] rounded-full bg-[#1492E6]  border-none"></span>
      <p className="text-black ml-[1rem] flex-1">{data.name}</p>

      <Link to={`/rooms/${data.meetingId}`}>
        {" "}
        <button className="border-none ml-[1rem] text-white text-[14px] lg:text-[1rem] bg-[#1492E6] px-[0.6rem] py-[6px] lg:px-[1rem] lg:py-[10px]">
          Get in
        </button>
      </Link>
    </div>
  );
};
