import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Element } from 'react-scroll';
import { FaCheckCircle, FaRegClock } from 'react-icons/fa';

// OrderItem component to display individual orders
const OrderItem = ({ order, onSelect }) => {
  return (
    <div 
      className="p-4 mb-4 bg-white rounded-lg shadow-md flex justify-between items-center border border-gray-200 cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(order)}
    >
      <div>
        <h3 className="text-lg font-semibold">Order #{order.number} | INV# {order.invoice}</h3>
        <p className="text-sm">{order.items.length} Item{order.items.length > 1 ? 's' : ''} | {order.total} {order.currency} | {order.type}</p>
        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded ${order.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {order.status}
          </span>
          {order.new && <span className="ml-2 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">New</span>}
        </div>
      </div>
      <div className="text-sm text-gray-500">{order.date}</div>
    </div>
  );
};

// OrderDetails component to display selected order details
const OrderDetails = ({ order }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Order Details</h3>
      <div className="mb-4">
        <h4 className="font-semibold">Order ID</h4>
        <p>#{order.number}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Invoice Number</h4>
        <p>{order.invoice}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Total Items</h4>
        <p>{order.items.length}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Total Amount</h4>
        <p>{order.total} {order.currency}</p>
      </div>
      <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
      <div className="mb-4">
        <h4 className="font-semibold">Name</h4>
        <p>{order.customer.name}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Email</h4>
        <p>{order.customer.email}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Phone</h4>
        <p>{order.customer.phone}</p>
      </div>
      {order.customer.address && (
        <div className="mb-4">
          <h4 className="font-semibold">Address</h4>
          <p>{order.customer.address}</p>
        </div>
      )}
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


const CartSection = ({ order }) => {
  if (!order) {
    return <div className="p-4 bg-gray-100 text-gray-500 rounded-lg">Select an order to view cart items.</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      {order.items.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-md text-black mb-4">
          <span className="font-semibold">{item.name}</span>
          <span>{item.price.toFixed(2)} {order.currency}</span>
          <span>×{item.quantity}</span>
          <span>{(item.price * item.quantity).toFixed(2)} {order.currency}</span>
        </div>
      ))}
      <div className="mt-auto p-4 bg-gray-700 text-white">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Subtotal</span>
          <span>{order.subtotal.toFixed(2)} {order.currency}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Tax</span>
          <span>{order.tax.toFixed(2)} {order.currency}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Discount</span>
          <span>-{order.discount.toFixed(2)} {order.currency}</span>
        </div>
        <div className="flex justify-between items-center gap-2 ">
          <span>Total</span>
          <span>{order.total.toFixed(2)} {order.currency}</span>
        </div>
        <div className="className= flex justify-between items-center gap-2 ">
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

  // Sample orders
  const orders = [
    {
      number: '001',
      invoice: 'INV001',
      items: [
        { name: 'Chicken Pop (L)', price: 160, quantity: 1 },
        { name: 'Burger', price: 50, quantity: 2 }
      ],
      subtotal: 260.00,
      tax: 20.00,
      discount: 10.00,
      total: 270.00,
      currency: 'SAR',
      type: 'Dine-In',
      status: 'Accepted',
      new: true,
      date: '2024-07-30',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+123456789',
        address: '123 Main St, City, Country'
      }
    },
    {
      number: '002',
      invoice: 'INV002',
      items: [
        { name: 'Alfaham (L)', price: 160, quantity: 1 },
        { name: 'Chicken', price: 50, quantity: 2 }
      ],
      subtotal: 260.00,
      tax: 20.00,
      discount: 10.00,
      total: 270.00,
      currency: 'SAR',
      type: 'Pick-Up',
      status: 'Pending',
      new: false,
      date: '2024-07-07 09:57 AM',
      customer: {
        name: 'Mahroof',
        email: 'mahroof@example.com',
        phone: '+919895639688',
        address: 'Not Found'
      }
    }
  ];

  return (
    <div className="flex h-screen">
      {/* Orders List */}
      <div className="w-1/3 h-full p-4 border-r border-gray-300 bg-white overflow-y-auto">
        {/* <h2 className="text-2xl font-bold mb-4">Orders List</h2> */}
        <Element name="orders-list">
          {orders.map(order => (
            <OrderItem key={order.number} order={order} onSelect={setSelectedOrder} />
          ))}
        </Element>
      </div>

      {/* Order Details */}
      <div className="w-1/3 h-full p-4 bg-white overflow-auto">
        {/* <h2 className="text-2xl font-bold mb-4">Order Details</h2> */}
        {selectedOrder ? (
          <OrderDetails order={selectedOrder} />
        ) : (
          <p className="text-gray-500">Select an order to view details.</p>
        )}
      </div>

      {/* Cart Section */}
      <div className="w-1/3 h-full p-4 border-l border-gray-300 bg-white" style={{marginTop:"-20px"}}>
        {/* <h2 className="text-2xl font-bold mb-4">Cart Details</h2> */}
        <CartSection order={selectedOrder} />
      </div>
    </div>
  );
};

export default HomeOrdersSection;
