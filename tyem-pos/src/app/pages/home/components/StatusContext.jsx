import React, { createContext, useContext, useState, useEffect } from "react";
import { FaClipboardCheck, FaBoxOpen, FaCheckCircle, FaUserTie } from "react-icons/fa";

const OrderStatusContext = createContext();

export const OrderStatusProvider = ({ children }) => {
  // Load initial states from localStorage or set to false by default
  const [isAccepted, setIsAccepted] = useState(() => {
    return JSON.parse(localStorage.getItem("isAccepted")) || false;
  });

  const [isReady, setIsReady] = useState(() => {
    return JSON.parse(localStorage.getItem("isReady")) || false;
  });

  const [isAssigned, setIsAssigned] = useState(() => {
    return JSON.parse(localStorage.getItem("isAssigned")) || false;
  });

  const [showPlaceModal, setShowPlaceModal] = useState(() => {
    return JSON.parse(localStorage.getItem("showPlaceModal")) || false;
  });

  // Save states to localStorage when they change
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
      date: isAccepted ? "Fri, Aug 2, 2024, 7:58 AM" : "",
    },
    {
      label: "Ready",
      completed: isReady,
      icon: <FaBoxOpen className="text-white w-8 h-8" />,
      date: isReady ? "Mon, Aug 5, 2024, 8:17 AM" : "",
    },
    {
      label: "Assigned",
      completed: isAssigned,
      icon: <FaUserTie className="text-white w-8 h-8" />,
      date: isAssigned ? "Mon, Aug 5, 2024, 9:00 AM" : "",
      employee: isAssigned ? "John Doe" : "",
    },
    {
      label: "Completed",
      completed: showPlaceModal,
      icon: <FaCheckCircle className="text-white w-8 h-8" />,
      date: showPlaceModal ? "Mon, Aug 5, 2024, 9:30 AM" : "",
    },
  ];

  return (
    <OrderStatusContext.Provider
      value={{
        statuses,
        setIsAccepted,
        setIsReady,
        setIsAssigned,
        setShowPlaceModal,
      }}
    >
      {children}
    </OrderStatusContext.Provider>
  );
};

export const useOrderStatus = () => useContext(OrderStatusContext);
