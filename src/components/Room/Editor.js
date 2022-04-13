import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import { BsFillPlayFill } from "react-icons/bs";
import { VscChromeClose } from "react-icons/vsc";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";

import { useOutletContext } from "react-router-dom";
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
        });
      }
    }
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setCodeFontSize(15);
    }
  }, []);
  const runCode = () => {
    setShowPopup(true);
  };
  return (
    <div className="h-full ">
      <div className="h-[80%]">
        <div className="bg-[#005FEE] px-[1rem]">
          <div>
            {streamsData.streams.length > 0 && (
              <div className="small-video-wrapper gap-[1rem] ">
                {streamsData?.streams
                  ?.filter(
                    (stream) =>
                      stream.conversationId === roomData.conversationId
                  )
                  .map((streamData) => (
                    <Stream
                      key={streamData._id}
                      _id={streamData._id}
                      stream={streamData?.stream}
                      image={streamData.image}
                      username={streamData.username}
                      conversationId={roomData.conversationId}
                      streamsData={streamsData}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <SelectLanguage
              language={language}
              setLanguage={setLanguage}
              user={user}
              roomData={roomData}
              socket={socket}
            />
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
          }}
          value={code}
          className="editor"
          readOnly={false}
        />
      </div>
      <div className="h-[20%] overflow-y-auto bg-[#263238] flex items-center justify-center"></div>
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
              className="bg-[white] w-[90%] mx-auto px-[1rem] py-[1.5rem] max-h-[500px] max-w-[500px] text-black rounded-[4px]"
            >
              <h1 className="font-semibold text-black text-[20px]">
                Coming Soon!!!
              </h1>
              <p className="my-[1.5rem] text-[13px] lg:text-[16px]">
                To interact with other developers, You can use the share screen
                feature for now to enable them watch you code. While the
                compilation feature is being built, You can only use this editor
                to write code for everyone to see in real time without
                compilation.
              </p>
              <i className="font-semibold text-18px">Happy Coding!</i>
            </div>
            <VscChromeClose
              onClick={() => setShowPopup(false)}
              className="absolute top-[2rem] right-[4rem] text-white text-[30px] font-bold"
            />
          </div>
        )}
      </>
    </div>
  );
}

export default Editor;

const Stream = ({ stream }) => {
  const streamRef = useRef();
  useEffect(() => {
    if (streamRef) {
      streamRef.current.srcObject = stream;
      streamRef.current.play();
    }
  }, []);
  return <video className="w-[60px] md:w-[100px]" ref={streamRef} autoPlay />;
};

function SelectLanguage({ language, setLanguage, user, roomData, socket }) {
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
      className="my-[7px] text-left h-[2rem] w-[95px] md:w-[100px] bg-white"
    >
      <MenuItem value={"c_cpp"}>C/C++</MenuItem>
      <MenuItem value={"java"}>Java</MenuItem>
      <MenuItem value={"python"}>Python</MenuItem>
    </Select>
  );
}
