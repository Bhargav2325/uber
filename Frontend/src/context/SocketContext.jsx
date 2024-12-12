import React, { Children, createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const SocketProvider = ({ Children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
    });
    socket.on("disconnect", () => {
      console.log("disconnected from server");
    });
  }, []);

  const sendMessage = (eventName, message) => {
    socket.emit(eventName, message);
  };
  const receiveMessage = (eventName, callback) => {
    socket.on(eventName, callback);
  };

  return (
    <SocketContext.Provider value={{ socket }}>
      {Children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
