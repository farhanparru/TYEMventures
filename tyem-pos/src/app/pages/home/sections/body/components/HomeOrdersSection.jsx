import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { Element } from 'react-scroll';
import { FaCheckCircle, FaRegClock } from 'react-icons/fa';
import notificationSound from '../../../../../../assets/Moto Notification Ringtone Download - MobCup.Com.Co.mp3';
import { fetchOrders, connectWebSocket } from '../../../../../../services/apiService.js';

// OrderItem component
const OrderItem = ({ order, onSelect }) => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
   // Calculate the total quantity of items in the order
   const totalQuantity = order.orderDetails.reduce((sum, item) => sum + item.product_quantity, 0);

   return (
    <div
      className="w-1/4 p-4  bg-white rounded-lg shadow-md flex justify-between items-center border border-gray-200 cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(order)}
    >
      <div>
        <h3 className="text-lg font-semibold">Order #{order.orderMeta?.posOrderId} | INV# {order._id}</h3>
        <p className="text-sm">
          {totalQuantity} Item{totalQuantity > 1 ? 's' : ''} | 
          {order.orderMeta?.paymentTendered} {order.orderDetails[0].product_currency} | {order.orderMeta.orderType}
        </p>
        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded ${order.orderMeta.paymentStatus === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {order.orderMeta.paymentStatus}
          </span>
          {order.new && <span className="ml-2 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">New</span>}
        </div>
      </div>
      <div className="text-sm text-gray-500">
        Order Date: {new Date(order.createdAt).toLocaleDateString()} 
        <br />
        {currentTime}
      </div>
    </div>
  );
};


// OrderDetails component
const OrderDetails = ({ order }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
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
        <p>{order.orderMeta.paymentTendered} {order.orderDetails[0].product_currency}</p>
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
const CartSection = ({ order, onComplete, onCancel }) => {
  if (!order) {
    return <div className="p-4 bg-gray-100 text-gray-500 rounded-lg">Select an order to view cart items.</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      {order.orderDetails.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-md text-black mb-4">
          <span className="font-semibold">{item.product_name}</span>
          <span>{item.product_currency}</span>
          <span>{item.product_quantity}</span>
        </div>
      ))}
      <div className="mt-auto p-4 bg-gray-700 text-white">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Subtotal</span>
          <span>{order.orderMeta.paymentTendered} {order.orderDetails[0].product_currency}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span>Total</span>
          <span>{order.orderMeta.paymentTendered} {order.orderDetails[0].product_currency}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <button
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            onClick={() => onComplete(order.orderMeta.posOrderId)}
          >
            Accept
          </button>
          <button
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            onClick={() => onCancel(order.orderMeta.posOrderId)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

// Main HomeOrdersSection component
const HomeOrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

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
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      setSoundPlaying(true); // Play sound when a new order is received
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

  // Handle order completion
  const handleComplete = (orderId) => {
    console.log(`Order ${orderId} accepted`);
    // Implement order completion logic
  };

  // Handle order cancellation
  const handleCancel = (orderId) => {
    console.log(`Order ${orderId} rejected`);
    // Implement order cancellation logic
  };

  return (
    <div className="flex h-screen">
      {/* Orders List */}
      <div className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto">
        <Element name="orders-list">
          {orders.map(order => (
            <OrderItem key={order._id} order={order} onSelect={setSelectedOrder} />
          ))}
        </Element>
      </div>

      {/* Order Details */}
      <div className="w-1/3 h-full p-4 bg-white overflow-auto">
        {selectedOrder ? (
          <OrderDetails order={selectedOrder} />
        ) : (
          <p className="text-gray-500">Select an order to view details.</p>
        )}
      </div>

      {/* Cart Section */}
      <div className="w-1/3 h-full p-4 border-l border-gray-300 bg-white">
        <CartSection order={selectedOrder} onComplete={handleComplete} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default HomeOrdersSection;
