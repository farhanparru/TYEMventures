import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Element } from 'react-scroll';
import { FaCheckCircle, FaRegClock } from 'react-icons/fa';
import  OrderNotification from '../components/OrderNotification'



// OrderItem component to display individual orders
const OrderItem = ({ order, onSelect }) => {
  const totalItems = order.orderDetails.products.reduce((total, product) => total + product.product_quantity, 0);
  const orderDate = new Date(order.orderDetails.orderDate);
  const formattedDate = orderDate.toLocaleDateString(); // Format the date
  const orderTime = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time

  return (
    <div 
      className="p-4 mb-4 bg-white rounded-lg shadow-md flex flex-col justify-between border border-gray-200 cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(order)}
    >
      <OrderNotification setOrders={setOrders} />
      <div>
        <h3 className="text-lg font-semibold">Order #{order.orderDetails.posOrderId} | INV# {order.orderDetails.orderType}</h3>
        <p className="text-sm">{totalItems} Item{totalItems > 1 ? 's' : ''} | {order.orderDetails.paymentTendered.toFixed(2)} </p>
        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded ${order.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {order.orderDetails.paymentStatus}
          </span>
          {order.new && <span className="ml-2 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">New</span>}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <p><strong>Payment Method:</strong> {order.orderDetails.paymentMethod}</p>
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        <p><strong>Order Date:</strong> {formattedDate}</p> {/* Displaying order date */}
        <p><strong>Order Time:</strong> {orderTime}</p> {/* Displaying order time */}
      </div>
    </div>
  );
};

const OrderDetails = ({ order }) => {
  if (!order) {
    return <div className="p-4 bg-gray-100 text-gray-500 rounded-lg">Select an order to view details.</div>;
  }

  
 
  // Format the order date
  const orderDate = new Date(order.orderDetails.orderDate);
  const formattedDate = orderDate.toLocaleDateString(); // e.g., MM/DD/YYYY
  const orderTime = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., HH:MM AM/PM

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Order Details</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-semibold">Order ID</h4>
          <p>#{order.orderDetails.posOrderId}</p>
        </div>
        <div>
          <h4 className="font-semibold">Invoice ID</h4>
          <p>{order.orderDetails.orderType}</p>
        </div>
        <div>
          <h4 className="font-semibold">Ordered At</h4>
          <p>{formattedDate} {orderTime}</p>
        </div>
        <div>
          <h4 className="font-semibold">Total Amount</h4>
          <p>{order.orderDetails.paymentTendered.toFixed(2)}</p>
        </div>
        <div>
          <h4 className="font-semibold">Payment Method</h4>
          <p>{order.orderDetails.paymentMethod}</p>
        </div>
        <div>
          <h4 className="font-semibold">Payment Status</h4>
          <p>{order.orderDetails.paymentStatus}</p>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-semibold">Name</h4>
          <p>{order.customer.name}</p>
        </div>
        <div>
          <h4 className="font-semibold">Email</h4>
          <p>{order.customer.email}</p>
        </div>
        <div>
          <h4 className="font-semibold">Phone</h4>
          <p>{order.customer.phone}</p>
        </div>
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
;


// CartSection component to display cart details based on the selected order
const CartSection = ({ order, onComplete, onCancel }) => {
  
  if (!order) {
    return <div className="p-4 bg-gray-100 text-gray-500 rounded-lg">Select an order to view cart items.</div>;
  }



  return (
    <div className="flex flex-col h-full p-5 bg-gray-800 text-white rounded-lg shadow-lg">
     
      <div className="flex-grow overflow-y-auto mb-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-md mb-4">
              <span className="font-semibold">{item.product_name}</span> {/* Product Name */}
              <span>{item.price?.toFixed(2) || '0.00'} {currency}</span> {/* Price */}
              <span>×{item.quantity || 0}</span> {/* Quantity */}
              <span>{(item.price * item.quantity || 0).toFixed(2)} {currency}</span> {/* Total Price */}
            </div>
          ))
        ) : (
          <div className="p-4 bg-gray-600 rounded-md">No items in the cart.</div>
        )}
      </div>
      
      {/* Cart Totals Display */}
      <div className="bg-gray-700 p-4 rounded-lg " style={{marginBottom:"36px"}}>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Subtotal</span>
          <span>{subtotal.toFixed(2)} {currency}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Discount</span>
          <span>-{discount.toFixed(2)} {currency}</span>
        </div>
        <div className="flex justify-between font-bold text-xl mb-4">
          <span>Total</span>
          <span>{total.toFixed(2)} {currency}</span>
        </div>
        
        <div className="flex justify-between items-center gap-2 ">
          <button
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            onClick={() => onComplete(order.number)}
          >
           Accept
          </button>
          <button
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            onClick={() => onCancel(order.number)}
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
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Updated orders list with new data
  const orders = [
    {
      number: 71,
      invoice: 21,
      items: 1,
      total: 160.00,
      currency: 'SAR',
      type: 'PICK-UP',
      status: 'Pending',
      date: '2024/07/07 9:57 am',
      new: true,
      paymentMethod: 'CREDIT',
      agent: 'GOLDEN BAKERY',
      customer: {
        name: 'mahroof',
        address: 'Not Found',
        phone: '+919895639688',
      },
    },
   
  ];

  return (
    <div className="flex h-screen">
      <div className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto" style={{marginBlock:"-20px"}}>
        <Element name="orders-list">
          {orders.map(order => (
            <OrderItem key={order.number} order={order} onSelect={setSelectedOrder} />
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
      <div className="w-1/3 h-full p-4 border-l border-gray-300 bg-white" style={{marginTop:"-20px"}}>
        <h2 className="text-2xl font-bold mb-4"></h2>
        <CartSection order={selectedOrder} />
      </div>
    </div>
  );
};

export default HomeOrdersSection;
