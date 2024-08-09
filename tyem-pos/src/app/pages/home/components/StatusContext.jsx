import React, { createContext, useContext, useState, useEffect } from "react";
import { FaClipboardCheck, FaBoxOpen, FaCheckCircle, FaUserTie } from "react-icons/fa";

const OrderStatusContext = createContext();

export const OrderStatusProvider = ({ children }) => {
  const [isAccepted, setIsAccepted] = useState(() => JSON.parse(localStorage.getItem("isAccepted")) || false);
  const [isReady, setIsReady] = useState(() => JSON.parse(localStorage.getItem("isReady")) || false);
  const [isAssigned, setIsAssigned] = useState(() => JSON.parse(localStorage.getItem("isAssigned")) || false);
  const [showPlaceModal, setShowPlaceModal] = useState(() => JSON.parse(localStorage.getItem("showPlaceModal")) || false);

  useEffect(() => {
    localStorage.setItem("isAccepted", JSON.stringify(isAccepted));
  }, [isAccepted]);

  useEffect(() => {
    localStorage.setItem("isReady", JSON.stringify(isReady));
  }, [isReady]);

  useEffect(() => {
    localStorage.setItem("isAssigned", JSON.stringify(isAssigned));
  }, [isAssigned]);

  useEffect(() => {
    localStorage.setItem("showPlaceModal", JSON.stringify(showPlaceModal));
  }, [showPlaceModal]);

  const statuses = [
    {
      label: "Confirmed",
      completed: isAccepted,
      icon: <FaClipboardCheck className="text-white w-8 h-8" />,
      date: isAccepted ? new Date().toLocaleString() : "",
    },
    {
      label: "Ready",
      completed: isReady,
      icon: <FaBoxOpen className="text-white w-8 h-8" />,
      date: isReady ? new Date().toLocaleString() : "",
    },
    {
      label: "Assigned",
      completed: isAssigned,
      icon: <FaUserTie className="text-white w-8 h-8" />,
      date: isAssigned ? new Date().toLocaleString() : "",
      employee: isAssigned ? "John Doe" : "",
    },
    {
      label: "Completed",
      completed: showPlaceModal,
      icon: <FaCheckCircle className="text-white w-8 h-8" />,
      date: showPlaceModal ? new Date().toLocaleString() : "",
    },
  ];


  return (
    <OrderStatusContext.Provider value={{ statuses, setIsAccepted, setIsReady, setIsAssigned, setShowPlaceModal,isAccepted,isReady,isAssigned,showPlaceModal }}>
      {children}
    </OrderStatusContext.Provider>
  );
};

export const useOrderStatus = () => useContext(OrderStatusContext);
