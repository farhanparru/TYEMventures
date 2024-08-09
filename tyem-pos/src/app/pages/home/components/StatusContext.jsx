import React, { createContext, useContext, useState, useEffect } from "react";
import { FaClipboardCheck, FaBoxOpen, FaCheckCircle, FaUserTie } from "react-icons/fa";

const OrderStatusContext = createContext();

export const OrderStatusProvider = ({ children }) => {
  const [orderStatuses, setOrderStatuses] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("orderStatuses"));
    return saved || {};
  });

  useEffect(() => {
    localStorage.setItem("orderStatuses", JSON.stringify(orderStatuses));
  }, [orderStatuses]);

  const updateOrderStatus = (orderId, status, value) => {
    setOrderStatuses((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [status]: value },
    }));
  };

  const getStatusArray = (orderId) => [
    {
      label: "Confirmed",
      completed: orderStatuses[orderId]?.isAccepted || false,
      icon: <FaClipboardCheck className="text-white w-8 h-8" />,
      date: orderStatuses[orderId]?.isAccepted ? new Date().toLocaleString() : "",
    },
    {
      label: "Ready",
      completed: orderStatuses[orderId]?.isReady || false,
      icon: <FaBoxOpen className="text-white w-8 h-8" />,
      date: orderStatuses[orderId]?.isReady ? new Date().toLocaleString() : "",
    },
    {
      label: "Assigned",
      completed: orderStatuses[orderId]?.isAssigned || false,
      icon: <FaUserTie className="text-white w-8 h-8" />,
      date: orderStatuses[orderId]?.isAssigned ? new Date().toLocaleString() : "",
      employee: orderStatuses[orderId]?.isAssigned ? "John Doe" : "",
    },
    {
      label: "Completed",
      completed: orderStatuses[orderId]?.showPlaceModal || false,
      icon: <FaCheckCircle className="text-white w-8 h-8" />,
      date: orderStatuses[orderId]?.showPlaceModal ? new Date().toLocaleString() : "",
    },
  ];

  return (
    <OrderStatusContext.Provider value={{ getStatusArray, updateOrderStatus }}>
      {children}
    </OrderStatusContext.Provider>
  );
};

export const useOrderStatus = () => useContext(OrderStatusContext);
