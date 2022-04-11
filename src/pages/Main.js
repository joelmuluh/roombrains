import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Main() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  return (
    <div>
      <Header />
      <section className="bg-[#0B1753] text-white h-[70vh] lg:h-[60vh]">
        <div className="h-full lg:max-w-[1300px] mx-auto w-[100%] sm:w-[90%] flex md:items-center flex-col-reverse md:flex-row gap-[2rem]">
          <div className="flex-[0.5] sm:flex-1 px-[1.5rem] lg:px-0 mb-[3rem] lg:mb-0">
            <h1 className="text-[25px] sm:text-[30px] lg:text-[50px] font-semibold">
              TIRED OF WORKING ALONE?
            </h1>
            <p
              style={{ lineHeight: "1.8" }}
              className="max-w-[400px] mb-[2rem] mt-[1rem]"
            >
              Roombrains provides you an opportunity to have a real-time
              collaboration experience in everyway possible.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="text-black bg-[#31FDF4] h-[40px] px-[1rem] hover:bg-black hover:text-white transiton duration-300"
            >
              GET STARTED
            </button>
          </div>
          <div className="flex-[0.3] sm:flex-1 border-none h-full">
            <img
              className="w-full h-full border-none object-cover sm:object-contain"
              src="/images/hero-image.jpg"
              alt="Hero Image"
            />
          </div>
        </div>
      </section>
      <section className="max-w-[1300px] w-[90%] mx-auto pt-[4rem] lg:py-[5rem] mt-0 lg:mt-[4rem]">
        <h1 className="font-semibold text-[25px] text-[#0B1753]  mb-[3rem]">
          FEATURES
        </h1>
        <div
          style={{ flexWrap: "wrap" }}
          className="flex flexwrap-wrap gap-[3rem]"
        >
          <Feature
            image="/images/video.png"
            alt="video-icon"
            text="Collaborative video chatting experience accompanying any asset on the platform."
          />
          <Feature
            image="/images/chat.jpg"
            alt="chat-icon"
            text="Non-streamers have the ability to interact with everyone through a normal text-chatting system"
          />
          <Feature
            image="/images/board.jpg"
            alt="board-icon"
            text="A real-time collaboration whiteboard to draw and interact with members of the room."
          />
          <Feature
            image="/images/code.png"
            alt="code-icon"
            text="Developers are enriched with a real-time code Editor for interactive coding with fellow developers."
          />
        </div>
      </section>

      <section className="max-w-[1300px] w-[90%] mx-auto py-[3rem]">
        <h1 className="font-semibold text-[25px] text-[#0B1753] mb-[1rem]">
          ABOUT
        </h1>
        <p style={{ lineHeight: "1.8" }} className="max-w-[900px]">
          The primary purpose of Roombrains is to provide a real-time
          collaborative experience for developers and other Engineers who want
          to collaborate using the tools they normally use in their local
          Development Environment. Several software provide similar services but
          Roombrains distinguishes itself by its target audience(Developers) and
          the concept of "Assets"(Whiteboard, Code Editor etc) which more will
          be added to the platform as time unfolds. Soon, developers will have
          the ability to add custom Assets to the created Room.
        </p>

        <div className="mt-[2rem]">
          <img
            className="w-[150px] h-[150px] object-contain"
            src="/images/my-photo.jpg"
            alt="Developer's Photo"
          />
          <h1 className="font-bold text-[16px] lg:text-[18px] text-[#0B1753] mt-[0.8rem] mb-[0.6rem]">
            MULUH JOEL
          </h1>

          <p className="font-[500] block text-[14px]">
            FullStack software Developer
          </p>
          <p className="text-[14px] font-[400]">Creator of Roombrains</p>
        </div>
      </section>
      <footer className="mt-[2rem] h-[70px] bg-[#0B1753] text-white">
        <div className="h-full flex items-center justify-between max-w-[1300px] mx-auto w-[90%]">
          <p className="text-[14px] lg:text-[16px]">
            Copyright &copy; {new Date().getFullYear()}
          </p>
          <p className="font-semibold text-[14px] lg:text-[16px]">Roombrains</p>
        </div>
      </footer>
    </div>
  );
}

export default Main;

const Feature = ({ image, text, alt }) => {
  return (
    <div>
      <img
        className="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] mb-[0.8rem]"
        src={image}
        alt={alt}
      />
      <p style={{ lineHeight: "1.7" }} className="lg:max-w-[300px]">
        {text}
      </p>
    </div>
  );
};
