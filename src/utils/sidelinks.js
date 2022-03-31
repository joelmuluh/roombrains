import { AiOutlineHome } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { VscEditorLayout } from "react-icons/vsc";
import { BiMessageRoundedEdit } from "react-icons/bi";
import { GrUndo } from "react-icons/gr";

export const links = [
  {
    text: "Home",
    icon: <AiOutlineHome className="text-[18px] lg:text-[25px]" />,
    url: "home",
  },
  {
    text: " Editor",
    icon: <RiEditBoxLine className="text-[18px] lg:text-[25px]" />,
    url: "editor",
  },
  {
    text: "WhiteBoard",
    icon: <VscEditorLayout className="text-[18px] lg:text-[25px]" />,
    url: "whiteboard",
  },
  {
    text: "About",
    icon: (
      <BiMessageRoundedEdit
        className="text-[18px] lg:text-[25px]"
        color="white"
      />
    ),
    url: "about",
  },
  {
    text: "Excuse me",
    icon: <GrUndo className="text-[18px] lg:text-[25px]" />,
    url: "/profile",
  },
];
