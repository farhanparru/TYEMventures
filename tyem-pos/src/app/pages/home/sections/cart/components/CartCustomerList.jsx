import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaPlusCircle,
  FaPhone,
  FaUser,
  FaMapMarkerAlt,
  FaUserPlus,
} from "react-icons/fa";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactFlagsSelect from "react-flags-select"; // Import react-flags-select
import { FaExclamationTriangle } from 'react-icons/fa'; // Import warning icon

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    border: "none",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

Modal.setAppElement("#root");

const CartCustomerList = ({ searchTerm, onSelectCustomer, selectedPhone,closeCustomerList }) => {
  console.log(selectedPhone, "selectedPhone ");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState(""); // Initialize as empty
  const [newCustomerPlace, setNewCustomerPlace] = useState("");
  const [countryCode, setCountryCode] = useState("IN"); // Default country code (India)
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State to hold the selected customer
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // State for error modal

  const handleCustomerSelect = (customer) => {
    onSelectCustomer(customer);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "https://tyem.invenro.site/api/user/getCustomer"
        );
        setCustomers(response.data.customers); // Adjust based on your API response structure
        setFilteredCustomers(response.data.customers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let filtered = [];

    if (searchTerm.startsWith("+") || searchTerm.match(/^\d+$/)) {
      // Filtering by phone number
      filtered = customers.filter((customer) =>
        customer.number.includes(searchTerm)
      );
    } else {
      // Filtering by name
      filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const countryToPhoneCode = {
    US: "1",
    GB: "44",
    AU: "61",
    DE: "49",
    FR: "33",
    IN: "91",
    // Add more mappings as needed
  };

  const handleAddCustomer = async () => {
    try {
      // Get the phone code using the country code
      const phoneCode = countryToPhoneCode[countryCode];
      const formattedNumber = `+${phoneCode} ${newCustomerPhone}`;
  
      console.log("Formatted Phone Number:", formattedNumber); // Verify the format
  
      // Check if the customer already exists
      const checkResponse = await axios.post(
        "https://tyem.invenro.site/api/user/checkCustomer",
        {
          number: formattedNumber, // Send the formatted phone number
        }
      );
  
      if (checkResponse.data.exists) {
        // Customer already exists, show the error modal
        setErrorModalIsOpen(true);
        return;
      }
  
      // Proceed to add the customer
      const response = await axios.post(
        "https://tyem.invenro.site/api/user/addCustomer",
        {
          name: newCustomerName,
          number: formattedNumber, // Send the formatted phone number
          place: newCustomerPlace,
        }
      );
  
      toast.success("Customer added successfully!", {
        position: toast.POSITION?.TOP_RIGHT,
        autoClose: 3000,
      });
  
      // Close the modal and reset form fields
      setModalIsOpen(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      setNewCustomerPlace("");
      closeCustomerList(); // Close list after selecting a customer
  
      // Refresh customer list
      const updatedResponse = await axios.get(
        "https://tyem.invenro.site/api/user/getCustomer"
      );
      setCustomers(updatedResponse.data.customers);
    } catch (error) {
      console.log(error, "error");
      // Show error modal if an unexpected error occurs
      setErrorModalIsOpen(true);
    }
  };


  const closeModal = () => setModalIsOpen(false);
const closeErrorModal = () => setErrorModalIsOpen(false);
  const openModal = () => {
    setNewCustomerPhone(selectedPhone); // Set the phone number before opening the modal
    setModalIsOpen(true);
  };

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
              key={customer._id}
              className={`flex items-center p-2 border-b border-gray-200 cursor-pointer ${
                selectedCustomer?._id === customer._id
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => {
                setSelectedCustomer(customer); // Set the selected customer
                handleCustomerSelect(customer); // Call the function to pass the selected customer
              }}
            >
              <FaUserCircle className="w-8 h-8 text-gray-500 mr-3" />
              <span className="text-gray-800">
                {customer.name} {/* Always display the customer's name */}
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
        <div className="flex items-center justify-center space-x-2">
          <FaUserPlus className="text-blue-500 text-2xl animate-pulse" />
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add New Customer
          </h2>
        </div>

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
            <FaPhone className="text-gray-500 mr-3" size={30} />

            <ReactFlagsSelect
              selected={countryCode}
              onSelect={(code) => setCountryCode(code)}
              countries={["US", "GB", "AU", "DE", "FR", "IN"]} // Available countries
              customLabels={{
                US: "United States +1",
                GB: "United Kingdom +44",
                AU: "Australia +61",
                DE: "Germany +49",
                FR: "France +33",
                IN: "India +91",
              }}
              placeholder="Select Country"
              showSelectedLabel={true}
              showOptionLabel={true}
              className="mr-2"
            />

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

    {/* Error Modal */}
    {errorModalIsOpen && (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Customer Already Exists
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    A customer with this phone number already exists. Please use a different phone number or update the existing customer details.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:text-sm"
                onClick={closeErrorModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default CartCustomerList;
