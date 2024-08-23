import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const CartCustomerList = () => {
  // Dummy customer data
  const customers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Emily Johnson' },
    { id: 4, name: 'Michael Brown' },
    { id: 5, name: 'Sarah Davis' },
    { id: 6, name: 'Chris Green' },
    { id: 7, name: 'Nancy White' },
    { id: 8, name: 'Robert Black' },
    { id: 9, name: 'Patricia Gray' },
    { id: 10, name: 'Laura Pink' },
  ];

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Customer List</h2>
      <div className="max-h-64 overflow-y-auto">
        <ul className="space-y-3">
          {customers.map((customer) => (
            <li
              key={customer.id}
              className="flex items-center p-2 border-b border-gray-200"
            >
              <FaUserCircle className="w-8 h-8 text-gray-500 mr-3" />
              <span className="text-gray-800">{customer.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CartCustomerList;
