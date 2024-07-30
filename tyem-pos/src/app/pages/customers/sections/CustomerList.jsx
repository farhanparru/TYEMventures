import React, { useState } from 'react';
import CustomerDetails from './CustomerDetails';
import AddCustomerModal from '../components/AddCustomerModal';
import { Drawer } from 'antd'; 
import SearchBar from './SearchBar';
const customers = [

  
  {
    firstName: 'Ashi',
    lastName: '',
    mobileNumber: 'xxxxxx9402',
    email: '',
    companyName: '',
    trn: '',
    group: '',
    address: '',
    loyaltyPoints: 0,
    creditLimit: 0,
    creditsGiven: 664,
    paymentReceived: 52,
    creditOutstanding: 612,
  },
  {
    firstName: 'Ashixx',
    lastName: '',
    mobileNumber: 'xxxxxx9402',
    email: '',
    companyName: '',
    trn: '',
    group: '',
    address: '',
    loyaltyPoints: 0,
    creditLimit: 0,
    creditsGiven: 664,
    paymentReceived: 52,
    creditOutstanding: 612,
  },
  {
    firstName: 'Ashi',
    lastName: '',
    mobileNumber: 'xxxxxx9402',
    email: '',
    companyName: '',
    trn: '',
    group: '',
    address: '',
    loyaltyPoints: 0,
    creditLimit: 0,
    creditsGiven: 664,
    paymentReceived: 52,
    creditOutstanding: 612,
  },
  
];

const CustomerList = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [open, setOpen] = useState(false)

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
         <SearchBar/>
         <button className="ml-2 bg-gray-200 p-2 rounded flex items-center justify-center h-full">
            Alt + S
          </button>
        </div>
        <div className="flex items-center">
        <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setOpen(true)} // Set open to true to open the modal
          >
            Add Customer
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">Print</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Pay Outstanding</button>
        </div>
      </div>
      <div className="flex justify-between mb-2">
        <span>Showing {customers.length} / {customers.length} customers</span>
        <a href="#" className="text-blue-500">Export</a>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded">
          {customers.map((customer, index) => (
            <div
              key={index}
              className={`p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-200 ${selectedCustomer === customer ? 'bg-blue-500' : ''}`}
              onClick={() => handleCustomerClick(customer)}
            >
              <p className="font-bold">{customer.firstName}</p>
              <p>{customer.mobileNumber}</p>
              <p className="text-blue-500">₹{customer.creditOutstanding}</p>
            </div>
          ))}
        </div>
        <AddCustomerModal isOpen={open} setOpen={setOpen} />
      {selectedCustomer && (
        <Drawer
          width="30%"
          placement="right"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
        
        </Drawer>
      )}
      <CustomerDetails customer={selectedCustomer} />
    </div>
    </div>
  );
};

export default CustomerList;
