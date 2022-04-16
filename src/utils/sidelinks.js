import { AiOutlineHome } from "react-icons/ai";
import { HiCode } from "react-icons/hi";
import { VscEditorLayout } from "react-icons/vsc";
import { BiMessageRoundedEdit } from "react-icons/bi";

export const links = [
  {
    text: "Home",
    icon: <AiOutlineHome className="text-[18px] lg:text-[25px]" />,
    url: "home",
  },
  {
    text: " Editor",
    icon: <HiCode className="text-[18px] lg:text-[25px]" />,
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
];
