import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [finishRidePanel]);
  return (
    <div className="h-screen relative">
      <div className="fixed p-6 top-0 flex items-center justify-between w-full">
        <img
          className="w-16 mb-10 absolute left-5 top-5"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className="fixed  right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-4/5">
        <img
          className="h-full w-full object-cover object-center"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div
        onClick={() => setFinishRidePanel(true)}
        className="h-1/5 p-6 flex items-center justify-between relative "
      >
        <h5
          onClick={() => {}}
          className="p-1 text-center w-[95%] absolute top-0"
        >
          <i className="text-3xl text-gray-300 ri-arrow-up-wide-line"></i>
        </h5>
        <div className="bg-gray-200 w-full flex items-center justify-between p-3 mt-5 rounded-lg gap-4 ">
          <h4 className="text-xl font font-semibold">4 KM away</h4>
          <button className="bg-black text-white font-semibold p-3 px-10 rounded-lg">
            Complete Ride
          </button>
        </div>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed z-10 h-screen bottom-0 translate-y-full  bg-white px-3 py-10 pt-12 w-full"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
