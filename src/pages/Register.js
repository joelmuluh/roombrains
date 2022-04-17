import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";
import Header from "../components/Header";
import Loader from "../components/Loader";
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showpassword, setShowPassord] = useState(false);
  const [filled, setFilled] = useState(true);
  const [passwordsEqual, setPasswordsEqual] = useState(true);
  const [EmailValid, setEmailValid] = useState(true);
  const [accountExists, setAccountExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleForm = async () => {
    if (
      username.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      confirmPassword.trim().length > 0
    ) {
      if (password !== confirmPassword) {
        setPasswordsEqual(false);
      }
      if (validator.isEmail(email)) {
        setEmailValid(true);
      } else {
        setEmailValid(false);
      }
      if (password === confirmPassword && validator.isEmail(email)) {
        try {
          setLoading(true);
          const response = await axios.post(
            `${process.env.REACT_APP_API}/auth/register`,
            {
              username,
              email,
              password,
            }
          );
          const data = response.data;
          setLoading(false);
          if (data.exists) {
            setAccountExists(true);
          } else {
            navigate("/login");
            console.log(data);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    } else {
      setFilled(false);
    }
  };
  useEffect(() => {
    document.title = "Roombrains | Register";
  }, []);
  return (
    <div className="h-[100vh] overflow-y-auto bg-[#1C1C1C] ">
      {loading && (
        <div
          style={{ transform: "translateX(-50%)" }}
          className="fixed top-[5rem] left-[50%]"
        >
          <Loader />
        </div>
      )}
      <Header />
      <div className="h-full px-[1rem] flex flex-col items-center pt-[2.5rem] lg:pt-[7%]">
        <h1 className="mb-[2rem] text-white font-semibold text-[1.3rem] lg:text-[2rem]">
          Register for Free
        </h1>
        <div className="space-y-[1.5rem] w-[98%] mx-auto max-w-[600px] py-[1rem]">
          <div>
            {!filled && (
              <p className="text-red-500 mb-[16x]">All fields must be filled</p>
            )}

            <div className="flex flex-col space-y-[8px]">
              <label htmlFor="" className="text-white">
                Username
              </label>
              <input
                onFocus={() => setFilled(true)}
                spellCheck={false}
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                className="bg-[#373333] h-[50px] outline-none border-none px-[1rem] text-white"
              />
            </div>
          </div>
          <div>
            {!EmailValid && (
              <p className="text-red-500 mb-[16x]">
                Please Enter A valid Email
              </p>
            )}
            {accountExists && (
              <p className="text-red-500 mb-[16x]">
                An account with this Email already exists.
              </p>
            )}
            <div className="flex flex-col space-y-[8px]">
              <label htmlFor="" className="text-white">
                Email
              </label>
              <input
                onFocus={() => {
                  setFilled(true);
                  setAccountExists(false);
                  setEmailValid(true);
                }}
                spellCheck={false}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  if (!validator.isEmail(email) && email.length !== 0) {
                    setEmailValid(false);
                  }
                }}
                value={email}
                type="text"
                className="bg-[#373333] h-[50px] outline-none border-none px-[1rem] text-white"
              />
            </div>
          </div>
          <div>
            {!passwordsEqual && (
              <p className="text-red-500 mb-[16x]">
                Your passwords must be the same
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
                    setPasswordsEqual(true);
                  }}
                  spellCheck={false}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={`${showpassword ? "text" : "password"}`}
                  className="bg-[#373333] w-full h-[50px] outline-none border-none pl-[1rem] text-white pr-[2.8rem]"
                />
                {showpassword ? (
                  <BiShow
                    onClick={() => setShowPassord(false)}
                    className="text-white absolute right-[1rem] "
                    size={25}
                  />
                ) : (
                  <BiHide
                    onClick={() => setShowPassord(true)}
                    className="text-white absolute right-[1rem] "
                    size={25}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col space-y-[8px]">
              <label htmlFor="" className="text-white">
                Confirm Password
              </label>
              <div className="relative flex justify-between items-center">
                <input
                  onFocus={() => {
                    setFilled(true);
                    setPasswordsEqual(true);
                  }}
                  spellCheck={false}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type={`${showpassword ? "text" : "password"}`}
                  className="bg-[#373333] w-full h-[50px] outline-none border-none pl-[1rem] text-white pr-[2.8rem]"
                />
                {showpassword ? (
                  <BiShow
                    onClick={() => setShowPassord(false)}
                    className="text-white absolute right-[1rem] "
                    size={25}
                  />
                ) : (
                  <BiHide
                    onClick={() => setShowPassord(true)}
                    className="text-white absolute right-[1rem] "
                    size={25}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              className="border-none outline-none w-[135px] lg:w-[150px] py-[10px] lg:py-[15px] bg-[#005FEE] text-white"
              onClick={() => handleForm()}
            >
              Register
            </button>
            <div className="mt-[2rem]">
              <span className="text-white opacity-[0.8]">
                Already have an account?{" "}
              </span>{" "}
              <Link to="/login">
                <span className="text-[#005FEE] ml-[10px] hover:opacity-[0.8]">
                  Login
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
