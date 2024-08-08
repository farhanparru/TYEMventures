// OrderContext.js
import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrderContext = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const [totalOrders, setTotalOrders] = useState(0);

  return (
    <OrderContext.Provider value={{ totalOrders, setTotalOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
