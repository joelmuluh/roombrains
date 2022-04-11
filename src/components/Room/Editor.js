import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { BsFillPlayFill } from "react-icons/bs";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-swift";
import { Button } from "@mui/material";

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
  } = useOutletContext();
  const templates = {
    c: `#include <stdio.h>
int main() {

printf("Hello world");
return 0;

}`,
  };
  const [codeFontSize, setCodeFontSize] = useState(20),
    [showLoader, setShowLoader] = useState(true),
    [language, setLanguage] = useState("c_cpp"),
    [code, setCode] = useState(templates.c),
    [outputValue, setOutputValue] = useState(""),
    [takeInput, setTakeInput] = useState(false),
    [executing, setExecuting] = useState(false),
    [input, setInput] = useState("");

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
            <SelectLanguage language={language} setLanguage={setLanguage} />
            <Button
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
            setCode(e);
            console.log(e);
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

function SelectLanguage({ language, setLanguage }) {
  return (
    <Select
      labelId="demo-simple-select-filled-label"
      id="demo-simple-select-filled"
      value={language}
      onChange={(e) => {
        setLanguage(e.target.value);
      }}
      variant="outlined"
      className="my-[7px] text-left h-[2rem] w-[100px] bg-white"
    >
      <MenuItem value={"c_cpp"}>C++</MenuItem>
      <MenuItem value={"c_cpp"}>C</MenuItem>
      <MenuItem value={"java"}>Java</MenuItem>
      <MenuItem value={"python"}>Python</MenuItem>
    </Select>
  );
}
