import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { Element } from "react-scroll";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";
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

// OrderItem component
const OrderItem = ({ order, onSelect }) => {
 

  // Calculate the total quantity of items in the order
  const totalQuantity = order.orderDetails.reduce(
    (sum, item) => sum + item.product_quantity,
    0
  );

  return (
    <div
      className="p-3 mb-3  bg-white rounded-lg shadow-md flex justify-between items-center border border-gray-200 cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(order)}
    >
       <OrderNotification setOrders={setOrders} />
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
                : "bg-blue-100 text-blue-800"
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
      <div className="text-sm text-gray-500">
       
        <br />
        {order.orderMeta.orderDate}
      </div>
    </div>
  );
};

// OrderDetails component
const OrderDetails = ({ order }) => {
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
      <h3 className="text-xl font-semibold mb-4">Order Status History</h3>
      <div className="flex items-center">
        <FaCheckCircle className="w-6 h-6 text-green-500" />
        <span className="ml-2 text-sm font-semibold">Confirmed</span>
        <div className="flex-1 mx-4 h-px bg-gray-300"></div>
        <FaRegClock className="w-6 h-6 text-gray-400" />
        <span className="ml-2 text-sm text-gray-400">Ready</span>
      </div>
    </div>
  );
};

// CartSection component
const CartSection = ({ order, onComplete, onCancel ,pauseNotificationSound}) => {
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


  const [isAccepted, setIsAccepted] = useState(false);
 



  const handleAccept = () => {
    pauseNotificationSound(); // Stop the sound when "Accept" is clicked
    setIsAccepted(true);
    onComplete(order.number); // Call the onComplete function if needed
  };

  const handle = () =>{
    setShowPlaceModal(true);
  }

  const handleCancel = () => {
    setIsAccepted(false);
    onCancel(order.number); // Call the onCancel function if needed
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
        className="mt-auto p-4 bg-gray-700 text-white"
        style={{ marginTop: "620px" }}
      >
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Subtotal</span>
          <span>
            {order.orderMeta.paymentTendered}{" "}
            {order.orderDetails[0].product_currency}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span>Total</span>
          <span>
            {order.orderMeta.paymentTendered}{" "}
            {order.orderDetails[0].product_currency}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2 mt-4">
          {isAccepted ? (
            <>
              <button
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={handle}
              >
                Complete
              </button>
              <button
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                onClick={handleCancel}
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null); // Manage status here

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
  }

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
      setOrders((prevOrders) => [newOrder, ...prevOrders]); // Add new orders to the start of the array
      setSoundPlaying(true); // Play sound when a new order is received
    });



    return () => {
      socket.close();
      if (audio) {
        audio.pause(); // Ensure audio is stopped if the component unmounts
      }
    };
  }, [setOrders, audio]);





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

  return (
    <div className="flex h-screen">
    <OrderNotification setOrders={setOrders} />
   
      <div className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto">
      <Element name="orders-list">
          {orders.map((order) => (
            <OrderItem
              key={order._id}
              order={order}
              onSelect={setSelectedOrder}
            />
          ))}
        </Element>
      </div>

      <div className="w-1/3 h-full p-4 bg-white overflow-auto">
        {selectedOrder ? (
          <OrderDetails order={selectedOrder} />
        ) : (
          <p className="text-gray-500">Select an order to view details.</p>
        )}
      </div>

      <div className="w-1/3 h-full p-4 border-l border-gray-300 bg-white">
        <CartSection
          order={selectedOrder}
          onComplete={handleComplete}
          onCancel={handleCancel}
          pauseNotificationSound={pauseNotificationSound}
        />
      </div>
    </div>
  );
};

export default HomeOrdersSection;
