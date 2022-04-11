import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/actions/login";
import validator from "validator";
import Loader from "../components/Loader";
import Header from "../components/Header";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showpassword, setShowPassword] = useState(false);
  const [filled, setFilled] = useState(true);
  const [passwordCorrect, setPasswordCorrect] = useState(true);
  const [EmailValid, setEmailValid] = useState(true);
  const [accountExists, setAccountExists] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { intended_room } = useSelector((state) => state.meeting);

  const handleForm = async () => {
    if (email.trim().length > 0 && password.trim().length > 0) {
      if (validator.isEmail(email)) {
        try {
          setLoading(true);
          const response = await axios.post(
            `${process.env.REACT_APP_API}/auth/login`,
            {
              email,
              password,
            }
          );
          const data = response.data;
          setLoading(false);
          if (data.exists === false) {
            setAccountExists(false);
            setPasswordCorrect(true);
          } else {
            if (data.exists && !data.validPassword) {
              setPasswordCorrect(false);
              setAccountExists(true);
            } else {
              dispatch(
                login(
                  data._id,
                  data.username,
                  data.email,
                  data.token,
                  data.image
                )
              );

              if (intended_room) {
                navigate(`/rooms/${intended_room}`);
              } else {
                navigate("/profile");
              }
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      } else {
        setEmailValid(false);
        setAccountExists(true);
      }
    } else {
      setFilled(false);
    }
  };

  useEffect(() => {
    document.title = "Roombrains | login";
  }, []);
  return (
    <div className="h-[100vh] lg:overflow-y-auto bg-[#1C1C1C]">
      {loading && (
        <div
          style={{ transform: "translateX(-50%)" }}
          className="fixed top-[3rem] left-[50%]"
        >
          <Loader />
        </div>
      )}
      <Header />
      <div className="h-full px-[1rem] flex flex-col items-center pt-[2.5rem] lg:pt-[7%]">
        <h1 className="mb-[2rem] text-white font-semibold text-[2rem]">
          Login
        </h1>
        <div className="space-y-[1.5rem] w-[98%] mx-auto max-w-[600px] py-[1rem]">
          <div>
            {!EmailValid && (
              <p className="text-red-500 mb-[16x]">
                Please Enter a valid Email
              </p>
            )}
            {!filled && (
              <p className="text-red-500 mb-[16x]">All fields must be filled</p>
            )}
            {!accountExists && (
              <p className="text-red-500 mb-[16x]">
                This account doesn't exist
              </p>
            )}
            <div className="flex flex-col space-y-[8px]">
              <label htmlFor="" className="text-white">
                Email
              </label>
              <input
                spellCheck={false}
                onFocus={() => {
                  setFilled(true);
                  setEmailValid(true);
                }}
                onBlur={() => {
                  if (!validator.isEmail(email)) {
                    setEmailValid(false);
                  }
                }}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                className="bg-[#373333] h-[50px] outline-none border-none px-[1rem] text-white"
              />
            </div>
          </div>
          <div>
            {!passwordCorrect && (
              <p className="text-red-500 mb-[16x]">
                Your password is not correct
              </p>
            )}
            <div className="flex flex-col space-y-[8px]">
              <label htmlFor="" className="text-white">
                Password
              </label>
              <div className="relative flex justify-between items-center">
                <input
                  onFocus={() => {
                    setFilled(true);
                    setPasswordCorrect(true);
                  }}
                  spellCheck={false}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={`${showpassword ? "text" : "password"}`}
                  className="bg-[#373333] w-full h-[50px] outline-none border-none pl-[1rem] text-white pr-[2.8rem]"
                />
                {showpassword ? (
                  <BiShow
                    onClick={() => setShowPassword(false)}
                    className="text-white absolute right-[1rem] "
                    size={25}
                  />
                ) : (
                  <BiHide
                    onClick={() => setShowPassword(true)}
                    className="text-white absolute right-[1rem] "
                    size={25}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              className="border-none outline-none w-[150px] py-[15px] bg-[#005FEE] text-white"
              onClick={() => handleForm()}
            >
              Login
            </button>
            <div className="mt-[2rem]">
              <span className="text-white opacity-[0.8]">
                Don't have an account?{" "}
              </span>{" "}
              <Link to="/register">
                <span className="text-[#005FEE] ml-[10px] hover:opacity-[0.8]">
                  Create Account
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
