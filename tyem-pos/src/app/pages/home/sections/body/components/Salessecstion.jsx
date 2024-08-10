import React from 'react';

const SalesSection = () => {
  return (
    <div className="flex h-screen">
      {/* Orders List */}
      <div className="w-1/4 border-r p-2 overflow-y-auto bg-white">
        <p className="font-bold mb-2">Showing 16 / 16 orders</p>
        <div className="space-y-2">
          {/* Order Item */}
          <div className="p-4 bg-blue-500 text-white border-b cursor-pointer">
            <p className="font-semibold"># 96778278207240020</p>
            <p>1 Item | ₹100.00 | Cash</p>
            <p>Wed, Aug 7, 2024, 11:47 PM</p>
          </div>
          <div className="p-4 bg-gray-100 border-b cursor-pointer">
            <p className="font-semibold"># 96778278207240018</p>
            <p>1 Item | ₹40.00 | Credit</p>
            <p>Sat, Jul 27, 2024, 6:50 AM</p>
          </div>
          {/* Add more order items similarly */}
        </div>
      </div>

      {/* Payment & Customer Details */}
      <div className="w-3/4 p-4 flex flex-col space-y-4 bg-gray-50">
        <div>
          <p className="text-lg font-semibold">Payment Details</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>Invoice Number :</p>
            <p className="font-semibold">96778278207240020</p>
            <p>POS Store Order # :</p>
            <p className="font-semibold">037100</p>
            <p>Payment Method :</p>
            <p className="font-semibold">Cash</p>
            <p>Amount Tendered :</p>
            <p className="font-semibold">₹100.00</p>
            <p>Date & Time :</p>
            <p className="font-semibold">Wed, Aug 7, 2024, 11:47 PM</p>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold">Customer Details</p>
          <div className="text-sm">
            <p>Name: <span className="font-semibold">Shanu</span></p>
            <p>Phone Number: <span className="font-semibold">xxxxxx1230</span></p>
          </div>
        </div>
        <div className="mt-4 text-green-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="ml-2 text-sm">Transaction Synced</p>
          <p className="ml-2 text-sm text-gray-400">Wed, Aug 7, 2024, 11:48 PM</p>
        </div>
        <button className="bg-blue-100 text-blue-500 text-sm py-1 px-3 rounded-md self-end">Invoice</button>
      </div>
    </div>
  );
};

export default SalesSection;
