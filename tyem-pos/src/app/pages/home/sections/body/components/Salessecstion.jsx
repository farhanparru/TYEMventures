import React, { useState } from 'react';

const orderDetails = {
  orderId: 72,
  invoiceId: 22,
  orderedAt: '7/7/2024',
  totalAmount: 'SAR 560.00',
  paymentMethod: 'CREDIT',
  callcenterAgent: 'GOLDEN BAKERY',
  orderType: 'PICK-UP',
  customer: {
    name: 'Mus@b',
    address: 'Not Found',
    phone: '+966551479476',
  },
  status: 'Confirmed',
  items: [
    { name: 'CHICKEN POP(S)', price: 90, quantity: 2 },
    { name: 'CHICKEN STRIPS (F)', price: 380, quantity: 1 },
  ],
};

const OrderDetails = () => {
  const [status, setStatus] = useState(orderDetails.status);

  const handleStatusChange = () => {
    setStatus((prevStatus) => (prevStatus === 'Confirmed' ? 'Ready' : 'Confirmed'));
  };

  const calculateTotal = () => {
    return orderDetails.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
        <div>
          <div className="mb-2"><strong>Order ID:</strong> #{orderDetails.orderId}</div>
          <div className="mb-2"><strong>Invoice ID:</strong> {orderDetails.invoiceId}</div>
          <div className="mb-2"><strong>Ordered At:</strong> {orderDetails.orderedAt}</div>
          <div className="mb-2"><strong>Total Amount:</strong> {orderDetails.totalAmount}</div>
          <div className="mb-2"><strong>Payment Method:</strong> {orderDetails.paymentMethod}</div>
          <div className="mb-2"><strong>Callcenter Agent:</strong> {orderDetails.callcenterAgent}</div>
          <div className="mb-2"><strong>Order Type:</strong> {orderDetails.orderType}</div>
        </div>
        <h2 className="text-lg font-semibold mt-4 mb-4">Customer Details</h2>
        <div>
          <div className="mb-2"><strong>Name:</strong> {orderDetails.customer.name}</div>
          <div className="mb-2"><strong>Address:</strong> {orderDetails.customer.address}</div>
          <div className="mb-2"><strong>Phone:</strong> {orderDetails.customer.phone}</div>
        </div>
        <h2 className="text-lg font-semibold mt-4 mb-4">Order Status History</h2>
        <div className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full mr-2 ${status === 'Confirmed' ? 'bg-green-500' : 'bg-gray-300'}`}
            onClick={handleStatusChange}
          ></div>
          <div>{status}</div>
        </div>
      </div>
      <div className="w-2/3 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Cart</h2>
        <div className="border p-4 rounded-md shadow-md bg-gray-900 text-white w-full flex-grow">
          {orderDetails.items.map((item, index) => (
            <div className="flex justify-between items-center mb-4" key={index}>
              <span className="font-bold">{item.name}</span>
              <span>SAR {item.price.toFixed(2)}</span>
              <span>× {item.quantity}</span>
              <span>SAR {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center mb-4">
            <span>Subtotal:</span>
            <span>SAR {calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Tax:</span>
            <span>SAR 0.00</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Discount:</span>
            <span>SAR 0.00</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Total:</span>
            <span>SAR {calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Items:</span>
            <span>{orderDetails.items.length}</span>
          </div>
          <div className="flex space-x-2 mt-auto">
            <button className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md h-12">Cancel</button>
            <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md h-12">Complete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
