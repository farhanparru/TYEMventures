import React, { useEffect, useState } from "react";
import SearchInput from "../../../../../components/SearchInput";
import { UilAngleDown } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uniqueId } from "lodash";
import { Empty } from "antd";
import Bill from "./printbill";
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
  const { ordersList } = useSelector((state) => state.order);
  const { filteredOrders } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [printState, setPrintState] = React.useState(false);
  const [showSyncButton, setShowSyncButton] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
        className={`${title == orderFilterType ? "bg-ch-headers-500 " : "bg-ch-headers-300 "} px-3 flex text-white  items-center rounded-md cursor-pointer transition-all hover:scale-90 `}
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
  const OrderItemCard = ({ order }) => {
    const date = new Date(order.time);
    const isSelected =
      order.is_synced == 1
        ? order.order_id === selectedOrder?.order_id
        : order.id === selectedOrder?.id;
    return (
      <div
        onClick={() => {
          setSelectedOrder(order);
          dispatch(setEditOrder(order));
        }}
        className={` p-3 rounded-md flex flex-col gap-2 mt-3 text-white cursor-pointer transition-all hover:scale-90 ${isSelected ? "bg-ch-headers-500" : "bg-ch-headers-300 hover:bg-ch-headers-500"
          }`}
      >
        <div className="flex items-center justify-between">

          <p className="text-sm font-bold">
            #{order?.is_synced == 1 ? order.order_id : order.id}
            {order.is_synced == 0 && (
              <span class="bg-red-100  text-xs ml-5 font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-500 text-white">
                Not Synced Online
              </span>
            )}

          </p>
          <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{order.selling_price_group !== "" ?? "Dine In"}</span>
        </div>
        <div className="flex items-center justify-between">

          <p className="text-sm font-medium">
            {order?.orderitems?.length} Items | ₹{" "}

            <strong className="text-lg font-bold">

              {parseFloat(order.cartState?.totalPayableAmount).toFixed(3)}
            </strong>
            |{" "}
            {order?.cartState?.paymentMethod}

          </p>
          {order?.is_scheduled == 1 &&

            <span class="inline-flex items-center rounded-md bg-orange-300 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Scheduled Order</span>
          }

        </div>
        {order?.table !== 0 ?

          <p className="text-lg font-bold">
            {order?.table}

          </p>
          : (null)}

        {/* {order?.is_synced == 1 ? ( */}
        <p className="text-sm font-medium">
          {moment(order.date).format("YYYY/MM/DD  h:mm a")}
        </p>
        {/* ) : (
          <p className="text-sm font-medium">
            {date.getHours() +
              ":" +
              date.getMinutes() +
              ", " +
              date.toDateString()}
          </p>
        )} */}

        {order.orderStatus == "draft" &&
          <badge class="bg-yellow-500 px-5 py-1 min-w-20 rounded-md text-center font-bold">Draft</badge>
        }

        {order.orderStatus == "received" &&
          <badge class="bg-orange-500 px-5 py-1 min-w-20 rounded-md text-center font-bold">Received</badge>
        }

        {order.orderStatus == "final" &&
          <badge class="bg-green-500 px-5 py-1 min-w-20 rounded-md text-center font-bold">Completed</badge>
        }
      </div>
    );
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

  const getOrdersToDisplay = () => {
    let ordersToFilter = searching ? filteredOrders : ordersList;

    if (selectedTab == "online-orders") {
      ordersToFilter = ordersToFilter.filter(order => order.selling_price_group.toLowerCase() === "online")
    } else if (selectedTab == "scheduled-orders") {
      ordersToFilter = ordersToFilter.filter(order => order.is_scheduled == 1)

    }
    // alert(selectedTab)
    if (orderFilterType === "All") {
      setEditOrder(ordersToFilter[0])
      return ordersToFilter;
    } else {
      setEditOrder(ordersToFilter[0])

      return ordersToFilter.filter(order => order.orderStatus.toLowerCase() === orderFilterType.toLowerCase());
    }
  };

  const ordersToDisplay = getOrdersToDisplay();

  const getScheduleTime = (inputTime) => {
    // Assuming inputTime is the time string in 24-hour format

    // Creating a Date object. We need a full date string to avoid errors, so adding a dummy date.
    const date = new Date(`1970-01-01T${inputTime}Z`);

    // Formatting to 12-hour time format including AM/PM
    const time12hr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    return time12hr

  }
  return (
    <Detector
      render={({ online }) => (
        <>
          <HomeTopBar selectedTab={selectedTab} />

          <div className="flex flex-col gap-2 h-full w-full overflow-x-scroll">
            {loading == true ? (
              <LoadingScreen message="Syncing Orders" />
            ) : (
              <>
                <div className="flex mt-100  w-full gap-2 border-b border-gray-200 p-3 ">
                  <SearchInput
                    className="flex-1"
                    placeholder={"Search Order Number"}
                    onInputChange={(value) => handleSearch(value.target.value)}
                  />
                  {["All", "Draft", "Received", "Final"].map((item, index) => {
                    return <DropButton key={item} title={item} />;
                  })}
                </div>

                <div
                  className={`flex flex-1 h-full  ${ordersList?.length === 0
                    ? " items-center justify-center"
                    : ""
                    }`}
                >
                  {ordersToDisplay?.length === 0 ? (
                    <Empty description="Please place orders by selecting table to see order details" />
                  ) : (
                    <>
                      <div className="flex h-full flex-1 flex-col w-[30%] overflow-y-auto border-r gap-2 border-gray-200 ">
                        <div className="flex justify-between items-center mx-2">
                          <p className="text-md font-bold">
                            {ordersToDisplay?.length} Orders
                          </p>
                          {/* <DropButton title={"Date Range"} /> */}
                        </div>
                        {online && showSyncButton && (
                          <>
                            <button
                              className="bg-red-500 rounded-md  hover:bg-red-600 m-2 p-2 flex gap-2 justify-center"
                              onClick={() => {
                                syncAllOrders();
                              }}
                            >
                              <p className="text-base font-bold  text-white">
                                Sync all orders
                              </p>
                            </button>
                            <p className="text-md font-bold">Unsynced Orders</p>
                            <div className="flex flex-col p-3 gap-2 h-full overflow-y-auto">

                              {
                                ordersToDisplay && ordersToDisplay?.length > 0 && ordersToDisplay?.map((order, index) => {
                                  return (
                                    <>
                                      {order.is_synced == 0 && (
                                        <OrderItemCard
                                          order={order}
                                          key={order.id}
                                        />
                                      )}
                                    </>
                                  );
                                })}
                            </div>
                          </>
                        )}
                        {online && showSyncButton && (
                          <p className="text-md font-bold">All Orders</p>
                        )}
                        <div className="p-3 gap-2 overflow-y-scroll h-100">

                          {ordersToDisplay && ordersToDisplay?.length > 0 && ordersToDisplay?.map((order, index) => {
                            return (
                              <OrderItemCard order={order} key={order.id} />
                            );
                          })}
                          <div style={{ height: "500px" }}></div>
                        </div>
                      </div>
                      {selectedOrder ?
                        <div className="flex flex-col  gap-3 p-3 w-[70%] h-100 overflow-y-scroll0">
                          <div className="flex justify-between items-center mx-2 border-b pb-2 border-slate-200">
                            <p className="text-xl font-bold">Order Details</p>
                          </div>
                          <div className="flex bg-chicket-item rounded-lg flex-col gap-2 p-3 mt-4 border-b border-slate-200 pb-2">
                            <div className="flex justify-between items-cente text-black mt-3 ">
                              <p className="text-lg ">Order id</p>
                              <p className="text-lg font-normal">
                                {selectedOrder?.is_synced == 1
                                  ? selectedOrder?.order_id
                                  : selectedOrder?.id}
                              </p>
                            </div>
                            {selectedOrder && selectedOrder.customer ? (
                              <div className="flex justify-between items-cente text-black mt-3 ">
                                <p className="text-lg ">Customer</p>
                                <p className="text-lg font-normal">
                                  {selectedOrder?.customer?.name}
                                </p>
                              </div>
                            ) : (
                              <div className="flex justify-between items-cente text-black mt-3 ">
                                <p className="text-lg ">Customer</p>
                                <p className="text-lg font-normal">
                                  No Customer Selected
                                </p>
                              </div>
                            )}
                            <div className="flex justify-between items-cente text-black mt-3 ">
                              <p className="text-lg ">No of Items</p>
                              <p className="text-lg font-normal">
                                {selectedOrder?.orderitems?.length}
                              </p>
                            </div>
                            <div className="flex justify-between items-cente text-black mt-3 ">
                              <p className="text-lg ">Final Total</p>
                              <p className="text-lg font-normal">
                                {selectedOrder?.is_synced == 1
                                  ? parseFloat(
                                    selectedOrder?.cartState.totalPayableAmount
                                  ).toFixed(3)
                                  : selectedOrder?.cartState?.totalPayableAmount}
                                {/* ₹ {selectedOrder?.totalAmount.toFixed(3)} */}
                              </p>
                            </div>
                            <div className="flex justify-between items-cente text-black mt-3 ">
                              <p className="text-lg ">Payment Method</p>
                              <p className="text-lg font-normal">
                                {selectedOrder?.cartState?.paymentMethod}
                              </p>
                            </div>
                            <div className="flex justify-between items-cente text-black mt-3 ">
                              <p className="text-lg ">Payment Status</p>
                              <p className="text-lg font-normal">
                                {selectedOrder?.paymentStatus}
                              </p>
                            </div>
                            <div className="flex justify-between items-cente text-black mt-3 ">
                              <p className="text-lg ">Invoice Number</p>
                              <p className="text-lg font-normal">
                                {selectedOrder?.is_synced == 1
                                  ? selectedOrder.invoice_no
                                  : uniqueId() + uniqueId() + uniqueId()}
                              </p>
                            </div>
                          </div>
                          {selectedOrder?.is_scheduled == 1 &&

                            <>
                              <div className="flex justify-between items-center mx-2 border-b pb-2 border-slate-200">
                                <p className="text-xl font-bold">Schedule Details</p>
                              </div>
                              <div className="flex bg-chicket-item rounded-lg flex-col gap-2 p-3 mt-4 border-b border-slate-200 pb-2">
                                <div className="flex justify-between items-cente text-black mt-3 ">
                                  <p className="text-lg ">Schedule Date</p>
                                  <p className="text-lg font-normal">
                                    {selectedOrder?.schedule_date}
                                  </p>
                                </div>
                                <div className="flex justify-between items-cente text-black mt-3 ">
                                  <p className="text-lg ">Schedule Time</p>
                                  <p className="text-lg font-normal">
                                    {getScheduleTime(selectedOrder?.schedule_time)}
                                    {/* { moment(selectedOrder?.schedule_time, "YYYY-MM-DD HH:mm:ss").format("hh:mm:ss A")} */}
                                  </p>
                                </div>
                              </div>
                            </>
                          }
                          <div className="flex justify-between items-center mx-2 border-b pb-2 border-slate-200">
                            <p className="text-xl font-bold">
                              Order Items Details
                            </p>
                          </div>
                          <div className="gap-2 px-3 mt-4 border-b border-slate-200 pb-2">
                            {selectedOrder?.orderitems?.map((item, index) => {
                              return (
                                <div className="flex py-2 justify-between items-cente text-slate-600">
                                  <h2 className="text-xs font-bold">
                                    {item.quantity} x {item.name}
                                    <br />
                                    {item?.is_refunded == 1 &&
                                      <span class="inline-flex items-center rounded-md bg-red-400 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-500/10">REFUNDED</span>
                                    }
                                  </h2>
                                  <p className="text-md font-normal">
                                    ₹ {item.totalPrice}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <>
                            {/* {printState == true && (
                          <Bill selectedOrder={selectedOrder} />
                        )} */}
                            <button
                              className={`${actionBtnClass}  bg-orange-500   hover:bg-orange-600 p-2 flex gap-2 justify-center `}
                              onClick={() => {
                                // setPrintState(true);
                                // printThermal(selectedOrder);
                                // setTimeout(() => {
                                //   window.print();
                                // }, 100);
                                // setTimeout(() => {
                                //   setPrintState(false);
                                // }, 500);
                                // dispatch(selectBodySection("home"));
                              }}
                            >
                              <p className="text-sm font-semibold mt-[0.2rem] text-white">
                                Print Bill
                              </p>
                            </button>
                            {/* <button
                          className={`${actionBtnClass}  bg-orange-500   hover:bg-orange-600 p-2 flex gap-2 justify-center `}
                          onClick={() => {
                            // dispatch(selectBodySection("home"));
                          }}
                        >
                          <p className="text-sm font-semibold mt-[0.2rem] text-white">
                            Add More Items to Order
                          </p>
                        </button> */}
                            {selectedOrder?.is_synced == 1 ? (
                              <button className="w-full bg-green-600 text-white font-bold py-2 rounded-md">
                                Order Successfully Synced
                              </button>
                            ) : (
                              <button
                                onClick={() => syncSingleOrder(selectedOrder)}
                                className="w-full bg-red-600 text-white font-bold py-2 rounded-md"
                              >
                                Order Not Synced . Click here to sync
                              </button>
                            )}
                          </>
                        </div>
                        : (
                          <div className="flex flex-col  gap-3 p-3 w-[70%] h-100 overflow-y-scroll0">

                            No Orders Selected
                          </div>
                        )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}


    />
  );
};

export default HomeOrdersSection;
