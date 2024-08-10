import React from 'react';
import { Link, Element } from 'react-scroll';

const Salessecstion = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Order List Section */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm text-gray-600">Showing 16 / 16 orders</p>
        </div>
        <ul className="space-y-2">
          <li>
            <Link
              activeClass="bg-blue-500 text-white"
              to="order1"
              spy={true}
              smooth={true}
              offset={-50}
              duration={500}
              className="block p-4 hover:bg-gray-200 cursor-pointer border-b rounded-md"
            >
              <p className="font-bold"># 967782780708240020</p>
              <p className="text-sm">1 Item | ₹100.00 | Cash</p>
              <p className="text-sm">Wed, Aug 7, 2024, 11:47 PM</p>
            </Link>
          </li>
          {/* Additional orders */}
          <li>
            <Link
              to="order2"
              spy={true}
              smooth={true}
              offset={-50}
              duration={500}
              className="block p-4 hover:bg-gray-200 cursor-pointer border-b rounded-md"
            >
              <p className="font-bold"># 967782782207240018</p>
              <p className="text-sm">1 Item | ₹40.00 | Credit</p>
              <p className="text-sm">Sat, Jul 27, 2024, 6:50 AM</p>
            </Link>
          </li>
          {/* More list items */}
        </ul>
      </div>

      {/* Payment Details Section */}
      <div className="w-3/4 p-6 bg-gray-50">
        <Element name="order1">
          <h2 className="text-xl font-bold mb-4">Payment Details</h2>
          <div className="mb-4">
            <p><span className="font-bold">Invoice Number:</span> 967782780708240020</p>
            <p><span className="font-bold">Pos Store Order #:</span> 037100</p>
            <p><span className="font-bold">Payment Method:</span> Cash</p>
            <p><span className="font-bold">Amount Tendered:</span> ₹100.00</p>
            <p><span className="font-bold">Date & Time:</span> Wed, Aug 7, 2024, 11:47 PM</p>
          </div>
        </Element>

        <Element name="order2">
          <h2 className="text-xl font-bold mb-4">Customer Details</h2>
          <div className="mb-4">
            <p><span className="font-bold">Name:</span> Shanu</p>
            <p><span className="font-bold">Phone Number:</span> xxxxxx1230</p>
          </div>

          <div className="flex items-center text-green-500">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-bold">Transaction Synced</p>
          </div>
          <p className="text-gray-500">Wed, Aug 7, 2024, 11:48 PM</p>
        </Element>

        {/* Cart Component */}
        <Cart />
      </div>
    </div>
  );
}

// Cart Component Definition
const Cart = () => {
  return (
    <div className="max-w-sm mx-auto bg-gray-800 text-white rounded-lg shadow-lg mt-8">
      {/* Cart Header */}
      <div className="flex justify-between items-center p-3 bg-gray-900 rounded-t-lg">
        <span className="font-bold">CUCUMBER</span>
        <div className="flex space-x-4">
          <span>₹40.00</span>
          <span>x 1</span>
          <span>₹40.00</span>
        </div>
      </div>

      {/* Cart Body */}
      <div className="p-4 h-48">
        {/* Additional items or content can be added here */}
      </div>

      {/* Cart Footer */}
      <div className="bg-gray-700 p-4 rounded-b-lg">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹40.00</span>
        </div>
        <hr className="my-2 border-gray-600" />
        <div className="flex justify-between mb-4">
          <span>Item</span>
          <span>1</span>
          <span>Quantity</span>
          <span>1.000</span>
          <span>Total</span>
          <span>₹40.00</span>
        </div>
        <div className="flex justify-between space-x-4">
          <button className="flex-1 bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600">↩ Refund</button>
          <button className="flex-1 bg-green-600 py-2 rounded-md hover:bg-green-700">🧾 Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default Salessecstion;
