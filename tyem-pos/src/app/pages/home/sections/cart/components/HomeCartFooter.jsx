import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, notification, Popconfirm } from "antd";
import CartNumpad from "../../../components/CartNumpad";
import axios from "axios";
import moment from "moment";

import {
  UilAngleDoubleUp,
  UilAngleDoubleDown,
  UilTrashAlt,
} from "@iconscout/react-unicons";
import {
  UilCreditCard,
  UilMoneyWithdraw,
  UilBars,
  UilLayersAlt,
  UilQrcodeScan,
  UilCheckCircle,
  UilPauseCircle,
  UilArrowCircleRight,
  UilCalender
} from "@iconscout/react-unicons";
import { clearCart, setPaymentMethod } from "../../../store/cartSlice";
import useCollapse from "react-collapsed";
import {
  FLOORS,
  ORDERSTATES,
  PAYMENTSTATUS,
  TABLESTATES,
} from "../../../constants";
import { addOrder, clearEditOrder, getOrders, pushOrder, sell, sellUpdate } from "../../../store/orderSlice";
import {
  clearSelectedTable,
  getBookedTableList,
  getBookedTablesForToday,
  getFloorsTables,
  getselectedTable,
  groupTables,
  setselectedTable,
  updateTableStatus,
} from "../../../store/tableSlice";
import { uniqueId } from "lodash";
import { getSelectedTab, getTaxTypeList, selectBodySection } from "../../../store/homeSlice";
import {
  clearSelectedCustomer,
  getSelectedCustomer,
} from "../../../store/customerSlice";
import { getStoreUserData } from "../../../../../store/storeUser/storeUserSlice";
import CustomModal from "../../../../../components/CustomModal";
import Bill from "../../body/components/printbill";
import { Invoice } from "@axenda/zatca";
import { addHoldCart } from "../../../store/holdCartSlice";
import { Avatar, Form, Input, Select } from "antd";
import CartItem from "../../../components/CartItem";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Toaster, toast } from 'sonner'


const actionBtnClass = `w-full text-[0.6rem] py-2 font-medium rounded-lg   transition-all ease-in-out hover:scale-95 `;
const HomeCartFooter = () => {''
  const {
    totalAmount,
    tax,
    discount,
    amountToBeReturned,
    paymentMethod,
    totalPayableAmount,
    totalAmountWithoutDiscount, }
     = useSelector((state) => state.cart);
  const selectedTable = useSelector(getselectedTable);
  const selectedCustomer = useSelector(getSelectedCustomer);
  const taxLists = useSelector(getTaxTypeList);
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  // const [isExpanded, setIsExpanded] = React.useState(false);
  const dispatch = useDispatch();
  // const {ipcRenderer} = window.require("electron");
  const cartState = useSelector((state) => state.cart);

  return (
    <div
      className={`home__cart-footer absolute bottom-0 w-full flex flex-col p-3 bg-gray-100 text-black border-t  border-gray-300 gap-3 ${isExpanded ? " overflow-y-scroll h-[90%]" : ""
        }`}
    >
      <Toaster position="bottom-center" richColors />

      <div className="flex justify-between gap-2">
        <p className="text-xs font-semibold">
          {selectedTable === null
            ? "No Table Selected"
            : `Table :  ${selectedTable.name} is Selected`}
        </p>
        <p className="text-xs font-semibold">
          Customer :
          {selectedCustomer === null
            ? "No Customer Selected"
            : `${selectedCustomer?.name}`}
        </p>
      </div>

      <div className=" h-full  overflow-y-scroll">
        <div
          {...getCollapseProps()}
          className="home__cart-expand  flex flex-col gap-2"
        >
          <CartNumpad totalPayableAmount={totalPayableAmount} />
          <div className="detailed__amount border border-blue-500 border-dotted rounded-md bg-gray-100 p-2">
            <AmountDetailTile label={"Total"} value={totalAmount} />
            <AmountDetailTile label={"Tax"} value={tax} />
            <AmountDetailTile label={"Discount"} value={discount} />
            <AmountDetailTile
              label={"Amount to be returned"}
              value={amountToBeReturned?.toFixed(3)}
            />
            <AmountDetailTile label={"Payment Method"} value={paymentMethod} />
          </div>
        </div>
      </div>
      <div className="cart__footer-total flex justify-between gap-5  ">
        <p className="text-sm font-sem-bold ">Subtotal</p>   
        <p className="text-sm font-black text-black">
          ₹ {totalAmount?.toFixed(3)}
          { }
        </p>
      </div>

      <div className="cart__footer-total flex justify-between gap-5  ">
        <p className="text-sm font-bold ">{taxLists && taxLists?.length > 0 ? taxLists[0]?.name + `(${taxLists[0]?.amount}%)`: "VAT"}  </p>
        <p className="text-sm font-black text-black">₹ {tax?.toFixed(3)}</p>
      </div>
      {discount > 0 ?
        <div className="cart__footer-total flex justify-between gap-5 text-green-500 ">
          <p className="text-sm font-bold ">Discount</p>
          <p className="text-sm font-black ">₹ {discount}</p>
        </div>
        : null}
      <div className="cart__footer-total flex justify-between gap-5  ">
        <p className="text-lg font-bold ">Payable Amount</p>
        <p className="text-lg font-black text-black">
          ₹ {totalPayableAmount?.toFixed(3)}
        </p>
      </div>

      <FooterActions />
    </div>
  );
};

export default HomeCartFooter;

const AmountDetailTile = ({ label, value }) => {
  return (
    <div className="flex gap-2 justify-between">
      <p className="text-md font-bold ">{label} :</p>

      <p className="text-sm  font-black  text-red-500">{value}</p>
    </div>
  );
};

const FooterActions = ({ }) => {
  function generateInvoiceNumber() {
    const prefix = "INV";
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(Math.random() * 1000000);
  
    return `${prefix}${datePart}${randomPart.toString().padStart(6, "0")}`;
  }


  const handleSubmit = async () => {
    const invoiceNumber = generateInvoiceNumber();

    const orderData = {
      status: PAYMENTSTATUS.PENDING,
      orderDetails: {
        orderNumber: orderId,
         invoiceNumber: invoiceNumber, // Use generated invoice number
        customerName: selectedCustomer?.name,
      },
      location: "Store",
      itemDetails: {
        items: cartState?.orderitems?.length,
        quantity: cartState?.orderitems?.reduce((acc, item) => acc + item.quantity, 0),
        itemName: cartState?.orderitems?.map(item => item.name), // Include item names
      },
     method: cartState?.paymentMethod,
    total: cartState?.totalPayableAmount,
    discount: {
      type: cartState?.discountType,
      value: cartState?.discountValue,
    },
    type: "SALE",
  };

    console.log("Sending order data:", orderData); // Debug log

    try {
      const response = await axios.post('http://localhost:8000/api/user/orders', orderData);
      toast.success("Order created successfully!");
      console.log(response.data);
    } catch (error) {
      toast.error(`Error creating order: ${error.response?.data?.message || error.message}`);
    }
  }
 



  
    
  const selectedTable = useSelector((state) => state.table.selectedTable);
  const taxLists = useSelector(getTaxTypeList);

  const selectedTab = useSelector(getSelectedTab);
  const [showModal, setShowModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [holdCartModal, setHoldCartModal] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [schedule_date, setschedule_date] = useState(null);
  const [schedule_time, setschedule_time] = useState(null);
  const [printState, setPrintState] = useState(false);
  const [cartNote, setCartNote] = useState("");
  const [orderId, setOrderId] = useState(0);
  const [scheduleDate, setScheduleDate] = useState();
  const [paymentMethods, setpaymentMethods] = useState([]);
  // console.log(paymentMethods,"lll");

  const selectedCustomer = useSelector((state) => state.customer.selectedCustomer);

  const cartState = useSelector((state) => state.cart);
  // console.log(cartState,"jjj");

  const ordersData = useSelector((state) => state.order);
  const selectedOrderType = useSelector(getSelectedTab);
  const editOrder = useSelector((state) => state.order.editOrder);
  const bookedTableList = useSelector(getBookedTableList);

  const dispatch = useDispatch();
  const [notificationApi, contextHolder] = notification.useNotification();

  const store_user = useSelector(getStoreUserData);

  const ipcRenderer = window.ipcRenderer;

  const printThermal = (selectedOrder) => {
    // console.log(cartState?.orderitems,'jjj');
    let finalItems = [];
    let kotfinalItems = [];

    // console.log(ordersData);
    let odCount = 0;
    ordersData?.ordersList.forEach(function (order) {
      if (moment(order.created_at).isSame(moment(), "day")) {
        odCount++;
      }
    });

    // console.log(cartState);

    // return;
    cartState?.orderitems.forEach(function (item) {
      let name;

      if (item?.sell_line_note) {
        name = item.name + "(" + item?.sell_line_note + ")"
      } else {
        name = item.name
      }
      let readyToPush = [
        name,
        item.price,
        item.quantity,
        // parseFloat((item.price * 1.1) / 100).toFixed(3),
        parseFloat(item.price * item.quantity).toFixed(3),
      ];
      let readyToPushKot = [
        item.name,
        item.quantity,
        item?.sell_line_note,
        // parseFloat((item.price * 1.1) / 100).toFixed(3),
      ];
      if (item.selectedAddon) {
        readyToPush = [
          item.name +
          "<br />" +
          item.selectedAddon.name +
          "(" +
          item.selectedAddon.price +
          ")",
          item.price,
          parseFloat((item.price * 1.15) / 100).toFixed(3),
          item.quantity,
          parseFloat(item.price * item.quantity, 2).toFixed(3),
        ];

        readyToPushKot = [
          item.name +
          "<br />" +
          item.selectedAddon.name +
          "(" +
          item.selectedAddon.price +
          ")",
          item.price,
          parseFloat((item.price * 1.15) / 100).toFixed(3),
          item.quantity,
          parseFloat(item.price * item.quantity, 2).toFixed(3),
        ];
      }

      finalItems.push(readyToPush);
      kotfinalItems.push(readyToPushKot);
    });

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

    const date = new Date();

    const data = [

      {
        type: "image",
        url: "https://tyempos.shiftdevs.com/assets/logo-3dd3c3d0.png", // file path
        position: "center", // position of image: 'left' | 'center' | 'right'
        width: "50px", // width of image in px; default: auto
        height: "50px", // width of image in px; default: 50 or '50px'
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: store_user?.business?.name ?? "TyemPOS",
        style: {
          fontWeight: "700",
          textAlign: "center",
          fontSize: "15px",
          marginTop: "10px",
        },
      },

      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value:
          '<p style="display: flex;justify-content: center; margin-bottom: 0px">LA GARDEN, near, Railway Station Road, Theruvath, Kasaragod, Kerala 671121</p>',
        style: { fontSize: "12px", textAlign: "center", color: "black" },
      },
      // {
      //   type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      //   value:
      //     '<p style="display: flex;justify-content: center; margin-bottom: 0px;margin-top: 0px">VAT No: 220004557300002 </p>',
      //   style: { fontSize: "15px", textAlign: "center", color: "black" },
      // },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "<hr>",
        style: { fontWeight: "700", textAlign: "center", fontSize: "5px" },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Order Type : " + selectedTab?.name,
        style: { textAlign: "center", fontSize: "10px", fontWeight: "900" },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "<hr>",
        style: {
          fontWeight: "700",
          textAlign: "center",
          fontSize: "5px",
          // marginBottom: "10px",
        },
      },
      {
        type: "table",
        // style the table
        style: { fontSize: "12px" },
        tableBodyStyle: { borderTop: "white", fontWeight: "900" },
        // list of the columns to be rendered in the table header
        // tableHeader: ['Item', 'Price','Qty', 'Total'],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
          [
            '<span style="width: 100%; text-align: left; display: flex">Order No : </span>',
            '<span style="width: 100%; text-align: left; display: flex; font-weight: bold; font-size: 20px">' +
            (odCount + 1) +
            "</span>",
          ],
          [
            '<span style="width: 100%; text-align: left; display: flex">Invoice No :</span>',
            '<span style="width: 100%; text-align: left; display: flex">' +
            date.getDate() +
            (date.getMonth() + 1) +
            date.getFullYear() +
            (odCount + 1) +
            "</span>",
          ],


          [
            '<span style="width: 100%; text-align: left; display: flex">Employee	:</span>',
            '<span style="width: 100%; text-align: left; display: flex">SHAHABIYA CASHIER</span>',
          ],
          selectedCustomer != undefined
            ? [
              '<span style="width: 100%; text-align: left; display: flex">Customer Name :</span>',
              '<span style="width: 100%; text-align: left; display: flex">' +
              selectedCustomer?.name +
              "</span>",
            ]
            : [],
          selectedCustomer && selectedCustomer?.shipping_address !== null
            ? [
              '<span style="width: 100%; text-align: left; display: flex">Customer Phone :</span>',
              '<span style="width: 100%; text-align: left; display: flex">' +
              selectedCustomer.mobile +
              "</span>",
            ]
            : [],
          selectedCustomer && selectedCustomer?.shipping_address !== null
            ? [
              '<span style="width: 100%; text-align: left; display: flex">Customer Address :</span>',
              '<span style="width: 100%; text-align: left; display: flex">' +
              selectedCustomer.shipping_address +
              "</span>",
            ]
            : [],
          [
            '<span style="width: 100%; text-align: left; display: flex">Date & Time :</span>',
            '<span style="width: 100%; text-align: left; display: flex">' +
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear() +
            " - " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            "</span>",
          ],
        ],

        // list of columns to be rendered in the table footer
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: "white", color: "black" },
        // custom style for the table body
        // custom style for the table footer
        tableFooterStyle: { backgroundColor: "white", color: "black" },
      },
      // {
      //   type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      //   value: "<hr>",
      //   style: {
      //     fontWeight: "700",
      //     textAlign: "center",
      //     fontSize: "24px",
      //     marginBottom: "10px",
      //   },
      // },
      {
        type: "table",
        // style the table
        style: {
          marginTop: "10px",
        },
        // list of the columns to be rendered in the table header
        tableHeader: ["Item Name", "Price", "Qty", "Amount"],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: finalItems,
        // list of columns to be rendered in the table footer
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: "white", color: "black", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd", },
        // custom style for the table body
        tableBodyStyle: { textAlign: "center", fontWeight: "900" },
        // custom style for the table footer
        tableFooterStyle: { backgroundColor: "white", color: "black" },
      },
      {
        type: "table",
        // style the table
        style: { marginTop: "15px" },
        tableBodyStyle: { textAlign: "left", fontWeight: "900" },
        // list of the columns to be rendered in the table header
        // tableHeader: ['Item', 'Price','Qty', 'Total'],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
          [
            '<span style="width: 100%; text-align: left; display: flex">  </span>',
            '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
            "Total Taxable Amount : " + parseFloat(cartState.totalAmount).toFixed(3) +
            "</span>",
          ],
          [
            '<span style="width: 100%; text-align: left; display: flex"> </span>',
            '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
            "VAT Total:" + parseFloat(cartState.tax).toFixed(3) +
            "</span>",
          ],
          parseFloat(cartState.discount) > 0
            ? [
              '<span style="width: 100%; text-align: left; display: flex">Total Discount  </span>',
              '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
              parseFloat(cartState.discount).toFixed(3) +
              "</span>",
            ]
            : [],
          [
            '<span style="width: 100%; text-align: left; display: flex; font-weight: bold; font-size: 15px">  </span>',
            '<span style="width: 100%; text-align: right; display: flex;font-weight: bold; font-size: 15px;    justify-content: flex-end;">' +
            "Total:" + parseFloat(cartState.totalPayableAmount).toFixed(3) +
            "</span>",
          ],
        ],
        // list of columns to be rendered in the table footer
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: "white", color: "black" },
        // custom style for the table body
        // custom style for the table footer
        tableFooterStyle: { backgroundColor: "white", color: "black" },
      },
      {
        type: "table",
        // style the table
        style: { marginTop: "0px" },
        tableBodyStyle: { textAlign: "left", fontWeight: "900" },
        // list of the columns to be rendered in the table header
        // tableHeader: ['Item', 'Price','Qty', 'Total'],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
          [
            '<span style="width: 100%; text-align: left; display: flex">' +
            "" +
            "	 </span>",
            '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
            "Total Items: " + finalItems?.length +
            "</span>",
          ],
          [
            '<span style="width: 100%; text-align: left; display: flex">' +

            "	</span>",
            '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;"> ' +
            paymentMethod + ": ₹ " + parseFloat(cartState.totalPayableAmount).toFixed(3) +
            "</span>",
          ],
          // [
          //   '<span style="width: 100%; text-align: left; display: flex">Tendered Amount :</span>',
          //   '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;">' +
          //   parseFloat(cartState.totalPayableAmount).toFixed(3) +
          //   "</span>",
          // ],
          // [
          //   '<span style="width: 100%; text-align: left; display: flex; ">Amount to be returned		:</span>',
          //   '<span style="width: 100%; text-align: right; display: flex;    justify-content: flex-end;">₹ 0.00</span>',
          // ],
        ],
        // list of columns to be rendered in the table footer
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: "white", color: "black" },
        // custom style for the table body
        // custom style for the table footer
        tableFooterStyle: { backgroundColor: "white", color: "black" },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "<hr>",
        style: {
          fontWeight: "700",
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "10px",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value:
          '<p style="display: flex;justify-content: center; margin-bottom: 0px">Thank You, Visit Again</p>',
        style: { fontSize: "12px", textAlign: "center", color: "black" },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value:
          '<p style="display: flex;justify-content: center; margin-bottom: 0px">Technology Partners https://tyemventures.in/</p>',
        style: { fontSize: "12px", textAlign: "center", color: "black" },
      },
      // {
      //   type: "qrCode",
      //   value: invoice.toBase64(),
      //   height: 200,
      //   width: 200,
      //   position: "center",
      //   style: { margin: "10 20px 20 20px", justifyContent: "center" },
      // },
    ];

    const kotdata = [

      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: store_user?.business?.name ?? "TyemPOS",
        style: {
          fontWeight: "700",
          textAlign: "center",
          fontSize: "15px",
          marginTop: "10px",
        },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "<hr>",
        style: { fontWeight: "700", textAlign: "center", fontSize: "5px" },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Order Type : " + selectedTab?.name,
        style: { textAlign: "center", fontSize: "10px", fontWeight: "900" },
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "<hr>",
        style: {
          fontWeight: "700",
          textAlign: "center",
          fontSize: "5px",
          // marginBottom: "10px",
        },
      },
      {
        type: "table",
        // style the table
        style: { fontSize: "12px" },
        tableBodyStyle: { borderTop: "white", fontWeight: "900" },
        // list of the columns to be rendered in the table header
        // tableHeader: ['Item', 'Price','Qty', 'Total'],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
          [
            '<span style="width: 100%; text-align: left; display: flex">Order No : </span>',
            '<span style="width: 100%; text-align: left; display: flex; font-weight: bold; font-size: 20px">' +
            (odCount + 1) +
            "</span>",
          ],
          [
            '<span style="width: 100%; text-align: left; display: flex">Invoice No :</span>',
            '<span style="width: 100%; text-align: left; display: flex">' +
            date.getDate() +
            (date.getMonth() + 1) +
            date.getFullYear() +
            (odCount + 1) +
            "</span>",
          ],


          [
            '<span style="width: 100%; text-align: left; display: flex">Employee	:</span>',
            '<span style="width: 100%; text-align: left; display: flex">SHAHABIYA CASHIER</span>',
          ],
          selectedTable != undefined
            ? [
              '<span style="width: 100%; text-align: left; display: flex">Table  :</span>',
              '<span style="width: 100%; text-align: left; display: flex">' +
              selectedTable?.name +
              "</span>",
            ]
            : [],
          [
            '<span style="width: 100%; text-align: left; display: flex">Date & Time :</span>',
            '<span style="width: 100%; text-align: left; display: flex">' +
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear() +
            " - " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            "</span>",
          ],
        ],

        // list of columns to be rendered in the table footer
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: "white", color: "black" },
        // custom style for the table body
        // custom style for the table footer
        tableFooterStyle: { backgroundColor: "white", color: "black" },
      },
      // {
      //   type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      //   value: "<hr>",
      //   style: {
      //     fontWeight: "700",
      //     textAlign: "center",
      //     fontSize: "24px",
      //     marginBottom: "10px",
      //   },
      // },
      {
        type: "table",
        // style the table
        style: {
          marginTop: "10px",
        },
        // list of the columns to be rendered in the table header
        tableHeader: ["ItemName", "Qty", "Remarks"],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: kotfinalItems,
        // list of columns to be rendered in the table footer
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: "white", color: "black", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd", },
        // custom style for the table body
        tableBodyStyle: { textAlign: "center", fontWeight: "900" },
        // custom style for the table footer
        tableFooterStyle: { backgroundColor: "white", color: "black" },
      },


      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "<hr>",
        style: {
          fontWeight: "700",
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "10px",
        },
      },

    ];
    const settings = {
      main_printer: localStorage.getItem("main_printer"),
      kot_printer: "80mm",
      width: "500px",
      height: null,
    };

    const kotsettings = {
      main_printer: localStorage.getItem("kot_printer"),
      kot_printer: "80mm",
      width: "500px",
      height: null,
    };

    const finalData = {
      settings: kotsettings,
      data: data,

    };

    const kotfinalData = {
      settings: settings,
      data: kotdata,

    };

    ipcRenderer.send("print", JSON.stringify(finalData));
    ipcRenderer.send("print2", JSON.stringify(kotfinalData));
  };
  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => dispatch(setPaymentMethod("Split"))}
          className="flex gap-2"
        >
          <UilLayersAlt /> <p>Split</p>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => dispatch(setPaymentMethod("other"))}
          className="flex gap-2"
        >
          <UilQrcodeScan /> <p>Other</p>
        </div>
      ),
    },
  ];

  const placeOrder = (type) => {
    if (isScheduled == true) {
      if (schedule_date == null || schedule_time == null) {
        toast.error("If you are scheduling the order , please choose a scheduled date")
        return;
      }

    }
    if (selectedTab == null) {
      notificationApi["error"]({
        message: "No Tab Selected",
        description: "Please select a tab to place order",
      });
      return;
    }
    if (cartState?.orderitems?.length === 0) {
      notificationApi["error"]({
        message: "No Items in Cart",
        description: "Please add items to cart to place order",
      });
      return;
    }

    if (selectedTab.is_customer_needed == true && selectedCustomer == null) {
      notificationApi["error"]({
        message: "No Customer Selected",
        description: "Please select a customer to place order",
      });
      return;
    }
    if (selectedTable) {
      dispatch(
        updateTableStatus({ id: selectedTable.id, status: TABLESTATES.BUSY })
      );
    }
    let status;

    if (selectedTable) {
      status = "draft"
    } else {
      if (type === 1) {
        status = "draft"
      } else if (type === 2 || type === 3) {
        status = "final"
      }
    }
    dispatch(
      pushOrder({
        token: store_user.accessToken,
        table: selectedTable ? selectedTable?.id : 0,
        cartState: cartState,
        orderStatus: status,
        orderitems: cartState?.orderitems,
        id: uniqueId("order_"),
        time: new Date().getTime(),
        paymentMethod: cartState?.paymentMethod,
        paymentStatus: PAYMENTSTATUS.PENDING,
        customer: selectedCustomer,
        store_id: store_user.business.id,
        price_group_id: selectedTab?.name,
        is_scheduled: isScheduled == true ? 1 : 0,
        schedule_date: schedule_date,
        schedule_time: schedule_time,
      })
    );



    dispatch(
      sell({
        token: store_user.accessToken,
        table: selectedTable ? selectedTable?.id : 0,
        cartState: cartState,
        orderitems: cartState?.orderitems,
        orderStatus: "received",
        id: uniqueId("order_"),
        time: new Date().getTime(),
        paymentMethod: cartState?.paymentMethod,
        paymentStatus: PAYMENTSTATUS.PENDING,
        customer: selectedCustomer ? selectedCustomer : 0,
        store_id: store_user.business.id,
        price_group_id: selectedTab?.id,
        is_scheduled: isScheduled == true ? 1 : 0,
        schedule_date: schedule_date,
        schedule_time: schedule_time,
        discount_type: cartState.discountType,
        discount_amount: cartState.discount,
        tax_rate_id: taxLists && taxLists?.length > 0 ? taxLists[0]?.id : null
      })
    );
    dispatch(clearSelectedCustomer());
    setTimeout(() => {
      dispatch(clearSelectedTable());
      dispatch(getOrders(store_user?.accessToken));
      dispatch(getFloorsTables(store_user?.accessToken));
      dispatch(getBookedTablesForToday(store_user?.accessToken));
      dispatch(getOrders(store_user?.accessToken));
      setShowPlaceModal(false);
      dispatch(clearEditOrder());

      setShowModal(true);
      setPrintState(true);
      setTimeout(() => {
        setPrintState(false);
      }, 500);
    }, 200);
  };


  const updateOrder = (type) => {
    // if (isScheduled == true) {
    //   if (schedule_date == null || schedule_time == null) {
    //     toast.error("If you are scheduling the order , please choose a scheduled date")
    //     return;
    //   }

    // }
    // if (selectedTab == null) {
    //   notificationApi["error"]({
    //     message: "No Tab Selected",
    //     description: "Please select a tab to place order",
    //   });
    //   return;
    // }
    // if (cartState?.orderitems?.length === 0) {
    //   notificationApi["error"]({
    //     message: "No Items in Cart",
    //     description: "Please add items to cart to place order",
    //   });
    //   return;
    // }

    // if (selectedTab.is_customer_needed == true && selectedCustomer == null) {
    //   notificationApi["error"]({
    //     message: "No Customer Selected",
    //     description: "Please select a customer to place order",
    //   });
    //   return;
    // }
    // if (selectedTable) {
    //   dispatch(
    //     updateTableStatus({ id: selectedTable.id, status: TABLESTATES.BUSY })
    //   );
    // }
    // let status;

    // if (selectedTable) {
    //   status = "draft"
    // } else {
    //   if (type === 1) {
    //     status = "draft"
    //   } else if (type === 2 || type === 3) {
    //     status = "final"
    //   }
    // }
    // alert(status)
    // console.log(editOrder,'ff');
    // return

    dispatch(
      sellUpdate({
        token: store_user.accessToken,
        table: selectedTable ? selectedTable?.id : 0,
        cartState: cartState,
        orderitems: cartState?.orderitems,
        orderStatus: "final",
        id: editOrder?.order_id,
        time: new Date().getTime(),
        paymentMethod: cartState?.paymentMethod,
        paymentStatus: PAYMENTSTATUS.PENDING,
        customer: selectedCustomer ? selectedCustomer : 0,
        store_id: store_user.business.id,
        price_group_id: selectedTab?.id,
        is_scheduled: isScheduled == true ? 1 : 0,
        schedule_date: schedule_date,
        schedule_time: schedule_time,
      })
    );
    dispatch(clearSelectedCustomer());
    setTimeout(() => {
      dispatch(groupTables());

      dispatch(clearSelectedTable());
      dispatch(getOrders(store_user?.accessToken));
      dispatch(getFloorsTables(store_user?.accessToken));
      dispatch(getBookedTablesForToday(store_user?.accessToken));
      dispatch(getOrders(store_user?.accessToken));
      setShowPlaceModal(false);
      dispatch(clearEditOrder());

      setShowModal(true);
      setPrintState(true);
      setTimeout(() => {
        setPrintState(false);
      }, 500);
    }, 200);
  };
  const __generataOrderId = () => {
    setOrderId(uniqueId("order_"));
  };

  const layout = {
    layout: "vertical",
  };
  const [form] = Form.useForm();

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  const onFinish = (values) => {
    // console.log(values);

    setschedule_date(values?.schedule_date)
    setschedule_time(values?.schedule_time)
  }
  return (
    <div className=" flex flex-col gap-3">
      <Toaster position="bottom-center" richColors />

      {contextHolder}


      {cartState?.orderitems?.length !== 0 &&

        <div className="flex gap-2 items-center">
          <button
            className={`${actionBtnClass}  bg-yellow-500  text-white hover:bg-orange-300 p-2 flex gap-2 justify-center`}
            onClick={() => {
              setIsScheduled(true);
              setShowPlaceModal(true);
              __generataOrderId();
              let methods = JSON.parse(store_user?.business?.pos_settings);


              if (methods?.enable_cash_denomination_for_payment_methods && methods.enable_cash_denomination_for_payment_methods?.length > 0) {
                setPaymentMethod(methods.enable_cash_denomination_for_payment_methods?.length)
              }
            }}
          >
            <UilCalender color="#fff" />
            <p className="text-sm font-semibold mt-[0.2rem] text-white">
              Schedule
            </p>
          </button>
          <button
            className={`${actionBtnClass}  bg-orange-500  text-white hover:bg-orange-300 p-2 flex gap-2 justify-center`}
            onClick={() => {
              setHoldCartModal(true);
            }}
          >
            <UilPauseCircle color="#fff" />
            <p className="text-sm font-semibold mt-[0.2rem] text-white">
              Hold
            </p>
          </button>
          {editOrder?.orderitems && editOrder?.orderitems?.length !== 0 ? (
            <>

              <button
                className={`${actionBtnClass}  bg-yellow-600   hover:bg-yellow-500 p-2 flex gap-2 justify-center text-white `}
                onClick={() => {

                  if (selectedTable !== null || selectedTable !== undefined) {

                    setOrderId(editOrder?.id);
                    placeOrder(1);

                  } else {
                    setIsScheduled(false);

                    setShowPlaceModal(true);
                    __generataOrderId();
                    let methods = JSON.parse(store_user?.business?.pos_settings);

                    console.log(JSON.parse(store_user?.business?.pos_settings), ',,')
                    if (methods?.enable_cash_denomination_for_payment_methods && methods.enable_cash_denomination_for_payment_methods?.length > 0) {
                      setPaymentMethod(methods.enable_cash_denomination_for_payment_methods?.length)
                    }
                  }
                }}
              >
                <UilArrowCircleRight color="#fff" />
                <p className="text-sm font-semibold mt-[0.2rem] ">Update </p>
              </button>
              <button
                className={`${actionBtnClass}  bg-green-600   hover:bg-green-500 p-2 flex gap-2 justify-center text-white `}
                onClick={() => {
                  setIsScheduled(false);
                  setShowPlaceModal(true);
                  setOrderId(editOrder?.id);

                  let methods = JSON.parse(store_user?.business?.pos_settings);

                  console.log(JSON.parse(store_user?.business?.pos_settings), ',,')
                  if (methods?.enable_cash_denomination_for_payment_methods && methods.enable_cash_denomination_for_payment_methods?.length > 0) {
                    setPaymentMethod(methods.enable_cash_denomination_for_payment_methods?.length)
                  }
                }}
              >
                <UilArrowCircleRight color="#fff" />
                <p className="text-sm font-semibold mt-[0.2rem] ">Complete </p>
              </button>
            </>
          ) : (
            <button
              className={`${actionBtnClass}  bg-green-600   hover:bg-green-500 p-2 flex gap-2 justify-center text-white `}
              onClick={() => {
                if (selectedTable !== null) {
                  __generataOrderId();
                  placeOrder(1);

                } else {

                  setIsScheduled(false);

                  setShowPlaceModal(true);
                  __generataOrderId();
                  let methods = JSON.parse(store_user?.business?.pos_settings);

                  console.log(JSON.parse(store_user?.business?.pos_settings), ',,')
                  if (methods?.enable_cash_denomination_for_payment_methods && methods.enable_cash_denomination_for_payment_methods?.length > 0) {
                    setPaymentMethod(methods.enable_cash_denomination_for_payment_methods?.length)
                  }
                }
              }}
            >
          
              <UilArrowCircleRight color="#fff" />
              <p className="text-sm font-semibold mt-[0.2rem] ">Place Order</p>
            </button>
          )}



        </div>
      }
      {showPlaceModal && (
        <CustomModal
          onClose={() => {
            setShowPlaceModal(false);
          }}
        >
          <div className="flex flex-col  p-10" style={{ width: "1000px" }}>
            <div className="flex items-center justify-between border-b-2 border-gray-300 pb-5">
              <div className="flex flex-col  w-full ">
                <div>
                  <h3 className="text-lg font-bold">Order ID : #{orderId}</h3>
                </div>
                <div>
                  <h5 className="text-lg font-bold">
                    {cartState?.orderitems?.length} Items
                  </h5>
                </div>
                <div>
                  <h5 className="text-lg font-bold" >
                    {selectedCustomer?.name}
                  </h5>
                </div>
              </div>
              <div className="flex flex-col items-center w-full justify-end">
                <div className="flex  items-center w-full justify-end">
                  <div>
                    <h3 className="text-lg font-medium ">Payable Amount :</h3>
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-green-500 ml-10">
                      ₹ {cartState.totalPayableAmount}
                    </h2>
                  </div>
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
                      
                      ${cartState?.paymentMethod && cartState?.paymentMethod == item
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
                      
                      ${cartState?.paymentMethod && cartState?.paymentMethod == "cash"
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
                      
                      ${cartState?.paymentMethod && cartState?.paymentMethod == "card"
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
                      
                      ${cartState?.paymentMethod && cartState?.paymentMethod == "Split"
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
                    
                    ${cartState?.paymentMethod && cartState?.paymentMethod == "Talabat"
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
                    
                    ${cartState?.paymentMethod && cartState?.paymentMethod == "other"
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
              <div className="home__cart-items flex flex-col  flex-auto gap-1  w-[60%] overflow-y-scroll ">
                {/* <div className="max-h-[12rem] overflow-auto flex-auto gap-2 ">
                  {[...cartState?.orderitems]
                    ?.reverse()
                    .map((item, index) => {
                      return (
                        <CartItem key={item.id} index={index} item={item} />
                      );
                    })}
                </div> */}
                <div className="flex items-center justify-between mt-5">
                  <div className="text-black text-sm font-medium">
                    Subtotal
                  </div>
                  <div className="text-black text-lg font-bold">
                    ₹ {cartState?.totalAmount.toFixed(3)}
                  </div>   
                </div> 
            
                <div className="flex items-center justify-between ">
                  <div className="text-black text-sm font-medium">
                    Discount
                  </div>
                  <div className="text-black text-lg font-bold">
                    ₹ {parseFloat(cartState?.discount)?.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="text-black text-sm font-medium">VAT</div>
                  <div className="text-black text-lg font-bold">
                    ₹ {cartState?.tax.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="text-black text-sm font-medium">
                    Amount to be returned
                  </div>
                  <div className="text-green-500 text-lg font-bold">
                    ₹ {cartState?.amountToBeReturned.toFixed(3)}
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="text-black text-sm font-medium">
                    Balance Due
                  </div>
                  <div className="text-chicket-500 text-lg font-bold">
                    ₹ 0.000
                  </div>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="text-black text-lg font-semibold">
                    Grand Total
                  </div>
                  <div className="text-black text-lg font-bold">
                    ₹ {cartState?.totalPayableAmount.toFixed(3)}
                  </div>
                </div>

                <div className="flex items-center gap-3">

                  <button
                    className={`${actionBtnClass}  bg-yellow-500 mt-5  hover:bg-yellow-400 p-2 flex gap-2 justify-center text-white`}
                    onClick={() => {


                      let table = {
                        id: 1,
                        name: "T1",
                        status: TABLESTATES.READYTOBILL,
                        floor: FLOORS.BASEMENT,
                      };
                      dispatch(setselectedTable(table));

                      setTimeout(() => {
                        placeOrder(2);

                        // printThermal();
                      }, 200);
                    }}
                  >
              <button
              className="bg-yellow-500 mt-5 hover:bg-yellow-400 p-2 flex gap-2 justify-center text-white"
              onClick={handleSubmit}
            >
              <p className="text-sm font-semibold mt-[0.2rem]">Save</p>

            </button>
                  </button>
                  <button
                    className={`${actionBtnClass}  bg-blue-500 mt-5  hover:bg-blue-400 p-2 flex gap-2 justify-center text-white`}
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: TABLESTATES.READYTOBILL,
                        floor: FLOORS.BASEMENT,
                      };
                      dispatch(setselectedTable(table));

                      setTimeout(() => {
                        placeOrder(2);
                        // printThermal();
                      }, 200);
                    }}
                  >
                    <p className="text-sm font-semibold mt-[0.2rem] ">
                      Receipt
                    </p>
                  </button>
                  <button
                    className={`${actionBtnClass}  bg-green-500 mt-5  hover:bg-green-400 p-2 flex gap-2 justify-center text-white`}
                    onClick={() => {
                      let table = {
                        id: 1,
                        name: "T1",
                        status: TABLESTATES.READYTOBILL,
                        floor: FLOORS.BASEMENT,
                      };
                      dispatch(setselectedTable(table));

                      setTimeout(() => {
                        if (editOrder?.orderitems && editOrder?.orderitems?.length !== 0) {
                          // updateOrder(3);
                          alert(1);
                        } else {
                          alert(2);

                          //placeOrder(3);
                        }
                        // printThermal();
                      }, 200);
                    }}
                  >
                    <p className="text-sm font-semibold mt-[0.2rem] ">
                      KOT & Print
                    </p>
                  </button>
                </div>
              </div>
              <div className="w-[40%]">
                {isScheduled ?

                  <div className="modal__numpad  bg-white text-black flex-auto  ml-10 flex flex-col justify-center gap-2 ">
                    <div>
                      <h3 className="text-lg font-medium ">Choose schedule date :</h3>
                    </div>
                    <div>
                      <Form
                        {...layout}
                        form={form}
                        name="nest-messages"
                        onFinish={onFinish}
                        validateMessages={validateMessages}
                      >
                        <Form.Item
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                          name={"schedule_date"}
                          label="Choose Schedule Date"
                        >
                          <Input type="date" />
                        </Form.Item>

                        <Form.Item
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                          name={"schedule_time"}
                          label="Choose Schedule Time"
                        >
                          <Input type="time" />
                        </Form.Item>
                        <Form.Item>
                          <button
                            htmltype="submit"
                            key={"save&add"}
                            className="px-3 rounded-lg   w-full py-2 bg-green-600 text-white font-bold transition-all hover:scale-90"
                          >
                            Confirm Schedule Details
                          </button>
                        </Form.Item>
                      </Form>
                      {/* <Calendar className="h-100" onChange={setScheduleDate} showWeekNumbers value={scheduleDate} minDate={new Date()} /> */}
                    </div>
                  </div>
                  : null}
                <CartNumpad
                  totalPayableAmount={cartState?.totalPayableAmount}
                />
              </div>
            </div>
          </div>
        </CustomModal>
      )}

      {showModal && (
        <CustomModal
          onClose={() => {
            setShowModal(false);
            dispatch(clearCart());
          }}
        >
          <div className="p-10 flex items-center flex-col gap-3">
            <UilCheckCircle size="100" color="green" />
            <p className="text-lg font-black text-gray-800">
              Order Placed Successfully
            </p>

            <p className="text-sm font-black text-gray-800"></p>
            <div className="w-full  gap-4  rounded-lg flex justify-between p-10 items-center ">
              <div className="cart__item-details flex-1">
                <p className="text-lg font-bold text-black mt-2">
                  Total Bill Amount : ₹{" "}
                  {cartState.totalPayableAmount.toFixed(3)}
                </p>
                <p className="text-lg font-bold text-black mt-2">
                  Total Paid : ₹ {cartState.amountToBeReturned.toFixed(3)}
                </p>
                <p className="text-lg font-bold text-black mt-2">
                  Amount Returned : ₹{" "}
                  {cartState.amountToBeReturned.toFixed(3)}
                </p>
                <p className="text-lg font-bold text-black mt-2">
                  Payment Method : {cartState?.paymentMethod.replace(/^./, cartState?.paymentMethod[0].toUpperCase())}
                </p>
              </div>
            </div>

            <button
              className="bg-green-500 w-[100px]  items-center text-white justify-center rounded-lg  hover:bg-green-400 p-2 flex gap-2"
              onClick={() => {

                printThermal();
              }}
            >
              Print
            </button>

            <button
              className="bg-red-500 w-[100px]  items-center text-white justify-center rounded-lg  hover:bg-green-400 p-2 flex gap-2"
              onClick={() => {
                setShowModal(false);
                dispatch(clearCart());
              }}
            >
              Close
            </button>
          </div>
        </CustomModal>
      )}
      {holdCartModal && (
        <CustomModal
          onClose={() => {
            setShowModal(false);
            dispatch(clearCart());
            setHoldCartModal(false);
          }}
        >
          <div className="flex  flex-col gap-4 p-4 rounded-lg border shadow-2xl w-[500px]">
            <h2 className="text-md font-bold">Hold Cart</h2>
            <div className="flex gap-2 w-full">
              <Form layout="vertical" style={{ width: "100%" }}>
                <Form.Item label="Cart Note">
                  <Input
                    onChange={(e) => setCartNote(e.target.value)}
                    defaultValue={""}
                  />
                </Form.Item>
              </Form>
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-10 py-2 text-orange-500 border-2 border-orange-500 rounded-lg cursor-pointer transition-all hover:scale-90 ">
                Cancel
              </button>
              <button
                onClick={() => {
                  // if (!selectedCustomer || !cartState?.orderitems?.length) {
                  //   notificationApi.error({
                  //     message: "Please Select Customer and Add Items to Cart",
                  //   });
                  //   return;
                  // }
                  dispatch(
                    addHoldCart({
                      ...cartState,
                      customer: selectedCustomer,
                      cartNote: cartNote,
                      orderType: selectedOrderType,
                      time: new Date().toLocaleString(),
                    })
                  );
                  dispatch(clearSelectedCustomer());
                  dispatch(clearCart());
                  setHoldCartModal(false);
                }}
                className="px-10 py-2  border-2 border-orange-500  bg-orange-500 text-white rounded-lg cursor-pointer transition-all hover:scale-90 "
              >
                Proceed
              </button>
            </div>
          </div>
        </CustomModal>
      )}


    </div>
  );
  }
