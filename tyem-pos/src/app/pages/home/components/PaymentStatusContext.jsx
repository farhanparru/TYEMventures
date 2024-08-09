import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context
const PaymentStatusContext = createContext();

// Create a provider component
export const PaymentStatusProvider = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState({});

  // Load payment statuses from localStorage on mount
  useEffect(() => {
    const storedStatuses = JSON.parse(localStorage.getItem('paymentStatuses')) || {};
    setPaymentStatus(storedStatuses);
  }, []);

  // Function to update the payment status
  const updatePaymentStatus = (orderId, status) => {
    const newStatus = { ...paymentStatus, [orderId]: status };
    setPaymentStatus(newStatus);
    localStorage.setItem('paymentStatuses', JSON.stringify(newStatus));
  };

  return (
    <PaymentStatusContext.Provider value={{ paymentStatus, updatePaymentStatus }}>
      {children}
    </PaymentStatusContext.Provider>
  );
};

// Create a custom hook to use the PaymentStatusContext
export const usePaymentStatus = () => {
  return useContext(PaymentStatusContext);
};
