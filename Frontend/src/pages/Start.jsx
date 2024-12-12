import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div>
      <div className="h-screen bg-cover bg-center  bg-home pt-8 w-full flex justify-between flex-col">
        <img
          className="w-16 ml-8"
          src="https://freelogopng.com/images/all_img/1659768779uber-logo-white.png"
          alt=""
        />
        <div className="bg-white pb-7 py-4 px-4">
          <h2 className="text-[30px] font-bold">Get Started with Uber</h2>
          <Link
            to="/login"
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-4"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
