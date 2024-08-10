import React, { useState } from "react";
import { FaUndoAlt, FaPrint, FaDownload } from "react-icons/fa";
import { Dropdown, Menu } from "antd";
import {
  DownOutlined,
  UpOutlined,
  MailOutlined,
  MessageOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";



const OrderItem = () => {
  return (
    <div
      className={`p-3 mb-3 rounded-lg shadow-md flex justify-between items-center border cursor-pointer 
       `}
    >
      <div>
        <h3 className="text-lg font-semibold">98888888</h3>
        <p className="text-sm">10 20 INR</p>

        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded `}></span>

          <span className="ml-2 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
            New
          </span>
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-md  text-black">
          <h1>Date</h1>
        </h1>
        <h2 className="text-sm  text-black">
          <h1>tIME</h1>
        </h2>
      </div>
    </div>
  );
};

const OrderDetails = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">
          Payment Details
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Invoice Number</h4>
            <p>#39</p>
          </div>
          <div>
            <h4 className="font-semibold">Payment Method</h4>
            <p>28</p>
          </div>
          <div>
            <h4 className="font-semibold">Notes</h4>
            <p>WhatsAppOrder</p>{" "}
            {/* Ensure orderType is available in the order object */}
          </div>
          <div>
            <h4 className="font-semibold">Date & Time</h4>
            <p>100</p>
          </div>
          <div>
            <h4 className="font-semibold">Subtotal</h4>
            <p>INR</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center">Delivery Charge</h4>
            <p>98</p>
          </div>
          <div>
            <h4 className="font-semibold">Total Amount</h4>
            <p>inr</p>
          </div>
          <div>
            <h4 className="font-semibold">Payment Method</h4>
            <p>Null</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">
          Customer Details
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Name</h4>
            <p>KK</p>
          </div>
          <div>
            <h4 className="font-semibold">Phone Number</h4>
            <p>9072937703</p>
          </div>
          <div>
            <h4 className="font-semibold">Place</h4>
            <p>Kasaragod</p>
          </div>
          <div>
            <h4 className="font-semibold">Order Outstanding</h4>
            <p></p>
          </div>
        </div>
      </div>

      {/* Pay Outstanding Button */}
      <div className="mb-8 text-center">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          Pay Outstanding
        </button>
      </div>

      {/* Transaction Synced SVG */}
      <div className="flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-green-500 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m-3-7a7 7 0 11-4.68 11.32A7 7 0 0112 3v1"
          />
        </svg>
        <span className="text-green-500 font-semibold">
          Transaction Synced
        </span>
      </div>
    </div>
  );
};

const CartSection = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<FaPrint />}>
        Print
      </Menu.Item>
      <Menu.Item key="2" icon={<FaDownload />}>
        Download
      </Menu.Item>
      <Menu.Item key="3" icon={<MailOutlined />}>
        e-mail
      </Menu.Item>
      <Menu.Item key="4" icon={<MessageOutlined />}>
        sms
      </Menu.Item>
      <Menu.Item key="5" icon={<WhatsAppOutlined />}>
        WhatsApp
      </Menu.Item>
    </Menu>
  );

  // if (!order) {
  //   return (
  //     <div className="p-6 bg-gray-100 text-gray-500 rounded-lg">
  //       Select an order to view cart items.
  //     </div>
  //   );
  // }
  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      {/* Cart Items */}
      <div className="flex-grow overflow-auto max-h-96">
        <div className="flex items-center justify-between p-4 bg-white rounded-md text-black mb-4">
          <span className="font-semibold">FARHAN</span>
          <span>88</span>
          <span>pp</span>
          <span>INR</span>
        </div>
      </div>

      {/* Summary and Actions */}
      <div
        className="mt-auto p-4 bg-gray-700 text-white rounded-lg"
        style={{ marginBottom: "42px" }}
      >
        {/* Subtotal */}
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Subtotal</span>
          <span>
            <h1>helo</h1>
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total</span>
          <span>
            <h1>hh</h1>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-4 mt-6">
          <button className="flex-1 flex items-center justify-center bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-600">
            <FaUndoAlt className="mr-2" /> Refund
          </button>
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            onVisibleChange={(visible) => setDropdownVisible(visible)}
          >
            <button className="flex-1 flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
              Receipt{" "}
              {dropdownVisible ? (
                <UpOutlined className="ml-2" />
              ) : (
                <DownOutlined className="ml-2" />
              )}
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

const Salesssection = () => {
  return (
    <div className=" flex h-screen">
      <div
        id="order-list"
        className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto"
      >
        <OrderItem />
      </div>
      <div className="w-1/3 h-full p-4 bg-white overflow-auto">
        <OrderDetails />

        <p className="text-gray-500">Select an order to view details.</p>
      </div>
      <div className="w-1/3 h-full p-4 border-l border-gray-300 bg-white">
        <CartSection />

        <p className="text-gray-500">Select an order to view the cart.</p>
      </div>
    </div>
  );
};

export default Salesssection;
