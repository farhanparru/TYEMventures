import React from 'react';

const CustomerDetails = ({ customer }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Customer Details</h2>
      
      </div>
      <div className="mb-4">
        <input type="checkbox" className="mr-2" id="default-customer" />
        <label htmlFor="default-customer">use as default customer on checkout</label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b py-2">
          <span className="font-bold">First Name:</span> {customer.firstName}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Last Name:</span> {customer.lastName}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Mobile Number:</span> {customer.mobileNumber}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">E-Mail:</span> {customer.email}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Company Name:</span> {customer.companyName}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">TRN:</span> {customer.trn}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Group:</span> {customer.group}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Address:</span> {customer.address}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Loyalty Points:</span> {customer.loyaltyPoints}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Credit Limit:</span> ₹{customer.creditLimit}
        </div>
        <div className="border-b py-2">
          <span className="font-bold text-red-500">Credits Given:</span> ₹{customer.creditsGiven}
        </div>
        <div className="border-b py-2">
          <span className="font-bold text-green-500">Payment Received:</span> ₹{customer.paymentReceived}
        </div>
        <div className="border-b py-2">
          <span className="font-bold">Credit Outstanding:</span> ₹{customer.creditOutstanding}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
