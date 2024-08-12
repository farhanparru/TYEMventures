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
import { FaCalendar, FaClock } from "react-icons/fa"; // Adjust the import according to your icon library
import axios from "axios";
import { DateTime } from "luxon";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const OrderItem = ({ order, onSelect }) => {
  // Convert UTC to IST
  const utcDate = DateTime.fromISO(order.orderMeta.orderDate, { zone: "utc" });
  const zonedDate = utcDate.setZone("Asia/Kolkata");
  const formattedDate = zonedDate.toFormat("MMM dd, yyyy");
  const formattedTime = zonedDate.toFormat("hh:mm:ss a");

  return (
    <div
      onClick={onSelect} // Trigger the onSelect function when clicked
      className={`p-3 mb-3 rounded-lg shadow-md flex justify-between items-center border cursor-pointer transition duration-200
        ${order.orderMeta.paymentStatus === 'Completed' ? 'bg-green-100' : 'bg-white'}
        hover:bg-gray-200`} // Hover effect
    >
      <div>
        <h3 className="text-lg font-semibold">Order #{order.orderMeta?.posOrderId}</h3>
        <p className="text-sm">
          {order.totalQuantity} Item{order.totalQuantity > 1 ? 's' : ''} | 
          {order.orderMeta?.paymentTendered} {order.orderDetails[0]?.product_currency} | 
          {order.orderMeta?.orderType}
        </p>

        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded ${order.orderMeta.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {order.orderMeta.paymentStatus}
          </span>
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-md text-black">
          <FaCalendar className="inline mr-1" />
          {formattedDate}
        </h1>
        <h2 className="text-sm text-black">
          <FaClock className="inline mr-1" />
          {formattedTime}
        </h2>
      </div>
    </div>
  );
};









const OrderDetails = ({ order }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handlePrint = () => {
    window.print(); // Trigger print functionality
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    // Add title and date
    doc.text("Order Details", 20, 20);
    doc.text(`Date: ${formattedDate}`, 20, 30);
    doc.text(`Time: ${formattedTime}`, 20, 40);

    // Add order details
    doc.autoTable({
      startY: 50,
      head: [['Invoice Number', 'Notes', 'Subtotal', 'Delivery Charge', 'Total Amount', 'Payment Method']],
      body: [
        [
          order.orderMeta?.posOrderId,
          "WhatsAppOrder",
          `${order.orderDetails.unit_price} INR`,
          "98 INR",
          `${order.orderMeta?.paymentTendered} ${order.orderDetails[0].product_currency}`,
          "Cash",
        ],
      ],
    });

    // Add customer details
    doc.text("Customer Details", 20, doc.lastAutoTable.finalY + 20);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Name', 'Phone Number', 'Place', 'Order Outstanding']],
      body: [
        ["KK", "9072937703", "Kasaragod", ""],
      ],
    });

    // Save the PDF
    doc.save(`order_${order.orderMeta?.posOrderId}.pdf`);
  };

  const utcDate = DateTime.fromISO(order.orderMeta.orderDate, { zone: "utc" });
  const zonedDate = utcDate.setZone("Asia/Kolkata");
  const formattedDate = zonedDate.toFormat("MMM dd, yyyy");
  const formattedTime = zonedDate.toFormat("hh:mm:ss a");

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 border-b pb-2">Payment Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Invoice Number</h4>
            <p>#{order.orderMeta?.posOrderId}</p>
          </div>
          <div>
            <h4 className="font-semibold">Notes</h4>
            <p>WhatsAppOrder</p>
          </div>
          <div className="text-right">
            <h1 className="text-md text-black">
              <FaCalendar className="inline mr-1" />
              {formattedDate}
            </h1>
            <h2 className="text-sm text-black">
              <FaClock className="inline mr-1" />
              {formattedTime}
            </h2>
          </div>
          <div>
            <h4 className="font-semibold">Subtotal</h4>
            <p>{order.orderDetails.unit_price} INR</p>
          </div>
          <div>
            <h4 className="font-semibold flex items-center">Delivery Charge</h4>
            <p>98 INR</p>
          </div>
          <div>
            <h4 className="font-semibold">Total Amount</h4>
            <p>{order.orderMeta?.paymentTendered} {order.orderDetails[0].product_currency}</p>
          </div>
          <div>
            <h4 className="font-semibold">Payment Method</h4>
            <p>Cash</p>
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


const CartSection = ({ order }) => {
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

  if (!order) {
    return (
      <div className="p-6 bg-gray-100 text-gray-500 rounded-lg">
        Select an order to view cart items.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      <div className="flex-grow overflow-auto max-h-96">
        {order.orderDetails.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-md text-black mb-4"
          >
            <span className="font-semibold">{item.product_name}</span>
            <span>{item.product_quantity}</span>
            <span>{item.unit_price}</span>
            <span>{item.product_currency}</span>
          </div>
        ))}
      </div>

      {/* Summary and Actions */}
      <div className="mt-auto p-4 bg-gray-700 text-white rounded-lg" style={{ marginBottom: "42px" }}>
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Subtotal</span>
          <span>
            {order.orderMeta.paymentTendered} {order.orderDetails[0]?.product_currency}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total</span>
          <span>
            <h1>{/* Display total price if needed */}</h1>
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
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order

  // WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket('wss://tyem.invenro.site');
  
    ws.onmessage = (event) => {
      const newOrder = JSON.parse(event.data);
      console.log('New WebSocket Order:', newOrder);
  
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
        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          const completedOrders = response.data.filter(order => order.orderMeta.paymentStatus === 'Completed');
          console.log('Filtered Completed Orders:', completedOrders);

          setOrders(completedOrders);
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Handler for when an order is selected
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="flex h-screen">
      <div
        id="order-list"
        className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto"
      >
        {orders.map((order) => (
          <OrderItem key={order._id} order={order} onSelect={() => handleOrderSelect(order)} />
        ))}
      </div>
      <div className="w-1/3 h-full p-4 bg-white overflow-auto">
        <OrderDetails order={selectedOrder} />
     
      </div>
      <div className="w-1/3 h-full p-4 border-l border-gray-300 bg-white">
        <CartSection order={selectedOrder} />
       
      </div>
    </div>
  );
};



export default Salesssection;
