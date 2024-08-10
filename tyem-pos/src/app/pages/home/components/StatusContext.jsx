import React, { createContext, useContext, useState, useEffect } from "react";
import { FaClipboardCheck, FaBoxOpen, FaCheckCircle, FaUserTie, FaTimesCircle } from "react-icons/fa"; // Import FaTimesCircle for Reject
import { DateTime } from "luxon";

const OrderStatusContext = createContext();

export const OrderStatusProvider = ({ children }) => {
  const [ordersStatus, setOrdersStatus] = useState(() => {
    const storedStatus = JSON.parse(localStorage.getItem("ordersStatus"));
    return storedStatus || {};
  });

  useEffect(() => {
    localStorage.setItem("ordersStatus", JSON.stringify(ordersStatus));
  }, [ordersStatus]);

  const updateOrderStatus = (orderId, statusKey, value) => {
    const currentDateTime = DateTime.now().setZone("Asia/Kolkata").toISO();
    setOrdersStatus((prev) => {
      const orderStatuses = prev[orderId] || {
        isAccepted: false,
        isReady: false,
        isAssigned: false,
        isRejected: false,
        showPlaceModal: false,
        confirmedDate: "",
        readyDate: "",
        assignedDate: "",
        completedDate: "",
        rejectedDate: "",
      };

      orderStatuses[statusKey] = value;
      if (value) {
        orderStatuses[`${statusKey}Date`] = currentDateTime;
      }

      return { ...prev, [orderId]: orderStatuses };
    });
  };


  

  
  const getOrderStatuses = (orderId) => {
    return ordersStatus[orderId] || {
      isAccepted: false,
      isReady: false,
      isAssigned: false,
      isRejected: false,
      showPlaceModal: false,
      confirmedDate: "",
      readyDate: "",
      assignedDate: "",
      completedDate: "",
      rejectedDate: "",
    };
  };

  const statuses = (orderId) => {
    const orderStatuses = getOrderStatuses(orderId);

    return [
      {
        label: "Confirmed",
        completed: orderStatuses.isAccepted,
        icon: <FaClipboardCheck className="text-white w-8 h-8" />,
        date: orderStatuses.confirmedDate
          ? DateTime.fromISO(orderStatuses.confirmedDate).toFormat("MMM dd, yyyy hh:mm:ss a")
          : "",
      },
      {
        label: "Rejected",
        completed: orderStatuses.isRejected,
        icon: <FaTimesCircle className="text-white w-8 h-8" />,
        date: orderStatuses.rejectedDate
          ? DateTime.fromISO(orderStatuses.rejectedDate).toFormat("MMM dd, yyyy hh:mm:ss a")
          : "",
      },
      {
        label: "Ready",
        completed: orderStatuses.isReady,
        icon: <FaBoxOpen className="text-white w-8 h-8" />,
        date: orderStatuses.readyDate
          ? DateTime.fromISO(orderStatuses.readyDate).toFormat("MMM dd, yyyy hh:mm:ss a")
          : "",
      },
      {
        label: "Assigned",
        completed: orderStatuses.isAssigned,
        icon: <FaUserTie className="text-white w-8 h-8" />,
        date: orderStatuses.assignedDate
          ? DateTime.fromISO(orderStatuses.assignedDate).toFormat("MMM dd, yyyy hh:mm:ss a")
          : "",
        employee: orderStatuses.isAssigned ? "John Doe" : "",
      },
      {
        label: "Completed",
        completed: orderStatuses.showPlaceModal,
        icon: <FaCheckCircle className="text-white w-8 h-8" />,
        date: orderStatuses.completedDate
          ? DateTime.fromISO(orderStatuses.completedDate).toFormat("MMM dd, yyyy hh:mm:ss a")
          : "",
      },
    ];
  };

  return (
    <OrderStatusContext.Provider value={{ getOrderStatuses, updateOrderStatus, statuses }}>
      {children}
    </OrderStatusContext.Provider>
  );
};

export const useOrderStatus = () => useContext(OrderStatusContext);
