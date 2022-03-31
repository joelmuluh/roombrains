import React, { useEffect, useState } from "react";
import { MdGppGood } from "react-icons/md";

function Alert({ text, setShowAlert }) {
  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, []);
  return (
    <div className="fixed z-[500] alert flex items-center px-[1.5rem] md:right-[4rem] top-[2rem] h-[50px] bg-[white] rounded-[7px] info-slide">
      <MdGppGood className="text-green-500 text-[30px]" color="" />
      <span className="text-black ml-[10px] text-[12px] md:text-[15px]">
        {text}
      </span>
    </div>
  );
}

export default Alert;
