import React from 'react';

const SalesSection = () => {
  return (
    <div className="flex">
      {/* Orders List */}
      <div className="w-1/4 p-4 bg-white border-r">
        <div className="mb-4">
          <button className="text-blue-600">Refresh</button>
          <label className="flex items-center ml-4">
            <input type="checkbox" className="mr-2" /> Completed Orders
          </label>
        </div>
        <div className="space-y-4">
          <OrderCard orderId="#71" invoiceId="20" items="1 Item" amount="160.00 SAR" status="Accepted" date="2024/07/07 9:57 am" />
          <OrderCard orderId="#71" invoiceId="21" items="1 Item" amount="160.00 SAR" status="Accepted" date="2024/07/07 9:57 am" />
          <OrderCard orderId="#72" invoiceId="22" items="2 Item" amount="560.00 SAR" status="Accepted" date="2024/07/07 9:50 pm" />
          {/* Add more OrderCard components as needed */}
        </div>
      </div>

      {/* Order Details */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="font-bold">Order Details</h2>
        <p><strong>Order ID:</strong> #72</p>
        <p><strong>Invoice ID:</strong> 22</p>
        <p><strong>Ordered At:</strong> 7/7/2024</p>
        <p><strong>Total Amount:</strong> SAR</p>
        <p><strong>Payment Method:</strong> CREDIT</p>
        <p><strong>Callcenter Agent:</strong> GOLDEN BAKERY</p>
        <p><strong>Order Type:</strong> PICK-UP</p>
        <h3 className="mt-4 font-bold">Customer Details</h3>
        <p><strong>Name:</strong> Mus@b</p>
        <p><strong>Address:</strong> Not Found</p>
        <p><strong>Phone:</strong> +966551479476</p>
        <h3 className="mt-4 font-bold">Order Status History</h3>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="h-2 bg-green-600 rounded-full"></div>
          </div>
          <div className="ml-2">Confirmed</div>
          <div className="ml-4">
            <div className="h-2 bg-gray-300 rounded-full"></div>
          </div>
          <div className="ml-2">Ready</div>
        </div>
      </div>

      {/* Cart */}
      <div className="w-2/4 p-4 bg-gray-800 text-white">
        <div className="mb-4">
          <div className="flex justify-between">
            <span>CHICKEN POP(S)</span>
            <span>SAR 90.00 x2.00 SAR 180.00</span>
          </div>
          <div className="flex justify-between">
            <span>CHICKEN STRIPS (F)</span>
            <span>SAR 380.00 x1.00 SAR 380.00</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-600 pt-4">
          <span>Subtotal</span>
          <span>SAR 560.00</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>SAR</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>SAR</span>
        </div>
        <div className="flex justify-between font-bold border-t border-gray-600 pt-4">
          <span>Total</span>
          <span>SAR 560.00</span>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button className="bg-green-600 py-2 px-4 rounded">Complete</button>
          <button className="bg-red-600 py-2 px-4 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ orderId, invoiceId, items, amount, status, date }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <p>{orderId} | INV# {invoiceId}</p>
      <p>{items} {amount} | PICK-UP</p>
      <p>{status}</p>
      <p>{date}</p>
    </div>
  );
};

export default SalesSection;
