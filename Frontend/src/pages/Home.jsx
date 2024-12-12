import React, { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import axios from "axios";
import locations from "../../place.json";
import gsap from "gsap";
import { RiArrowDownWideFill } from "react-icons/ri";
import LocationSearchPanel from "../components/LocationSearchPanel";
import "remixicon/fonts/remixicon.css";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  // const [ride, setRide] = useState(null);

  // const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    setPickupSuggestions([]);
    setDestinationSuggestions([]);
  }, []);

  useEffect(() => {
    // console.log(user);

    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  const handlePickupChange = async (e) => {
    const input = e.target.value;
    setPickup(input);

    if (input.length > 0) {
      const filteredSuggestions = locations
        .filter((location) =>
          location.place_name.toLowerCase().includes(input.toLowerCase())
        )
        .map((location) => location.place_name);

      setPickupSuggestions(filteredSuggestions);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPickupSuggestions(response.data);
      } catch {
        // Handle error (optional)
      }
    } else {
      setPickupSuggestions([]);
    }
  };

  const handleDestinationChange = async (e) => {
    const input = e.target.value;
    setDestination(input);

    // Show suggestions only after user starts typing
    if (input.length > 0) {
      const filteredSuggestions = locations
        .filter((location) =>
          location.place_name.toLowerCase().includes(input.toLowerCase())
        )
        .map((location) => location.place_name);

      setDestinationSuggestions(filteredSuggestions);

      // Optionally fetch suggestions from an API if needed
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDestinationSuggestions(response.data); // Update with API data
      } catch {
        // Handle error (optional)
      }
    } else {
      setDestinationSuggestions([]); // Clear suggestions if input is empty
    }
  };

  // const handlePickupSelect = (suggestion) => {
  //   setPickup(suggestion);
  //   setPickupSuggestions([]);
  //   setPanelOpen(false);
  // };

  // const handleDestinationSelect = (suggestion) => {
  //   setDestination(suggestion);
  //   setDestinationSuggestions([]);
  //   setPanelOpen(false);
  // };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
      });
      gsap.to(panelCloseRef.current, {
        opacity: "1",
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0,
      });
      gsap.to(panelCloseRef.current, {
        opacity: "0",
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanelOpen) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehicleFound]);
  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(WaitingForDriverRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(WaitingForDriverRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [waitingForDriver]);

  async function findTrip() {
    setVehiclePanelOpen(true);
    setPanelOpen(false);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
      {
        params: { pickup: pickup, destination: destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setFare(response.data);
  }

  async function createRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      {
        pickup,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }
  return (
    <div className="h-screen overflow-hidden relative">
      <img
        className="w-16 mb-10 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover object-center"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[28%] bg-white p-6 relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 top-6 right-6 text-2xl"
          >
            <RiArrowDownWideFill />
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-700 rounded-full"></div>

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eeeeee] text-center mt-5 rounded-lg px-12 py-2 border w-full text-lg placeholder:text-base"
              type="text"
              placeholder="Add a pick-up Location"
            />

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eeeeee] text-center  mt-3 rounded-lg px-12 py-2 border w-full text-lg placeholder:text-base"
              type="text"
              placeholder="Enter your Destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className="h-0 bg-white">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanelOpen={setVehiclePanelOpen}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 w-full"
      >
        <VehiclePanel
          fare={fare}
          selectVehicle={setVehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 w-full"
      >
        <ConfirmRide
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          createRide={createRide}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 w-full"
      >
        <LookingForDriver
          pickup={pickup}
          destination={destination}
          fare={fare}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={WaitingForDriverRef}
        className="fixed z-10 bottom-0  bg-white px-3 py-6 pt-12 w-full"
      >
        <WaitingForDriver
          // ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
