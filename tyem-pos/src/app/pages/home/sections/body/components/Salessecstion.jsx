import React from 'react';

const SalesSection = () => {
  return (
    <div className="flex flex-col w-full h-screen p-4">
      {/* Search & Filter Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <input type="text" placeholder="Search by invoice #" className="p-2 border rounded" />
          <input type="text" placeholder="Customer name" className="p-2 border rounded" />
          <select className="p-2 border rounded">
            <option>Payment Method</option>
            <option>Cash</option>
            <option>Credit</option>
            <option>Card</option>
            <option>Other</option>
          </select>
          <input type="date" placeholder="Date Range" className="p-2 border rounded" />
          <select className="p-2 border rounded">
            <option>Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Export</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Clear All</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Orders List */}
        <div className="w-1/4 border-r p-2 overflow-y-auto">
          <p className="font-bold">Showing 16 / 16 orders</p>
          <div className="mt-4">
            {/* Order Item */}
            <div className="p-4 bg-gray-100 border-b mb-2 cursor-pointer">
              <p className="font-semibold"># 96778278207240020</p>
              <p>1 Item | ₹100.00 | Cash</p>
              <p>Wed, Aug 7, 2024, 11:47 PM</p>
            </div>
            <div className="p-4 bg-blue-200 border-b mb-2 cursor-pointer">
              <p className="font-semibold"># 96778278207240017</p>
              <p>1 Item | ₹70.00 | Cash</p>
              <p>Mon, Jul 22, 2024, 6:53 AM</p>
            </div>
            {/* Add more order items similarly */}
          </div>
        </div>

        {/* Payment & Customer Details */}
        <div className="w-2/4 p-4">
          <div className="mb-4">
            <p className="text-lg font-semibold">Payment Details</p>
            <p>Invoice Number: 96778278207240017</p>
            <p>Payment Method: Cash</p>
            <p>Amount Tendered: ₹2,000.00</p>
            <p>Change Given: ₹1,930.00</p>
            <p>Date & Time: Mon, Jul 22, 2024, 6:53 AM</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Customer Details</p>
            <p>Name: Muhammad Shamin Farhan Farhan</p>
            <p>Phone Number: xxxxxx7703</p>
          </div>
          <div className="mt-4 text-green-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="ml-2">Transaction Synced</p>
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col justify-between">
          <div>
            <p>CHICKEN SHAWARMA ROLL (NORMAL)</p>
            <p>₹70.00 × 1 = ₹70.00</p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₹70.00</p>
            </div>
            <div className="flex justify-between mt-2">
              <p>Total</p>
              <p className="text-xl font-bold">₹70.00</p>
            </div>
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-yellow-500 text-black py-2 rounded">Refund</button>
              <button className="flex-1 bg-green-500 text-black py-2 rounded">Receipt</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSection;
