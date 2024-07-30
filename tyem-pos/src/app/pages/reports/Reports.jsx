import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaPrint, FaDownload } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Make sure to set the root element for accessibility

function Reports() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [expense, setExpense] = useState({
    amount: '',
    description: '',
    paidFor: ''
  });

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleAddExpense = () => {
    // Handle adding the expense here
    console.log('Expense added:', expense);
    closeModal();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shift Summary</h2>
        <div className="flex space-x-4">
          <button className="text-blue-500 flex items-center">
            <FaPrint className="mr-1" /> Print
          </button>
          <button className="text-blue-500 flex items-center">
            <FaDownload className="mr-1" /> Download
          </button>
          <button 
            onClick={openModal} 
            className="text-blue-500 flex items-center bg-blue-100 p-2 rounded"
          >
            Add Expense
          </button>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-1/3"
          placeholder="Shift ID"
        />
        
        <select className="border p-2 rounded w-1/3">
          <option>Select employee</option>
          {/* Add employee options here */}
        </select>
        <div className="relative w-1/3">
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            placeholderText="Date Range"
            className="border p-2 rounded w-full"
          />
         
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Sales</h3>
          <p>Gross Sales: ₹0.00</p>
          <p>Net Sales: ₹0.00</p>
          <p>Tax: ₹0.00</p>
          <p>Round Off: ₹0.00</p>
          <p className="font-bold">Net Total: ₹0.00</p>
          <p>0 Sale</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Payment Methods</h3>
          <p>₹0.00 from 0 payment methods</p>
        </div>
        <div className="bg-teal-500 text-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Tax Collected</h3>
          <p>₹0.00</p>
          <p>Sold 0 items with tax</p>
        </div>
        <div className="bg-gray-500 text-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Sales</h3>
          <p>Gross Sales: ₹0.00</p>
          <p>Net Sales: ₹0.00</p>
          <p>Tax: ₹0.00</p>
          <p>Round Off: ₹0.00</p>
          <p className="font-bold">Net Total: ₹0.00</p>
          <p>0 Sale</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Charges</h3>
          <p>₹0.00 from 0 orders</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Discount</h3>
          <p>₹0.00</p>
          <p>Sold 0 orders with Discount</p>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Expense"
        className="bg-white p-6 rounded shadow max-w-md mx-auto mt-24"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
        <div className="mb-4">
          <label className="block mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={expense.amount}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <input
            type="text"
            name="description"
            value={expense.description}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Paid For</label>
          <input
            type="text"
            name="paidFor"
            value={expense.paidFor}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="text-gray-500 mr-4"
          >
            Cancel
          </button>
          <button
            onClick={handleAddExpense}
            className="text-blue-500"
          >
            Add Expense
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Reports;
