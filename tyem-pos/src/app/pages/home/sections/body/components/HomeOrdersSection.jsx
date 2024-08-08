import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { Element } from "react-scroll";
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import notificationSound from "../../../../../../assets/Moto Notification Ringtone Download - MobCup.Com.Co.mp3";
import {
  fetchOrders,
  connectWebSocket,
} from "../../../../../../services/apiService.js";
import { useDispatch, useSelector } from "react-redux";
import CartNumpad from "../../../../../../app/pages/home/components/CartNumpad.jsx";
import CustomModal from "../../../../../components/CustomModal.jsx";
import { clearCart, setPaymentMethod } from "../../../store/cartSlice.js";
import OrderNotification from "./OrderNotification.jsx";
import { DateTime } from "luxon";
import Drawer  from '../../../../../layout/drawer/Drawer.jsx'

// OrderItem component
const OrderItem = ({ order, onClick,isMostRecent  }) => {
  const totalQuantity = order.orderDetails.reduce(
    (sum, item) => sum + item.product_quantity,
    0
  );

   // Convert UTC to IST
   const utcDate = DateTime.fromISO(order.orderMeta.orderDate, { zone: "utc" });
   const zonedDate = utcDate.setZone("Asia/Kolkata");
   const formattedDate = zonedDate.toFormat("MMM dd, yyyy");
   const formattedTime = zonedDate.toFormat("hh:mm:ss a");

  
   
   return (
    <div
    className={`p-3 mb-3 rounded-lg shadow-md flex justify-between items-center border cursor-pointer hover:bg-blue-100 hover:border-blue-200
      ${isMostRecent ? 'bg-blue-400 border-blue-600' : 'bg-white border-gray-200'}`}
    onClick={() => onClick(order)}
    aria-label={`Order ${order.orderMeta?.posOrderId} details`}
  >
      <div>
        <h3 className="text-lg font-semibold">
          Order #{order.orderMeta?.posOrderId} | INV# {order._id}
        </h3>
        <p className="text-sm">
          {totalQuantity} Item{totalQuantity > 1 ? "s" : ""} |
          {order.orderMeta?.paymentTendered}{" "}
          {order.orderDetails[0].product_currency} | {order.orderMeta.orderType}
        </p>
  
        <div className="flex items-center mt-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              order.orderMeta.paymentStatus === "Accepted"
                ? "bg-green-100 text-green-800"
                : order.orderMeta.paymentStatus === "Rejected"
                ? "bg-red-100 text-red-800"
                : order.orderMeta.paymentStatus === "Completed"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {order.orderMeta.paymentStatus}
          </span>
  
          {order.new && (
            <span className="ml-2 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
              New
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-md font-semibold text-gray-700">{formattedDate}</h1>
        <h2 className="text-sm text-gray-600">{formattedTime}</h2>
      </div>
    </div>
  );
};

const OrderStatusHistory = ({ statuses }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Order Status History</h3>
      <div className="relative">
        {statuses.map((status, index) => (
          <div key={index} className="flex items-center mb-4">
            <div className="flex flex-col items-center">
              {status.completed ? (
                <FaCheckCircle className="w-6 h-6 text-blue-500" />
              ) : (
                <FaRegCircle className="w-6 h-6 text-gray-400" />
              )}
              {index < statuses.length - 1 && (
                <div className={`h-12 border-l-2 ${status.completed ? 'border-blue-500' : 'border-gray-400'}`}></div>
              )}
            </div>
            <div className="ml-2">
              <span className="block text-sm font-semibold">{status.label}</span>
              {status.date && <span className="block text-sm text-gray-500">{status.date}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// OrderDetails component
const OrderDetails = ({ order }) => {
  const statuses = [
    { label: 'Confirmed', completed: true, date: 'Fri, Aug 2, 2024, 7:58 AM' },
    { label: 'Ready', completed: true, date: 'Mon, Aug 5, 2024, 8:17 AM' },
    { label: 'Completed', completed: false }
  ];
  return (
    <div className="p-3 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Order Details</h3>
      <div className="mb-4">
        <h4 className="font-semibold">Order ID</h4>
        <p>#{order.orderMeta.posOrderId}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Invoice Number</h4>
        <p>{order._id}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Total Items</h4>
        <p>{order.orderDetails.length}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Total Amount</h4>
        <p>
          {order.orderMeta.paymentTendered}{" "}
          {order.orderDetails[0].product_currency}
        </p>
      </div>
      <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
      <div className="mb-4">
        <h4 className="font-semibold">Name</h4>
        <p>{order.customer.name}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Phone</h4>
        <p>{order.customer.phone}</p>
      </div>
      <OrderStatusHistory statuses={statuses} />
    </div>
  );
};

// CartSection component
const CartSection = ({
  order,
  onComplete,
  onCancel,
  pauseNotificationSound,
  orders,
  updateOrderStatus,
  onOrderAccept, // New prop
}) => {
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [paymentMethods, setpaymentMethods] = useState([]);
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const selectedCustomer = useSelector(
    (state) => state.customer.selectedCustomer
  );

  let paymentMethod;
  switch (cartState.paymentMethod) {
    case "Cash":
      paymentMethod = "cash";
      break;
    case "Card":
      paymentMethod = "card";
      break;
    default:
      paymentMethod = "cash";
      break;
  }

  const [isAccepted, setIsAccepted] = useState(
    order?.orderMeta?.paymentStatus === "Accepted"
  );

  const handleAccept = (orderId) => {
    pauseNotificationSound(); // Stop the sound when "Accept" is clicked
    setIsAccepted(true);
    onComplete(order.number); // Call the onComplete function if needed
    updateOrderStatus(orderId, "Accepted");
    onOrderAccept(orderId); // Decrease the badge count in HomeOrdersSection
  };

  const handleComplete = (orderId) => {
    setShowPlaceModal(true);
    updateOrderStatus(orderId, "Completed");
  };

  const handleReject = (orderId) => {
    setIsAccepted(false);
    onCancel(order.number); // Call the onCancel function if needed
    updateOrderStatus(orderId, "Rejected");
  };

  if (!order) {
    return (
      <div className="p-4 bg-gray-100 text-gray-500 rounded-lg">
        Select an order to view cart items.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-2 bg-gray-800 text-white">
      {order.orderDetails.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-white rounded-md text-black mb-4"
        >
          <span className="font-semibold">{item.product_name}</span>
          <span>{item.product_quantity}</span>
          <span>{order.orderMeta.paymentTendered}</span>
          <span>{item.product_currency}</span>
        </div>
      ))}

      <div
        style={{ marginTop: "37.5rem" }}
        className="p-6 bg-gray-700 text-white rounded-lg"
      >
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Subtotal</span>
          <span>
            {order.orderMeta.paymentTendered}{" "}
            {order.orderDetails[0].product_currency}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total</span>
          <span>
            {order.orderMeta.paymentTendered}{" "}
            {order.orderDetails[0].product_currency}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4 mt-6">
          {isAccepted ? (
            <>
              <button
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => handleComplete(order._id)}
              >
                Ready
              </button>
              <button
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                onClick={() => handleReject(order._id)}
              >
                complited
              </button>
            </>
          ) : (
            <>
              <button
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                onClick={() => handleAccept(order._id)}
              >
                Accept
              </button>
              <button
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                onClick={() => handleReject(order._id)}
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {showPlaceModal && (
        <CustomModal
          onClose={() => {
            setShowPlaceModal(false);
          }}
        >
          <div className="flex flex-col p-10" style={{ width: "1000px" }}>
            <div className="flex items-center justify-between border-b-2 border-gray-300 pb-5">
              <div className="flex flex-col w-full">
                <h3 className="text-lg font-bold">
                  Order ID : #{order.orderId}
                </h3>
                <h5 className="text-lg font-bold">
                  {cartState?.orderitems?.length} Items
                </h5>
                <h5 className="text-lg font-bold">{selectedCustomer?.name}</h5>
              </div>
              <div className="flex flex-col items-center w-full justify-end">
                <div className="flex items-center w-full justify-end">
                  <h3 className="text-lg font-medium">Payable Amount :</h3>
                  <h2 className="text-2xl font-extrabold text-green-500 ml-10">
                    ₹ {cartState.totalPayableAmount}
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex text-white items-center border-b-2 border-gray-300 ">
              <div className="text-black text-lg font-semibold w-full">
                Select Payment Mode
              </div>
              <div className="flex text-white items-center w-full">
                {paymentMethods.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => dispatch(setPaymentMethod("cash"))}
                      className={`
                        font-bold  text-center
                        text-base p-3 
                          cursor-pointer w-full
                          
                          ${
                            cartState?.paymentMethod &&
                            cartState?.paymentMethod == item
                              ? "bg-ch-headers-500 "
                              : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                          }
                          `}
                    >
                      item
                    </div>
                  );
                })}
                <div
                  onClick={() => dispatch(setPaymentMethod("cash"))}
                  className={`
                        font-bold  text-center
                        text-base p-3 
                          cursor-pointer w-full
                          
                          ${
                            cartState?.paymentMethod &&
                            cartState?.paymentMethod == "cash"
                              ? "bg-ch-headers-500 "
                              : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                          }
                          `}
                >
                  Cash
                </div>
                <div
                  onClick={() => dispatch(setPaymentMethod("card"))}
                  className={`
                        font-bold  text-center
                        text-base p-3 
                          cursor-pointer w-full border-l-2 border-white
                          
                          ${
                            cartState?.paymentMethod &&
                            cartState?.paymentMethod == "card"
                              ? "bg-ch-headers-500 "
                              : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                          }
                          `}
                >
                  CARD
                </div>
                <div
                  onClick={() => dispatch(setPaymentMethod("Split"))}
                  className={`
                        font-bold  text-center
                        text-base p-3 
                          cursor-pointer w-full border-l-2 border-white
                          
                          ${
                            cartState?.paymentMethod &&
                            cartState?.paymentMethod == "Split"
                              ? "bg-ch-headers-500 "
                              : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                          }
                          `}
                >
                  Split
                </div>
                <div
                  onClick={() => dispatch(setPaymentMethod("Talabat"))}
                  className={`
                      font-bold  text-center
                      text-base p-3 
                        cursor-pointer w-full border-l-2 border-white
                        
                        ${
                          cartState?.paymentMethod &&
                          cartState?.paymentMethod == "Talabat"
                            ? "bg-ch-headers-500 "
                            : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                        }
                        `}
                >
                  Talabat
                </div>
                <div
                  onClick={() => dispatch(setPaymentMethod("other"))}
                  className={`
                      font-bold  text-center
                      text-base p-3 
                        cursor-pointer w-full border-l-2 border-white
                        
                        ${
                          cartState?.paymentMethod &&
                          cartState?.paymentMethod == "other"
                            ? "bg-chicket-500 "
                            : "hover:bg-ch-headers-500 hover:text-white bg-ch-headers-300"
                        }
                        `}
                >
                  Other
                </div>
              </div>
            </div>
            <div className="flex  mt-5">
              <div className="home__cart-items flex flex-col  flex-auto gap-1  w-[60%] overflow-y-scroll "></div>
            </div>

            <div className="flex mt-5">
              <div className="home__cart-items flex flex-col flex-auto gap-1 w-[60%] overflow-y-scroll">
                <div className="flex items-center justify-between mt-5">
                  <div className="text-black text-sm font-medium">Subtotal</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {order.orderMeta.paymentTendered}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-sm font-medium">Discount</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {parseFloat(cartState?.discount)?.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-sm font-medium">VAT</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {cartState?.tax.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-sm font-medium">
                    Amount to be returned
                  </div>
                  <div className="text-green-500 text-lg font-bold">
                    ₹ {cartState?.amountToBeReturned.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-sm font-medium">
                    Balance Due
                  </div>
                  <div className="text-chicket-500 text-lg font-bold">
                    ₹ 0.000
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-black text-lg font-semibold">
                    Grand Total
                  </div>
                  <div className="text-black text-lg font-bold">
                    ₹ {cartState?.totalPayableAmount.toFixed(3)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="bg-yellow-500 mt-5 hover:bg-yellow-400 p-2 flex gap-2 justify-center items-center text-white w-32 h-10"
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: "READYTOBILL",
                        floor: "BASEMENT",
                      };
                      dispatch(setselectedTable(table));
                      setTimeout(() => placeOrder(2), 200);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="bg-blue-500 mt-5 hover:bg-blue-400 p-2 flex gap-2 justify-center items-center text-white w-32 h-10"
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: "READYTOBILL",
                        floor: "BASEMENT",
                      };
                      dispatch(setselectedTable(table));
                      setTimeout(() => placeOrder(2), 200);
                    }}
                  >
                    Receipt
                  </button>
                  <button
                    className="bg-green-500 mt-5 hover:bg-green-400 p-2 flex gap-2 justify-center items-center text-white w-32 h-10"
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: "READYTOBILL",
                        floor: "BASEMENT",
                      };
                      dispatch(setselectedTable(table));
                      setTimeout(() => placeOrder(3), 200);
                    }}
                  >
                    KOT & Print
                  </button>
                </div>
              </div>

              <div className="w-[40%]">
                <CartNumpad
                  totalPayableAmount={cartState?.totalPayableAmount}
                />
              </div>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

// Main HomeOrdersSection component
const HomeOrdersSection = () => {

  
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(orders.length > 0 ? orders[0] : null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [orderStatus, setOrderStatus] = useState(); // Manage status here
 

  // Play notification sound
  const playNotificationSound = () => {
    const newAudio = new Audio(notificationSound);
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);

    setTimeout(() => {
      newAudio.pause();
      newAudio.currentTime = 0;
      setSoundPlaying(false);
    }, 5 * 60 * 1000); // Stop sound after 5 minutes
  };

  const pauseNotificationSound = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setSoundPlaying(false);
    }
  };

  // Status Update
  const updateOrderStatus = (orderId, status) => {
    setOrders(
      orders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              orderMeta: { ...order.orderMeta, paymentStatus: status },
            }
          : order
      )
    );
  };

  // Fetch orders and set up WebSocket
  // Fetch orders and set up WebSocket
  useEffect(() => {
    const fetchAndSetOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data); // Set the fetched orders to state
      } catch (error) {
        console.error("Error fetching initial orders:", error);
      }
    };

    fetchAndSetOrders();

    const socket = connectWebSocket((newOrder) => {
      setOrders((prevOrders) => {
        const updatedOrders = [newOrder, ...prevOrders]; // Add new order to the top
        setSoundPlaying(true); // Play sound when a new order is received
        return updatedOrders;
      });
    });

    return () => {
      socket.close();
      if (audio) {
        audio.pause(); // Ensure audio is stopped if the component unmounts
      }
    };
  }, [audio]);

  // Handle sound playing state
  useEffect(() => {
    if (soundPlaying) {
      playNotificationSound();
    }
  }, [soundPlaying]);

  const handleComplete = (orderId) => {
    console.log(`Order ${orderId} accepted`);
    setOrderStatus("Completed");
  };

  const handleCancel = (orderId) => {
    console.log(`Order ${orderId} rejected`);
    setOrderStatus("Cancelled");
  };

  // Function to sort orders by posOrderId in descending order
  const sortOrdersByPosOrderId = (orders) => {
    return orders
      .slice()
      .sort((a, b) => b.orderMeta.posOrderId - a.orderMeta.posOrderId);
  };

  // Sort orders whenever the orders prop changes
  const sortedOrders = sortOrdersByPosOrderId(orders);
  const mostRecentOrder = sortedOrders[0]; // Assuming the first item is the most recent after sorting
  // console.log(sortedOrders,"sortedOrders");
  const onOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleOrderAccept = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
    setTotalOrders((prevCount) => prevCount - 1); // Decrease the badge count
  };

  return (
    <div className="flex h-screen">
      <OrderNotification setOrders={setOrders} />
      <div
        id="order-list"
        className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto"
      >
        {sortedOrders.map((order) => (
          <OrderItem 
            key={order._id} 
            order={order}
            onClick={() => setSelectedOrder(order)} // Optional: Allows user to select a different order
            selected={selectedOrder?._id === order._id}
            isMostRecent={selectedOrder && order._id === selectedOrder._id} // Highlight the selected order
          />
        ))}
      </div>
      <div className="w-1/3 h-full p-4 bg-white overflow-auto">
        {/* Always render OrderDetails with selected or most recent order */}
        <OrderDetails order={selectedOrder} />
      </div>
      <div className="w-1/3 h-full p-4 border-l border-gray-300 bg-white">
        {/* Always render CartSection with selected or most recent order */}
        <CartSection
          order={selectedOrder}
          onComplete={handleComplete}
          onCancel={handleCancel}
          pauseNotificationSound={pauseNotificationSound}
          orders={orders}
          updateOrderStatus={updateOrderStatus}
          onOrderAccept={handleOrderAccept}
        />
      </div>
    </div>
  );
};

export default HomeOrdersSection;