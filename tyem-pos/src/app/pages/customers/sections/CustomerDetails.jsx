import React from 'react';

const CustomerDetails = ({ selectedCustomer }) => {
  return (
    <div>
      <h2>Customer Details</h2>
      <p><strong>First Name:</strong> {selectedCustomer.firstName}</p>
      <p><strong>Last Name:</strong> {selectedCustomer.lastName}</p>
      <p><strong>Mobile Number:</strong> {selectedCustomer.phone}</p>
      <p><strong>Email:</strong> {selectedCustomer.email}</p>
      <p><strong>Company Name:</strong> {selectedCustomer.companyName}</p>
      <p><strong>TRN:</strong> {selectedCustomer.trn}</p>
      <p><strong>Group:</strong> {selectedCustomer.group}</p>
      <p><strong>Address:</strong> {selectedCustomer.address}</p>
      <p><strong>Loyalty Points:</strong> {selectedCustomer.loyaltyPoints}</p>
      <p><strong>Credit Limit:</strong> {selectedCustomer.creditLimit}</p>
      <p><strong>Credits Given:</strong> {selectedCustomer.creditsGiven}</p>
      <p><strong>Payment Received:</strong> {selectedCustomer.paymentReceived}</p>
      <p><strong>Credits Outstanding:</strong> {selectedCustomer.creditsOutstanding}</p>
    </div>
  );
};

export default CustomerDetails;
