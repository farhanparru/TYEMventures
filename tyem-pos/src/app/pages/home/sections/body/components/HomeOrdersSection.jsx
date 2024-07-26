import React, { useEffect, useState } from "react";
import SearchInput from "../../../../../components/SearchInput";
import { UilAngleDown } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uniqueId } from "lodash";
import OrderItemCard from "./OrderItemCard";
import notificationSound from "../../../../../../assets/Moto Notification Ringtone Download - MobCup.Com.Co.mp3";
import { Empty } from "antd";
import Bill from "./printbill";
import io from 'socket.io-client'
import { fetchOrders } from "../../../../../../services/apiService";
import { getStoreUserData } from "../../../../../store/storeUser/storeUserSlice";
import {
  addOrder,
  getOrders,
  syncOrder,
  searchOrder,
  sell,
  setEditOrder,
} from "../../../store/orderSlice";
import { Detector } from "react-detect-offline";
import LoadingScreen from "../../../../../components/Loading";
import { Dropdown, notification, Popconfirm } from "antd";
import { clearSelectedTable } from "../../../store/tableSlice";
import moment from "moment";
import HomeTopBar from "../../HomeTopBar";
import {
  getSelectedBodySection,
  getSelectedTab,
} from "../../../store/homeSlice";

const HomeOrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [ordersToDisplay, setOrdersToDisplay] = useState([]);
  const { ordersList } = useSelector((state) => state.order);
  const { filteredOrders } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [printState, setPrintState] = React.useState(false);
  const [showSyncButton, setShowSyncButton] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const store_user = useSelector(getStoreUserData);
  const [notificationApi, contextHolder] = notification.useNotification();
  const selectedTab = useSelector(getSelectedBodySection);
  const actionBtnClass = `w-full text-[0.6rem] py-2 font-medium rounded-md text-white  transition-all ease-in-out hover:scale-95 `;
  const dispatch = useDispatch();
  const [searching, setSearching] = useState(false);
  const [orderFilterType, setOrderFilterType] = useState("All");

  useEffect(() => {
    if (ordersList?.length > 0) {
      // setSelectedOrder(ordersList[0]);
      // dispatch(setEditOrder(ordersList[0]));

      checkForUnsyncedOrders();
    }
  }, [ordersList]);

  useEffect(() => {
    const fetchLatestOrders = () => {
      dispatch(getOrders(store_user?.accessToken));
    };
    fetchLatestOrders();
    const intervalId = setInterval(fetchLatestOrders, 30000);

    // Clear the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (value) => {
    if (value == "" || value == null || value == undefined) {
      setSearching(false);
      dispatch(searchOrder(value));
      setSelectedOrder(ordersList[0]);
      // dispatch(setEditOrder(ordersList[0]));
    } else {
      setSearching(true);
      dispatch(searchOrder(value));
      if (filteredOrders.length > 0) {
        setSelectedOrder(filteredOrders[0]);
        // dispatch(setEditOrder(filteredOrders[0]));
      }
    }
  };

  const DropButton = ({ title }) => {
    return (
      <div
        onClick={() => setOrderFilterType(title)}
        key={title}
        className={`${
          title == orderFilterType ? "bg-ch-headers-500 " : "bg-ch-headers-300 "
        } px-3 flex text-white  items-center rounded-md cursor-pointer transition-all hover:scale-90 `}
      >
        <p className="text-sm font-medium ">{title}</p>
      </div>
    );
  };

  const checkForUnsyncedOrders = () => {
    let found = [];
    if (ordersList && ordersList.length > 0) {
      found = ordersList.find((el) => el.is_synced === 0);
    }

    if (found) {
      setShowSyncButton(true);
    } else {
      setShowSyncButton(false);
    }
  };

  const syncAllOrders = () => {
    setLoading(true);
    ordersList?.forEach((order) => {
      if (order.is_synced == 0) {
        syncSingleOrder(order);
        setTimeout(() => {
          dispatch(getOrders(store_user?.accessToken));
        }, 1000);
      }
    });
    setTimeout(() => {
      checkForUnsyncedOrders();
      setLoading(false);
    }, 2000);
  };

  const syncSingleOrder = (order) => {
    dispatch(
      syncOrder({
        token: store_user.accessToken,
        table: order.table ? order.table : 0,
        cartState: order.cartState,
        orderitems: order?.cartState?.orderitems,
        orderStatus: order.orderStatus,
        id: order.id,
        time: new Date().getTime(),
        paymentMethod: order?.cartState?.paymentMethod,
        paymentStatus: order.paymentStatus,
        customer: order.customer ? order.customer : 0,
        store_id: store_user.business.id,
        type: order.type,
      })
    );
    dispatch(
      sell({
        token: store_user.accessToken,
        table: order.table ? order.table : 0,
        cartState: order.cartState,
        orderitems: order?.cartState?.orderitems,
        orderStatus: order.orderStatus,
        id: order.id,
        time: new Date().getTime(),
        paymentMethod: order?.cartState?.paymentMethod,
        paymentStatus: order.paymentStatus,
        customer: order.customer ? order.customer : 0,
        store_id: store_user.business.id,
        type: order.type,
      })
    );

    notificationApi["success"]({
      message: "Order Placed Succesfully",
      description: "Order has been placed successfully ",
    });

    dispatch(clearSelectedTable());
  };

  const ipcRenderer = window.ipcRenderer;

  const printThermal = (selectedOrder) => {
    // console.log(cartState?.orderitems,'jjj');
    let finalItems = [];

    selectedOrder?.orderitems.forEach(function (item) {
      const readyToPush = [item.name, item.quantity, item.price];
      finalItems.push(readyToPush);
    });

    // console.log(finalItems);

    const data = [
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "TM POS",
        style: { fontWeight: "700", textAlign: "center", fontSize: "24px" },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: "Online Bill",
        style: {
          textDecoration: "underline",
          fontSize: "10px",
          textAlign: "center",
          color: "black",
        },
      },
      {
        type: "table",
        // style the table
        style: { border: "1px solid #ddd" },
        // list of the columns to be rendered in the table header
        tableHeader: ["Name", "Qty", "₹"],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: finalItems,
        // list of columns to be rendered in the table footer
        tableFooter: ["Name", "Qty", "₹"],
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: "#000", color: "white" },
        // custom style for the table body
        tableBodyStyle: { border: "0.5px solid #ddd" },
        // custom style for the table footer
        tableFooterStyle: { backgroundColor: "#000", color: "white" },
      },
      {
        type: "qrCode",
        value: "ORDER ID : 1234",
        height: 200,
        width: 200,
        style: { margin: "10 20px 20 20px" },
      },
    ];

    ipcRenderer.send("print", JSON.stringify(data));
  };

 


   // Initialize the audio object
   const audio = new Audio(notificationSound);

   // Function to play the notification sound
   const playNotificationSound = () => {
     audio.play();
   };



   useEffect(() => {
    const fetchAndSetOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchAndSetOrders();
  }, []);



  // Filter and update orders to display
  const getOrdersToDisplay = () => {
    let ordersToFilter = searching ? filteredOrders : orders;

    if (selectedTab === "online-orders") {
      ordersToFilter = ordersToFilter.filter(
        (order) => order.selling_price_group.toLowerCase() === "online"
      );
    } else if (selectedTab === "scheduled-orders") {
      ordersToFilter = ordersToFilter.filter(
        (order) => order.is_scheduled === 1
      );
    }

    if (orderFilterType === "All") {
      setSelectedOrder(ordersToFilter[0]);
      return ordersToFilter;
    } else {
      setSelectedOrder(ordersToFilter[0]);
      return ordersToFilter.filter(
        (order) =>
          order.orderStatus.toLowerCase() === orderFilterType.toLowerCase()
      );
    }
  };

  // Update ordersToDisplay whenever dependencies change
  useEffect(() => {
    setOrdersToDisplay(getOrdersToDisplay());
  }, [orders, searching, filteredOrders, selectedTab, orderFilterType]);


  useEffect(() => {
    const socket = io('http://tyem.word-network.site'); // Replace with your WebSocket URL

    socket.on('newOrder', (newOrder) => {
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      playNotificationSound(); // Play sound when a new order is received
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Convert time to 12-hour format
  // const getScheduleTime = (inputTime) => {
  //   const date = new Date(`1970-01-01T${inputTime}Z`);
  //   const time12hr = date.toLocaleTimeString("en-US", {
  //     hour: "numeric",
  //     minute: "numeric",
  //     second: "numeric",
  //     hour12: true,
  //   });
  //   return time12hr;
  // };

  

  return (
    <div>
      <HomeTopBar selectedTab="Orders" />
      <div className="flex flex-col gap-2 h-full w-full overflow-x-scroll">
        {loading ? (
          <LoadingScreen message="Syncing Orders" />
        ) : (
          <>
            <div className="flex mt-100 w-full gap-2 border-b border-gray-200 p-3">
              <SearchInput
                className="flex-1"
                placeholder="Search Order Number"
                onInputChange={(value) => handleSearch(value.target.value)}
              />
              {['All', 'Draft', 'Received', 'Final'].map(item => (
                <DropButton key={item} title={item} />
              ))}
            </div>

            <div
              className={`flex flex-1 h-full ${
                ordersToDisplay.length === 0 ? 'items-center justify-center' : ''
              }`}
            >
              {ordersToDisplay.length === 0 ? (
                <Empty description="Please place orders by selecting table to see order details" />
              ) : (
                <>
                  <div className="flex h-full flex-1 flex-col w-[30%] overflow-y-auto border-r gap-2 border-gray-200">
                    <div className="flex justify-between items-center mx-2">
                      <p className="text-md font-bold">{ordersToDisplay.length} Orders</p>
                    </div>
                    <div className="p-3 gap-2 overflow-y-scroll h-100">
                      {ordersToDisplay.map(order => (
                        <OrderItemCard
                          order={order}
                          key={order.id}
                          onClick={setSelectedOrder}
                        />
                      ))}
                      <div style={{ height: '500px' }}></div>
                    </div>
                  </div>
                  {selectedOrder ? (
                    <div className="flex flex-col gap-3 p-3 w-[70%] h-100 overflow-y-scroll">
                      <div className="flex justify-between items-center mx-2 border-b pb-2 border-slate-200">
                        <p className="text-xl font-bold">Order Details</p>
                      </div>
                      <div className="flex bg-chicket-item rounded-lg flex-col gap-2 p-3 mt-4 border-b border-slate-200 pb-2">
                        <div className="flex justify-between items-center text-black mt-3">
                          <p className="text-lg">Order ID</p>
                          <p className="text-lg font-normal">
                            {selectedOrder.is_synced === 1
                              ? selectedOrder.orderDetails.posOrderId
                              : selectedOrder.id}
                          </p>
                        </div>
                        {selectedOrder.customer ? (
                          <div className="flex justify-between items-center text-black mt-3">
                            <p className="text-lg">Customer</p>
                            <p className="text-lg font-normal">
                              {selectedOrder.customer.name}
                            </p>
                            <p className="text-lg font-normal">
                              {selectedOrder.customer.email}
                            </p>
                            <p className="text-lg font-normal">
                              {selectedOrder.customer.phone}
                            </p>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center text-black mt-3">
                            <p className="text-lg">Customer</p>
                            <p className="text-lg font-normal">No Customer Selected</p>
                          </div>
                        )}
                        {/* Other details */}
                      </div>
                      <button
                        className="bg-orange-500 hover:bg-orange-600 p-2 flex gap-2 justify-center"
                        onClick={() => {
                          // Implement print functionality
                        }}
                      >
                        <p className="text-sm font-semibold mt-[0.2rem] text-white">
                          Print Bill
                        </p>
                      </button>
                      {selectedOrder.is_synced === 1 ? (
                        <button className="w-full bg-green-600 text-white font-bold py-2 rounded-md">
                          Order Successfully Synced
                        </button>
                      ) : (
                        <button
                          onClick={() => syncSingleOrder(selectedOrder)}
                          className="w-full bg-red-600 text-white font-bold py-2 rounded-md"
                        >
                          Order Not Synced. Click here to sync
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 p-3 w-[70%] h-100 overflow-y-scroll">
                      No Orders Selected
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeOrdersSection;