import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaPlusCircle, FaPhone, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

const CartCustomerList = ({ searchTerm }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerPlace, setNewCustomerPlace] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/getCustomer');
        setCustomers(response.data.customers); // Adjust based on your API response structure
        setFilteredCustomers(response.data.customers);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let filtered = [];

    if (searchTerm.startsWith('+') || searchTerm.match(/^\d+$/)) {
      // Filtering by phone number
      filtered = customers.filter(customer =>
        customer.number.includes(searchTerm)
      );
    } else {
      // Filtering by name
      filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleAddCustomer = async () => {
    try {
      const response = await axios.post('https://tyem.invenro.site/api/user/addCustomer', {
        name: newCustomerName,
        number: newCustomerPhone,
        place: newCustomerPlace,
      });

      toast.success('Customer added successfully!', {
        position: toast.POSITION?.TOP_RIGHT,
        autoClose: 3000,
      });

      // Close the modal and reset form fields
      setModalIsOpen(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setNewCustomerPlace('');

      // Refresh customer list
      const updatedResponse = await axios.get('https://tyem.invenro.site/api/user/getCustomer');
      setCustomers(updatedResponse.data.customers);
    } catch (error) {
      toast.error('Failed to add customer: ' + (error.response?.data.message || error.message), {
        position: toast.POSITION?.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <ToastContainer /> {/* Add this to render the toast notifications */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer List</h2>
        <button
          className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={openModal}
        >
          <FaPlusCircle className="mr-2" /> New Customer
        </button>
      </div>
     
      <div className="max-h-64 overflow-y-auto mt-4">
        <ul className="space-y-3">
          {filteredCustomers.map((customer) => (
            <li
              key={customer._id} // Use a unique identifier from your API
              className="flex items-center p-2 border-b border-gray-200"
            >
              <FaUserCircle className="w-8 h-8 text-gray-500 mr-3" />
              <span className="text-gray-800">
                {searchTerm.startsWith('+') || searchTerm.match(/^\d+$/)
                  ? customer.number
                  : customer.name} {/* Display number or name based on search term */}
              </span>
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
