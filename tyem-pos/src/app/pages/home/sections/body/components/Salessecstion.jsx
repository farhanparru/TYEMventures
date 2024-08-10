import React, { useState } from 'react';
import { FaUndoAlt, FaPrint, FaDownload } from 'react-icons/fa';
import { Dropdown, Menu } from 'antd';
import { DownOutlined, UpOutlined, MailOutlined, MessageOutlined, WhatsAppOutlined } from '@ant-design/icons';

const SalesSection = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 bg-white p-4 rounded-lg shadow-lg overflow-y-auto h-[calc(100vh-150px)]">
          <OrderList />
        </div>
        <div className="col-span-6 bg-white p-6 rounded-lg shadow-lg h-[calc(100vh-150px)]">
          <OrderDetails />
        </div>
        <div className="col-span-3 bg-white p-6 rounded-lg shadow-lg h-[calc(100vh-150px)]">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <div className="mb-6 flex space-x-4">
      <input
        type="text"
        placeholder="Search by invoice #"
        className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Customer name"
        className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select className="w-1/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Payment Method</option>
        <option>Credit</option>
        <option>Cash</option>
        <option>Card</option>
      </select>
      <input
        type="date"
        className="w-1/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select className="w-1/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Status</option>
        <option>Paid</option>
        <option>Outstanding</option>
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
        Export
      </button>
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
        Clear All
      </button>
    </div>
  );
}

const OrderList = () => {
  const orders = [
    { invoice: '967782782207240018', items: 1, amount: 40, method: 'Credit', date: 'Sat, Jul 27, 2024, 6:50 AM', selected: true },
    { invoice: '967782782207240017', items: 1, amount: 70, method: 'Cash', date: 'Mon, Jul 22, 2024, 6:53 AM', selected: false },
    { invoice: '967782782207240016', items: 1, amount: 40, method: 'Card', date: 'Mon, Jul 22, 2024, 6:53 AM', selected: false },
    { invoice: '967782781607240015', items: 1, amount: 390, method: 'Other', date: 'Tue, Jul 16, 2024, 1:07 PM', selected: false },
    { invoice: '967782781607240014', items: 1, amount: 50, method: 'Card', date: 'Tue, Jul 16, 2024, 12:40 PM', selected: false },
    { invoice: '967782781607240013', items: 1, amount: 60, method: 'Cash', date: 'Tue, Jul 16, 2024, 11:17 AM', selected: false },
    // Add other orders here...
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Showing {orders.length} / {orders.length} orders</h2>
      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.invoice}
            className={`p-4 border rounded-lg cursor-pointer ${order.selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
          >
            <div className="font-bold">#{order.invoice}</div>
            <div>{order.items} Item | ₹{order.amount} | {order.method}</div>
            <div className="text-sm text-gray-600">{order.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const OrderDetails = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-800">
          <div>
            <div className="font-semibold">Invoice Number:</div>
            <div className="mt-2">Payment Method:</div>
            <div className="mt-2">Notes:</div>
            <div className="mt-2">Date & Time:</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">967782782207240018</div>
            <div className="mt-2">Credit</div>
            <div className="mt-2">noo</div>
            <div className="mt-2">Sat, Jul 27, 2024, 6:50 AM</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-800">
          <div>
            <div className="font-semibold">Name:</div>
            <div className="mt-2">Phone Number:</div>
            <div className="mt-2">Order Outstanding:</div>
          </div>
          <div className="text-right">
            <div className="mt-2">Mahroof</div>
            <div className="mt-2">xxxxxx9688</div>
            <div className="mt-2 text-red-500 font-bold">₹40.00</div>
          </div>
        </div>
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg mt-6 hover:bg-green-600 transition-colors">
          Pay Outstanding
        </button>
      </div>

      <div className="flex items-center text-green-500 mt-6">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <div className="ml-2">
          <div className="font-semibold">Transaction Synced</div>
          <div className="text-gray-500 text-sm">Sat, Jul 27, 2024, 6:50 AM</div>
        </div>
      </div>
    </div>
  );
}

const CartSummary = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<FaPrint />}>Print</Menu.Item>
      <Menu.Item key="2" icon={<FaDownload />}>Download</Menu.Item>
      <Menu.Item key="3" icon={<MailOutlined />}>e-mail</Menu.Item>
      <Menu.Item key="4" icon={<MessageOutlined />}>sms</Menu.Item>
      <Menu.Item key="5" icon={<WhatsAppOutlined />}>WhatsApp</Menu.Item>
    </Menu>
  );

  return (
    <div className="flex flex-col h-full p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="font-bold">Total Items: 1</div>
          <div className="mt-2 font-semibold">₹40.00</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="font-bold">Discount: ₹0.00</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="font-bold">Total Amount: ₹40.00</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="font-bold">Paid: ₹0.00</div>
        </div>
      </div>
      <div className="mt-auto">
        <Dropdown
          overlay={menu}
          trigger={['click']}
          visible={dropdownVisible}
          onVisibleChange={(flag) => setDropdownVisible(flag)}
        >
          <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg mt-6 hover:bg-blue-600 transition-colors flex items-center justify-between">
            More Options
            {dropdownVisible ? <UpOutlined className="ml-2" /> : <DownOutlined className="ml-2" />}
          </button>
        </Dropdown>
      </div>
    </div>
  );
}

export default SalesSection;
