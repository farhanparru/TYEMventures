import React, { useState ,useEffect} from "react";
import { FaUndoAlt, FaPrint, FaDownload } from "react-icons/fa";
import { Dropdown, Menu } from "antd";
import {
  DownOutlined,
  UpOutlined,
  MailOutlined,
  MessageOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { FaCheckCircle } from 'react-icons/fa';
import axios from "axios";



const OrderItem = ({ order }) => {
  return (
    <div
      className={`p-3 mb-3 rounded-lg shadow-md flex justify-between items-center border cursor-pointer
        ${order.orderMeta.paymentStatus === 'Completed' ? 'bg-green-100' : 'bg-white'}`}
    >
      <div>
        <h3 className="text-lg font-semibold">Order #{order.orderMeta?.posOrderId}</h3>
        <p className="text-sm">
          {order.totalQuantity} Item{order.totalQuantity > 1 ? 's' : ''} | 
          {order.orderMeta?.paymentTendered} {order.orderDetails[0]?.product_currency} | 
          {order.orderMeta?.orderType}
        </p>

        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded ${order.orderMeta.paymentStatus === 'Completed' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {order.orderMeta.paymentStatus}
          </span>
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-md text-black">{order.date}</h1>
        <h2 className="text-sm text-black">{order.time}</h2>
      </div>
    </div>
  );
};







const OrderDetails = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handlePrint = () => {
    window.print(); // Trigger print functionality
  };

  const handleDownload = () => {
    // Handle download logic here
    alert('Download functionality is not implemented yet.');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">Payment Details</h3>
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
            <p>WhatsAppOrder</p>
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
            <p>INR</p>
          </div>
          <div>
            <h4 className="font-semibold">Payment Method</h4>
            <p>Null</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">Customer Details</h3>
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

      <div className="mb-8 text-center">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          Pay Outstanding
        </button>
      </div>

      <div className="mb-8 text-center relative">
        <button
          onClick={toggleDropdown}
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-900"
        >
          Invoice Options
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
            <button
              onClick={handlePrint}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              Print
            </button>
            <button
              onClick={handleDownload}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              Download
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center">
        <FaCheckCircle className="w-6 h-6 text-green-500 mr-2" />
        <span className="text-green-500 font-semibold">Transaction Synced</span>
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
  const [orders, setOrders] = useState([]);

  // WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket('wss://tyem.invenro.site');
  
    ws.onmessage = (event) => {
      const newOrder = JSON.parse(event.data);
      console.log('New WebSocket Order:', newOrder); // Log new WebSocket order
  
      if (newOrder.orderMeta.paymentStatus === 'Completed') {
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
      }
    };
  
    return () => {
      ws.close();
    };
  }, []);
  // Fetch completed orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/tyem/Whatsappget');
        console.log('API Response:', response.data); // Log full response

        if (Array.isArray(response.data)) {
          // Adjust filter condition based on your actual 'completed' status
          const completedOrders = response.data.filter(order => order.orderMeta.paymentStatus === 'Completed');
          console.log('Filtered Completed Orders:', completedOrders); // Log filtered orders

          setOrders(completedOrders);
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
    // Optionally, you can use polling or WebSocket for real-time updates
  }, []);

  return (
    <div className="flex h-screen">
      <div
        id="order-list"
        className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto"
      >
        {orders.map((order) => (
          <OrderItem key={order._id} order={order} />
        ))}
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
