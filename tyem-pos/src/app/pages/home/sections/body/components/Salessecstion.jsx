import React, { useState } from 'react';

const ShowOrders = ({ orders, onRefresh, onToggleCompleted, onSelectOrder }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button className="text-blue-500 hover:underline" onClick={onRefresh}>
          Refresh
        </button>
        <div className="flex items-center">
          <span className="mr-2">Completed Orders</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" onChange={onToggleCompleted} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>
      <div className="text-sm text-gray-600 mb-2">{orders.length} Orders</div>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center cursor-pointer" onClick={() => onSelectOrder(order)}>
            <div>
              <div className="font-semibold text-lg">Order #{order.orderMeta.posOrderId} | INV# {order.orderMeta.invoiceId}</div>
              <div className="text-sm text-gray-500">{order.orderDetails.length} Item | {order.orderMeta.paymentTendered} {order.orderDetails[0].product_currency} | {order.orderMeta.orderType}</div>
              <div className="text-xs text-gray-500">{order.orderMeta.orderedAt}</div>
              <span className="mt-2 inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded">Accepted</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderDetails = ({ order }) => {
  if (!order) {
    return <div className="p-4 bg-gray-100 text-gray-500 rounded-lg">Select an order to view details.</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Order Details</h2>
      <div className="mb-2"><strong>Order ID:</strong> <span className="text-black">#{order.orderMeta.posOrderId}</span></div>
      <div className="mb-2"><strong>Invoice ID:</strong> <span className="text-black">{order.orderMeta.invoiceId}</span></div>
      <div className="mb-2"><strong>Ordered At:</strong> <span className="text-black">{order.orderMeta.orderedAt}</span></div>
      <div className="mb-2"><strong>Total Amount:</strong> <span className="text-black">{order.orderMeta.paymentTendered} {order.orderDetails[0].product_currency}</span></div>
      <div className="mb-2"><strong>Payment Method:</strong> <span className="text-black">{order.orderMeta.paymentMethod}</span></div>
      <div className="mb-2"><strong>Callcenter Agent:</strong> <span className="text-black">{order.orderMeta.callcenterAgent}</span></div>
      <div className="mb-2"><strong>Order Type:</strong> <span className="text-black">{order.orderMeta.orderType}</span></div>

      <h2 className="text-lg font-semibold mt-4 mb-4">Customer Details</h2>
      <div className="mb-2"><strong>Name:</strong> <span className="text-black">{order.customerDetails.name}</span></div>
      <div className="mb-2"><strong>Address:</strong> <span className="text-black">{order.customerDetails.address}</span></div>
      <div className="mb-2"><strong>Phone:</strong> <span className="text-black">{order.customerDetails.phone}</span></div>

      <h2 className="text-lg font-semibold mt-4 mb-4">Order Status History</h2>
      <div className="flex items-center">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="ml-2 text-black">Confirmed</span>
        </div>
        <div className="flex-1 border-t border-gray-300 mx-4"></div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5" />
            </svg>
          </div>
          <span className="ml-2 text-gray-500">Ready</span>
        </div>
      </div>
    </div>
  );
};

const CartSection = ({ order, onComplete, onCancel }) => {
  if (!order) {
    return <div className="flex items-center justify-center h-24 p-4 bg-gray-100 text-gray-500 rounded-lg">Select an order to view cart items.</div>;
  }

  const calculateTotal = () => {
    return order.orderDetails.reduce((total, item) => total + item.product_price * item.product_quantity, 0);
  };

  return (
    <div className="flex flex-col h-[500px] p-3 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
      <div className="flex-grow overflow-y-auto mb-4">
        {order.orderDetails.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md text-black mb-2">
            <span className="font-semibold">{item.product_name}</span>
            <span>{item.product_currency} {item.product_price.toFixed(2)}</span>
            <span>× {item.product_quantity}</span>
            <span>{item.product_currency} {(item.product_price * item.product_quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-700 text-white rounded-md">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Subtotal</span>
          <span>{order.orderMeta.paymentTendered} {order.orderDetails[0].product_currency}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>{order.orderMeta.tax} {order.orderDetails[0].product_currency}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Discount</span>
          <span>{order.orderMeta.discount} {order.orderDetails[0].product_currency}</span>
        </div>
        <div className="flex justify-between items-center gap-2 mb-4">
          <span className="font-semibold">Total</span>
          <span>{calculateTotal().toFixed(2)} {order.orderDetails[0].product_currency}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <button
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
            onClick={() => onComplete(order.orderMeta.posOrderId)}
          >
            Accept
          </button>
          <button
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
            onClick={() => onCancel(order.orderMeta.posOrderId)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};


const App = () => {
  const sampleOrders = [
    {
      orderMeta: {
        posOrderId: 71,
        invoiceId: 20,
        orderedAt: '2024/07/07 9:57 am',
        paymentTendered: '160.00',
        paymentMethod: 'CREDIT',
        callcenterAgent: 'GOLDEN BAKERY',
        orderType: 'PICK-UP',
        tax: '0.00',
        discount: '0.00',
      },
      customerDetails: {
        name: 'Mus@b',
        address: 'Not Found',
        phone: '+966551479476',
      },
      orderDetails: [
        { product_name: 'CHICKEN POP(S)', product_price: 90, product_quantity: 1, product_currency: 'SAR' },
        { product_name: 'CHICKEN STRIPS (F)', product_price: 70, product_quantity: 1, product_currency: 'SAR' },
      ],
    },
    {
      orderMeta: {
        posOrderId: 72,
        invoiceId: 22,
        orderedAt: '7/7/2024',
        paymentTendered: '560.00',
        paymentMethod: 'CREDIT',
        callcenterAgent: 'GOLDEN BAKERY',
        orderType: 'PICK-UP',
        tax: '0.00',
        discount: '0.00',
      },
      customerDetails: {
        name: 'Mus@b',
        address: 'Not Found',
        phone: '+966551479476',
      },
      orderDetails: [
        { product_name: 'CHICKEN POP(S)', product_price: 90, product_quantity: 2, product_currency: 'SAR' },
        { product_name: 'CHICKEN STRIPS (F)', product_price: 380, product_quantity: 1, product_currency: 'SAR' },
      ],
    },
  ];

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleComplete = (orderId) => {
    console.log(`Order ${orderId} completed`);
  };

  const handleCancel = (orderId) => {
    console.log(`Order ${orderId} cancelled`);
  };

  const handleRefresh = () => {
    console.log('Orders refreshed');
  };

  const handleToggleCompleted = () => {
    console.log('Toggle completed orders');
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="flex h-screen p-4 space-x-4">
      <div className="w-1/4">
        <ShowOrders orders={sampleOrders} onRefresh={handleRefresh} onToggleCompleted={handleToggleCompleted} onSelectOrder={handleSelectOrder} />
      </div>
      <div className="w-1/4">
        <OrderDetails order={selectedOrder} />
      </div>
      <div className="w-1/2">
        <CartSection order={selectedOrder} onComplete={handleComplete} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default App;
