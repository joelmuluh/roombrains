import React, { useEffect, useState } from "react";
import { MdGppGood } from "react-icons/md";

function Alert({ text, setShowAlert }) {
  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, []);
  return (
    <div className="fixed z-[500] alert flex items-center px-[0.7rem] md:px-[1.5rem] mx-[1rem] lg:right-[4rem] top-[2rem] py-[0.6rem] bg-[white] rounded-[7px] info-slide">
      <MdGppGood className="text-green-500 text-[25px] md:text-[30px]" />
      <span className="text-black ml-[10px] text-[11px] md:text-[15px]">
        {text}
      </span>
    </div>
  );
}

export default Alert;
