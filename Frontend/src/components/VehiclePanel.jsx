import React from "react";
import { RiUser3Fill } from "react-icons/ri";

const VehiclePanel = (props) => {
  return (
    <div>
      <h5
        onClick={() => {
          props.setVehiclePanelOpen(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-fill"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-3">Choose a Vehicle</h3>
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.selectVehicle("car");
        }}
        className=" flex items-center border-2 active:border-black bg-gray-100 rounded-xl p-3 w-full justify-between"
      >
        <img
          className="h-10"
          src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium flex items-center text-sm">
            UberGo •
            <span>
              <RiUser3Fill />
            </span>
            4
          </h4>
          <h5 className="font-medium text-base">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable,compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.car}</h2>
      </div>
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.selectVehicle("bike");
        }}
        className=" flex items-center border-2 active:border-black bg-gray-100 rounded-xl p-3 w-full justify-between"
      >
        <img
          className="h-10"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium flex items-center text-sm">
            Bike •
            <span>
              <RiUser3Fill />
            </span>
            1
          </h4>
          <h5 className="font-medium text-base">3 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable,motor cycle rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.bike}</h2>
      </div>
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.selectVehicle("auto");
        }}
        className=" flex items-center border-2 active:border-black bg-gray-100 rounded-xl p-3 w-full justify-between"
      >
        <img
          className="h-10"
          src="https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium flex items-center text-sm">
            UberAuto •
            <span>
              <RiUser3Fill />
            </span>
            2
          </h4>
          <h5 className="font-medium text-base">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable,auto rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.auto}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
