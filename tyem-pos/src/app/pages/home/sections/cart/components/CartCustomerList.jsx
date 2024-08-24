import React, { useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaPlusCircle, FaPhone, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    border: 'none',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

Modal.setAppElement('#root');

const CartCustomerList = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerPlace, setNewCustomerPlace] = useState('');

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleAddCustomer = async () => {
    try {
      const response = await axios.post('https://tyem.invenro.site/api/user/addCustomer', {
        name: newCustomerName,
        number: newCustomerPhone,
        place: newCustomerPlace,
      });

      console.log('Customer added successfully:', response.data);
      // Close the modal and reset form fields
      setModalIsOpen(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setNewCustomerPlace('');
    } catch (error) {
      console.error('Failed to add customer:', error.response?.data || error.message);
    }
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer List</h2>
        <button
          className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={openModal}
        >
          <FaPlusCircle className="mr-2" /> New Customer
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <ul className="space-y-3">
          <li
            key="new"
            className="flex items-center p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
            onClick={openModal}
          >
            <FaPlusCircle className="w-8 h-8 text-blue-500 mr-3" />
            <span className="text-blue-500">Add New Customer</span>
          </li>
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add New Customer"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Add New Customer</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddCustomer();
          }}
        >
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <FaUser className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Customer Name"
              className="w-full px-3 py-2 border-none focus:outline-none"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <FaPhone className="text-gray-500 mr-3" />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-3 py-2 border-none focus:outline-none"
              value={newCustomerPhone}
              onChange={(e) => setNewCustomerPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center border-b border-gray-300 pb-2">
            <FaMapMarkerAlt className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Place (Location)"
              className="w-full px-3 py-2 border-none focus:outline-none"
              value={newCustomerPlace}
              onChange={(e) => setNewCustomerPlace(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-1 rounded mr-2 hover:bg-gray-600"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CartCustomerList;
