import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, TextField } from "@mui/material";
import { BsFillPlayFill } from "react-icons/bs";
import { VscChromeClose } from "react-icons/vsc";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";

import { useOutletContext } from "react-router-dom";
import Loader from "../Loader";
function Editor() {
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
    code,
    setCode,
    language,
    setLanguage,
  } = useOutletContext();
  const [codeFontSize, setCodeFontSize] = useState(20);
  const [showPopup, setShowPopup] = useState(false);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const writeCode = (e) => {
    setCode(e);
    const myEditorAccess = JSON.parse(
      window.localStorage.getItem("myEditorAccess")
    );
    if (myEditorAccess || roomData.creator === user._id) {
      if (
        myEditorAccess?.includes(roomData.conversationId) ||
        roomData.creator === user._id
      ) {
        socket.emit("code_from_editor", {
          conversationId: roomData.conversationId,
          userId: user._id,
          code: e,
          username: user.username,
        });
      }
    }
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setCodeFontSize(15);
    }
  }, []);
  const runWithoutEvent = async (code, language, input) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/room/code/compile`,
        {
          code,
          language,
          input: input.trim() === "" ? "" : input,
        },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      return data.output;
    } catch (error) {
      setLoading(false);
      setInput("");
      setShowPopup(false);
      console.log(error.message);
    }
  };
  const runCode = async () => {
    let selectedLanguage;
    if (language === "c_cpp") {
      selectedLanguage = "cpp";
    } else if (language === "java") {
      selectedLanguage = "java";
    } else {
      selectedLanguage = "py";
    }
    const codeOutput = await runWithoutEvent(code, selectedLanguage, input);
    setInput("");
    setShowPopup(false);
    setOutput(codeOutput);
    const myEditorAccess = JSON.parse(
      window.localStorage.getItem("myEditorAccess")
    );
    if (myEditorAccess || roomData.creator === user._id) {
      if (
        myEditorAccess?.includes(roomData.conversationId) ||
        roomData.creator === user._id
      ) {
        socket.emit("code_output", {
          output: codeOutput,
          conversationId: roomData.conversationId,
        });
      }
    }
  };

  socket.off("code_output").on("code_output", (data) => {
    setOutput(data.output);
  });
  return (
    <div className="h-full mt-[1rem] md:mt-0 overflow-y-auto">
      <div className={`h-full`}>
        <div className={`sticky top-0 left-0 w-full z-[20] `}>
          <>
            {streamsData.streams.length > 0 && (
              <div className="mb-[0.2rem] md:mt-[1rem] lg:mt-0 small-video-wrapper gap-[1rem] bg-[#1F1F1F] px-[1rem]">
                {streamsData?.streams.map((streamData) => (
                  <Stream
                    key={streamData._id}
                    _id={streamData._id}
                    stream={streamData?.stream}
                    image={streamData.image}
                    username={streamData.username}
                    conversationId={roomData.conversationId}
                    streamsData={streamsData}
                    user={user}
                  />
                ))}
              </div>
            )}
          </>

          <div
            className={`flex px-[1rem] justify-between items-center bg-[#005FEE] h-[40px] lg:h-[50px] py-[7px] lg:py-[5px]`}
          >
            <SelectLanguage
              language={language}
              setLanguage={setLanguage}
              user={user}
              roomData={roomData}
              socket={socket}
              streamsData={streamsData}
            />
            <div
              className={`${
                streamsData.streams.length > 0
                  ? "h-[32px] lg:h-[90%]"
                  : "h-[35px]"
              }`}
            >
              <Button
                onClick={() => setShowPopup(true)}
                variant="contained"
                color="primary"
                startIcon={<BsFillPlayFill className="text-green-500" />}
                sx={{ height: "100%" }}
              >
                Run
              </Button>
            </div>
          </div>
        </div>
        <div className="h-full w-full mt-[1rem]">
          <AceEditor
            mode={language}
            theme="dracula"
            onChange={(e) => {
              writeCode(e);
            }}
            name="UNIQUE_ID_OF_DIV"
            setOptions={{
              showPrintMargin: false,
              fontSize: codeFontSize,
              wrap: true,
            }}
            value={code}
            className={`editor ${
              output ? "editor-60" : "editor-70"
            } lg:editor-80 transition duration-200`}
            readOnly={false}
          />
          <div
            className={`${
              output ? "h-[30%]" : "h-[30%]"
            } lg:h-[30%] transition duration-200`}
          >
            <h1 className="font-semibold text-center py-[0.3rem]">Output</h1>
            <div
              style={{
                whiteSpace: "pre-line",
              }}
              className="bg-[#263238] h-full px-[1rem] md:px-[2rem] py-[1rem]  overflow-y-auto text-[14px] md:text-[16px]"
            >
              {output}
            </div>
          </div>
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
        {showPopup && (
          <div
            onClick={() => setShowPopup(false)}
            className={`scale-in fixed z-[1000] top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[white] w-[90%] mx-auto px-[1rem] py-[0.7rem] max-h-[500px] max-w-[500px] text-black rounded-[4px] pb-[1.5rem] overflow-y-auto"
            >
              <p className="my-[1.5rem] text-[13px] lg:text-[16px]">
                If your program requires any input, then enter the input value
                or values here line by line.
              </p>
              <TextField
                label="input"
                variant="filled"
                className="w-full mt-[10px] text-white"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                spellCheck={false}
                multiline
                sx={{
                  width: "100%",
                  marginBottom: "14px",
                  color: "white",
                }}
              />

              <div className="flex justify-end">
                <Button
                  onClick={() => runCode()}
                  variant="contained"
                  color="primary"
                  startIcon={<BsFillPlayFill className="text-green-500" />}
                >
                  Run
                </Button>
              </div>
            </div>
            <VscChromeClose
              onClick={() => setShowPopup(false)}
              className="absolute top-[2rem] right-[4rem] text-white text-[30px] font-bold"
            />
          </div>
        )}
        {loading && (
          <div
            style={{ transform: "translateX(-50%)" }}
            className="fixed top-[5rem] left-[50%] z-[1100]"
          >
            <Loader />
          </div>
        )}
      </>
    </div>
  );
}

export default Editor;

const Stream = ({ stream, _id, user, streamsData }) => {
  const streamRef = useRef();
  useEffect(() => {
    if (streamRef) {
      if (_id === user._id && streamsData.screenStream.screening) {
        streamRef.current.srcObject = streamsData.screenStream.stream;
        streamRef.current.play();
      } else {
        streamRef.current.srcObject = stream;
        streamRef.current.play();
      }
    }
  }, []);
  return (
    <video
      className="w-[60px] md:w-[100px] h-full max-h-[60px]"
      ref={streamRef}
      autoPlay
    />
  );
};

function SelectLanguage({
  language,
  setLanguage,
  user,
  roomData,
  socket,
  streamsData,
}) {
  const changeLanguage = (e) => {
    setLanguage(e.target.value);
    const myEditorAccess = JSON.parse(
      window.localStorage.getItem("myEditorAccess")
    );
    if (myEditorAccess || roomData.creator === user._id) {
      if (
        myEditorAccess?.includes(roomData.conversationId) ||
        roomData.creator === user._id
      ) {
        socket.emit("change_programming_language", {
          conversationId: roomData.conversationId,
          userId: user._id,
          language: e.target.value,
        });
      }
    }
  };
  return (
    <Select
      labelId="demo-simple-select-filled-label"
      id="demo-simple-select-filled"
      value={language}
      onChange={(e) => changeLanguage(e)}
      variant="outlined"
      className={`my-[7px] text-left w-[95px]  md:w-[100px] bg-white ${
        streamsData.streams.length > 0 ? "h-[32px] lg:h-[90%]" : "h-[35px]"
      }`}
    >
      <MenuItem value={"c_cpp"}>C/C++</MenuItem>
      <MenuItem value={"java"}>Java</MenuItem>
      <MenuItem value={"python"}>Python</MenuItem>
    </Select>
  );
}
