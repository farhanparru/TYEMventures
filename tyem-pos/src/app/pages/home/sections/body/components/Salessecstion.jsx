import React, { useState } from 'react';

const salesData = [
  {
    id: '967782782207240017',
    items: 1,
    amount: '₹70.00',
    paymentMethod: 'Cash',
    date: 'Mon, Jul 22, 2024, 6:53 AM',
  },
  {
    id: '967782782207240016',
    items: 1,
    amount: '₹40.00',
    paymentMethod: 'Card',
    date: 'Mon, Jul 22, 2024, 6:53 AM',
  },
  {
    id: '96778281607240015',
    items: 1,
    amount: '₹390.00',
    paymentMethod: 'Other',
    date: 'Tue, Jul 16, 2024, 10:17 AM',
  },
  {
    id: '967782781607240014',
    items: 1,
    amount: '₹50.00',
    paymentMethod: 'Card',
    date: 'Tue, Jul 16, 2024, 12:40 PM',
  },
  {
    id: '967782781607240013',
    items: 1,
    amount: '₹60.00',
    paymentMethod: 'Cash',
    date: 'Tue, Jul 16, 2024, 11:17 AM',
  },
  // Add more data as needed
];

const SalesSection = () => {
  const [selectedOrder, setSelectedOrder] = useState(salesData[0]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handlePrint = () => {
    // Implement print functionality
    console.log('Printing invoice...');
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading invoice...');
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 border-r border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Showing {salesData.length}/{salesData.length} orders</h2>
        <ul>
          {salesData.map((order) => (
            <li
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`p-4 mb-2 border border-gray-300 rounded-md cursor-pointer ${selectedOrder.id === order.id ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'}`}
            >
              <div className="font-bold">#{order.id}</div>
              <div>{order.items} Item | {order.amount} | {order.paymentMethod}</div>
              <div className="text-sm text-gray-500">{order.date}</div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="w-2/4 p-4" style={{ height: '500px', overflowY: 'auto' }}>
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="relative">
            <button onClick={handleDropdownToggle} className="bg-blue-500 text-white py-2 px-4 rounded-md">
              Invoice
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20">
                <button onClick={handlePrint} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                  Print
                </button>
                <button onClick={handleDownload} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                  Download
                </button>
              </div>
            )}
          </div>
        <div className="border p-4 rounded-md shadow-md h-full">
          <div className="mb-4">
            <div className="font-bold">Invoice Number: {selectedOrder.id}</div>
            <div>Payment Method: {selectedOrder.paymentMethod}</div>
            <div>Amount Tendered: ₹2,000.00</div>
            <div>Change Given: ₹1,930.00</div>
            <div>Date & Time: {selectedOrder.date}</div>
          </div>
          
          <h2 className="text-lg font-semibold mb-4 mt-6">Customer Details</h2>
          <div className="border p-4 rounded-md shadow-md">
            <div>Name: Muhammad Shamin Farhan Farhan</div>
            <div>Phone Number: xxxxxx7703</div>
          </div>
        </div>
      </div>
      <div className="w-1/4 p-4 border-l border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Cart</h2>
        <div className="border p-4 rounded-md shadow-md bg-gray-900 text-white w-full" style={{ height: '700px' }}>
          <div className="flex justify-between items-center mb-60">
            <span className="font-bold">{selectedOrder.items > 0 ? 'CHICKEN SHAWARMA ROLL (NORMAL)' : 'CUCUMBER'}</span>
            <span>₹{selectedOrder.amount}</span>
            <span>× 1</span>
            <span>₹{selectedOrder.amount}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Subtotal:</span>
            <span>₹{selectedOrder.amount}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Discount:</span>
            <span>₹50.00</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Total:</span>
            <span>₹350.00</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Item:</span>
            <span>1</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Quantity:</span>
            <span>1.000</span>
          </div>
          <div className="flex space-x-2 mt-auto">
            <button className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md h-12">Refund</button>
            <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md h-12">Receipt</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesSection;
