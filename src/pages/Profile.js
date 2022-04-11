import Avatar from "@mui/material/Avatar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import validator from "validator";
import Alert from "../components/Alert";
import { FcPlus } from "react-icons/fc";
import Loader from "../components/Loader";
import Header from "../components/Header";

function Profile() {
  const [showUsername, setShowUsername] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "USER_LOGOUT" });
    navigate("/login");
  };

  const uploadImage = async (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = async () => {
      dispatch({
        type: "UPDATE_DETAIL",
        payload: {
          _id: user._id,
          username: user.username,
          email: user.email,
          image: reader.result,
          token: user.token,
        },
      });
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API}/users/imageupload`,
          { image: reader.result },
          {
            headers: {
              authorization: `Bearer ${user.token}`,
            },
          }
        );

        dispatch({
          type: "UPDATE_DETAIL",
          payload: response.data,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
  };

  useEffect(() => {
    if (!user.token) {
      navigate("/login");
    } else {
      document.title = user.username;
    }
  }, []);

  return (
    <div className="profile-container overflow-y-auto pb-[2rem] lg:pb-[5rem] h-[100vh] bg-[#1F1F1F] text-white">
      <Header />
      <div className="w-[100%] md:max-w-[600px] lg:max-w-[800px] mx-auto profile-width">
        <div className="pt-[2.5rem]">
          <h1 className="account-header mb-[1.5rem] px-[1rem] lg:px-0 lg:mb-[3rem] font-[400] text-[1.2rem] lg:text-[2rem]">
            My Account
          </h1>
          <div className="flex items-center px-[1rem] lg:px-0">
            <div className="relative">
              <Avatar
                alt={user?.username}
                src={user.image && user?.image}
                sx={{ width: 100, height: 100 }}
              >
                {user?.username?.split("")[0]}
              </Avatar>
              <input
                onChange={(e) => uploadImage(e)}
                id="upload"
                type="file"
                className="hidden"
              />
              <label htmlFor="upload">
                <FcPlus className="absolute top-0 right-0 text-[2rem]" />
              </label>
            </div>
            <div className="ml-[1rem] lg:ml-[2rem]">
              <h1 className="text-[1rem] lg:text-[1.5rem]">{user?.username}</h1>
            </div>
          </div>
          <div className="my-[2.5rem] lg:my-[4rem] bg-[#20212C] px-[1rem] lg:px-[1.5rem] py-[1rem] lg:py-[2rem]">
            <div className="flex justify-between">
              <button
                className="profile-btn text-white bg-[#005FEE] lg:h-[55px] h-[40px] rounded-[3px] px-[0.7rem] lg:px-[1rem] hover:bg-[#00317A] transition duration-200"
                onClick={() => setShowCreateRoom(true)}
              >
                Create Room
              </button>
              <button
                className="profile-btn text-white border-[#005FEE] lg:h-[55px] h-[40px] border-2 bg-transparent rounded-[3px] px-[0.7rem] lg:px-[1rem] transition duration-200 hover:bg-[#005FEE]"
                onClick={() => setShowJoinRoom(true)}
              >
                Join Room
              </button>
            </div>
            <>
              {showCreateRoom && (
                <CreateRoom setShowCreateRoom={setShowCreateRoom} />
              )}
              {showJoinRoom && <JoinRoom setShowJoinRoom={setShowJoinRoom} />}
            </>
            {loading && (
              <div
                style={{ transform: "translateX(-50%)" }}
                className="fixed top-[3rem] left-[50%]"
              >
                <Loader />
              </div>
            )}
            <div className="mt-[2rem] lg:mt-[3rem]">
              <div className="space-y-[0.8rem] lg:space-y-[1rem]">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="profile-text opacity-[0.7] text-[16px] lg:text-[18px]">
                        Username
                      </p>
                      <span className="profile-text-value text-[14px] lg:text-[15px]">
                        {user?.username}
                      </span>
                    </div>
                    {!showUsername ? (
                      <button
                        onClick={() => setShowUsername(true)}
                        className="profile-change text-white h-[40px] rounded-[3px] px-[0.7rem] lg:px-[0.9rem] transition bg-[#484141] duration-200 hover:bg-[#060519] text-[13px]"
                      >
                        Change
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowUsername(false)}
                        className="text-white h-[40px] rounded-[3px] px-[0.7rem] lg:px-[0.9rem] transition bg-[#060519] duration-200 hover:bg-[#060519]"
                      >
                        close
                      </button>
                    )}
                  </div>
                  {showUsername && <ShowUsername setLoading={setLoading} />}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="profile-text opacity-[0.7] text-[16px] lg:text-[18px]">
                        Email
                      </p>
                      <span className="profile-text-value text-[14px] lg:text-[15px]">
                        {user?.email}
                      </span>
                    </div>
                    {!showEmail ? (
                      <button
                        onClick={() => setShowEmail(true)}
                        className="profile-change text-white h-[40px] rounded-[3px] px-[0.7rem] lg:px-[0.9rem] transition bg-[#484141] duration-200 hover:bg-[#060519] text-[13px]"
                      >
                        Change
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowEmail(false)}
                        className="text-white h-[40px] rounded-[3px] px-[0.7rem] lg:px-[0.9rem] transition bg-[#060519] duration-200 hover:bg-[#060519]"
                      >
                        close
                      </button>
                    )}
                  </div>
                  {showEmail && <ShowEmail setLoading={setLoading} />}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="profile-text opacity-[0.7] text-[16px] lg:text-[18px]">
                        Password
                      </p>
                    </div>
                    {!showPasswordChange ? (
                      <button
                        onClick={() => setShowPasswordChange(true)}
                        className="profile-change text-white h-[40px] rounded-[3px] px-[0.7rem] lg:px-[0.9rem] transition bg-[#484141] duration-200 hover:bg-[#060519] text-[13px]"
                      >
                        Change
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPasswordChange(false)}
                        className="text-white h-[40px] rounded-[3px] px-[0.7rem] lg:px-[0.9rem] transition bg-[#060519] duration-200 hover:bg-[#060519]"
                      >
                        close
                      </button>
                    )}
                  </div>
                  {showPasswordChange && (
                    <ShowPasswordChange setLoading={setLoading} />
                  )}
                </div>
              </div>
              <button
                className="profile-logout border-none bg-[#D92B2B] hover:bg-[#C15C3A] px-[1rem] lg:px-[1.5rem] mt-[2rem] lg:mt-[3rem] h-[35px] lg:h-[50px]"
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

const ShowUsername = ({ setLoading }) => {
  const [username, setUsername] = useState("");
  const [filled, setFilled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const updateUsername = async () => {
    if (username.trim().length > 0) {
      try {
        setLoading(true);
        const response = await axios.put(
          `${process.env.REACT_APP_API}/users/username`,
          {
            newName: username,
          },

          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setLoading(false);
        setUsername("");
        setShowAlert(true);
        console.log(data);
        dispatch({ type: "UPDATE_DETAIL", payload: data });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setFilled(false);
    }
  };

  return (
    <div>
      {showAlert && (
        <Alert
          text="Username successfully changed"
          setShowAlert={setShowAlert}
        />
      )}
      {!filled && (
        <p className="text-red-500 mt-[1rem] text-[12px] lg:text-[14px] mb-[10px]">
          This field must be filled
        </p>
      )}
      <div
        className={`flex flex-col lg:flex-row lg:items-center ${
          filled && `mt-[1.5rem] lg:mt-[2rem] mb-[2rem]`
        }`}
      >
        <input
          spellCheck={false}
          onFocus={() => setFilled(true)}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="profile-input outline-none  lg:flex-1 h-[40px] px-[1rem] border-[1px] bg-transparent border-[#005FEE]"
          placeholder="Enter your new Name"
        />
        <button
          onClick={() => updateUsername()}
          className="profile-save-btn text-white h-[30px] w-[100px] lg:w-[initial] lg:h-[40px] px-[0.7rem] mt-[10px] lg:mt-0 lg:px-[0.9rem] transition bg-[#005FEE] duration-200 hover:bg-[#060519]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const ShowEmail = ({ setLoading }) => {
  const [email, setEmail] = useState("");
  const [filled, setFilled] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const updateEmail = async () => {
    if (email.trim().length > 0) {
      if (validator.isEmail(email)) {
        try {
          setLoading(true);
          const response = await axios.put(
            `${process.env.REACT_APP_API}/users/email`,
            {
              newEmail: email,
            },

            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;
          setLoading(false);
          setShowAlert(true);
          setEmail("");
          console.log(data);
          dispatch({ type: "UPDATE_DETAIL", payload: data });
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      } else {
        setEmailValid(false);
      }
    } else {
      setFilled(false);
    }
  };

  return (
    <div>
      {showAlert && (
        <Alert text="Email successfully changed" setShowAlert={setShowAlert} />
      )}
      {!filled && (
        <p className="text-red-500 mt-[1rem] text-[12px] lg:text-[14px] mb-[10px]">
          This field must be filled
        </p>
      )}
      {!emailValid && (
        <p className="text-red-500 mt-[1rem] text-[12px] lg:text-[14px] mb-[10px]">
          Please Enter a valid Email
        </p>
      )}
      <div
        className={`flex flex-col lg:flex-row lg:items-center ${
          filled && emailValid && `mt-[1.5rem] lg:mt-[2rem] mb-[2rem]`
        }`}
      >
        <input
          type="text"
          spellCheck={false}
          onFocus={() => {
            setFilled(true);
            setEmailValid(true);
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="profile-input outline-none lg:flex-1 h-[40px] px-[1rem] border-[1px] bg-transparent border-[#005FEE]"
          placeholder="Enter your new Email"
        />
        <button
          onClick={() => updateEmail()}
          className="profile-save-btn text-white h-[30px] w-[100px] lg:w-[initial] lg:h-[40px] px-[0.7rem] mt-[10px] lg:mt-0 lg:px-[0.9rem] transition bg-[#005FEE] duration-200 hover:bg-[#060519]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const ShowPasswordChange = ({ setLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [filled, setFilled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [passwordCorrect, setPasswordCorrect] = useState(true);

  const { token } = useSelector((state) => state.user);
  const updatePassword = async () => {
    if (newPassword.trim().length > 0 && currentPassword.trim().length > 0) {
      try {
        setLoading(true);
        const response = await axios.put(
          `${process.env.REACT_APP_API}/users/password`,
          { currentPassword, newPassword },
          { headers: { authorization: `Bearer ${token}` } }
        );
        const data = response.data;
        if (data.success) {
          setLoading(false);
          setShowAlert(true);
          setPasswordCorrect(true);
          setCurrentPassword("");
          setNewPassword("");
          setFilled(true);
        } else {
          setPasswordCorrect(false);
          setLoading(false);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setFilled(false);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert
          text="Password successfully changed"
          setShowAlert={setShowAlert}
        />
      )}
      {!passwordCorrect && (
        <p className="text-red-500 text-[12px] lg:text-[14px]  mt-[1rem] mb-[10px]">
          You current password is not correct
        </p>
      )}
      {!filled && (
        <p className="text-red-500 text-[12px] lg:text-[14px]  mt-[1rem] mb-[10px]">
          Both fields must be filled
        </p>
      )}
      <div
        className={`flex flex-col lg:flex-row lg:items-center ${
          passwordCorrect && filled && "mt-[1.5rem] lg:mt-[2rem] mb-[0.7rem]"
        } "`}
      >
        <div className="lg:flex-1 relative flex justify-between items-center ">
          <input
            onFocus={() => setFilled(true)}
            spellCheck={false}
            onChange={(e) => setCurrentPassword(e.target.value)}
            value={currentPassword}
            type={`${showPassword ? "text" : "password"}`}
            className="profile-input outline-none flex-1 h-[40px] px-[1rem] border-[1px] bg-transparent border-[#005FEE]"
            placeholder="Enter your current password"
          />
          {showPassword ? (
            <BiShow
              onClick={() => setShowPassword(false)}
              className="text-white absolute right-[0.7rem] lg:right-[1rem] lg:text-[1.5rem]"
            />
          ) : (
            <BiHide
              onClick={() => setShowPassword(true)}
              className="text-white absolute right-[0.7rem] lg:right-[1rem] lg:text-[1.5rem]"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:mt-[0.5rem] mb-[1rem] lg:mb-[1.5rem]">
        <div className="lg:flex-1 relative flex justify-between items-center ">
          <input
            spellCheck={false}
            onFocus={() => setFilled(true)}
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            type={`${showPassword ? "text" : "password"}`}
            className="profile-input outline-none flex-1 h-[40px] px-[1rem] border-[1px] bg-transparent border-[#005FEE]"
            placeholder="Enter your new password"
          />
          {showPassword ? (
            <BiShow
              onClick={() => setShowPassword(false)}
              className="text-white absolute right-[0.7rem] lg:right-[1rem] lg:text-[1.5rem]"
            />
          ) : (
            <BiHide
              onClick={() => setShowPassword(true)}
              className="text-white absolute right-[0.7rem] lg:right-[1rem] lg:text-[1.5rem]"
            />
          )}
        </div>
      </div>
      <button
        onClick={() => updatePassword()}
        className="profile-save-btn text-white h-[30px] w-[100px] lg:w-[initial] lg:h-[40px] px-[0.7rem]  lg:mt-0 lg:px-[0.9rem] transition bg-[#005FEE] duration-200 hover:bg-[#060519]"
      >
        Save
      </button>
    </>
  );
};
