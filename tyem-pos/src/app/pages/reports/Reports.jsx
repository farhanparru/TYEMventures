import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaPrint,
  FaDownload,
  FaCashRegister,
  FaCreditCard,
  FaTruck,
  FaUser,
  FaWhatsapp,
  FaShoppingCart,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Make sure to set the root element for accessibility

function Reports() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [expense, setExpense] = useState({
    amount: "",
    description: "",
    paidFor: "",
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
    console.log("Expense added:", expense);
    closeModal();
  };

  const [posSales, setPosSales] = useState(0);
  const [whatsappSales, setWhatsappSales] = useState(0);
  const [posDiscount, setPosDiscount] = useState(0);
  const [netSales, setNetSales] = useState(0);
  const [taxCollected, setTaxCollected] = useState(0);
  const [refund, setRefund] = useState(0);
  const [charges, setCharges] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [subtotal, setSubtotal] = useState(0);


  console.log(totalSales, "totalSales");
  console.log(whatsappSales, "whatsappSales");
  console.log(posDiscount, "posDiscount");

  useEffect(() => {
    // Fetch POS Orders
    axios
      .get("https://tyem.invenro.site/api/user/PosOrder")
      .then((response) => {
        const posData = response.data;
        let totalPosSales = 0;
        let totalPosDiscount = 0;
        let totalPosSubtotal = 0;

        posData.forEach(order => {
          totalPosSales += order.itemDetails.total || 0; // Ensure total is a number
          if (order.discount) {
            totalPosDiscount += order.discount.value || 0; // Ensure discount is a number
          }
          totalPosSubtotal += (order.itemDetails.total || 0) - (order.discount ? order.discount.value || 0 : 0);
        });

        setPosSales(totalPosSales);
        setPosDiscount(totalPosDiscount);
        setSubtotal(totalPosSubtotal);
      })
      .catch((error) => console.error("Error fetching POS orders:", error));

    // Fetch WhatsApp Orders
    axios
      .get("https://tyem.invenro.site/api/tyem/Whatsappget")
      .then((response) => {
        console.log(response.data); // Check the actual data returned
        const whatsappData = response.data;
        console.log(whatsappData,"kk");
        let totalWhatsappSales = 0;
        let totalWhatsappSubtotal = 0;

        whatsappData.forEach((order) => {
          totalWhatsappSales += order.paymentTendered || 0; // Ensure paymentTendered is a number
          totalWhatsappSubtotal += order.paymentTendered || 0;
        });

        setWhatsappSales(totalWhatsappSales);
        setSubtotal(totalWhatsappSubtotal);
      })
      .catch((error) =>
        console.error("Error fetching WhatsApp orders:", error)
      );
  }, []);

  useEffect(() => {
    // Calculate Total Sales (POS + WhatsApp)
    const totalSalesSum = (posSales || 0) + (whatsappSales || 0); // Ensure both values are numbers
    setTotalSales(totalSalesSum);

    // Calculate Net Sales (Total Sales - POS Discount)
    const calculatedNetSales = totalSalesSum - (posDiscount || 0); // Ensure posDiscount is a number
    setNetSales(calculatedNetSales);

   // Calculate Grand Total (Net Sales + Tax - Refund + Charges)
   const calculatedGrandTotal = calculatedNetSales + (taxCollected || 0) - (refund || 0) + (charges || 0);
   setGrandTotal(calculatedGrandTotal);
 }, [posSales, whatsappSales, posDiscount, taxCollected, refund, charges]);


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
          <FaChartBar className="text-2xl animate-pulse" />
          <h2 className="text-xl font-bold tracking-wide ">Shift Summary</h2>
        </div>
        <div className="flex space-x-4">
          <button className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md group">
            <span className="absolute inset-0 w-full h-full bg-blue-600 transition-all duration-300 ease-out transform translate-x-full group-hover:translate-x-0 group-hover:scale-105"></span>
            <span className="absolute inset-0 w-full h-full border-2 border-blue-600 transition-all duration-300 ease-out transform translate-x-0 translate-y-full group-hover:translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white transition-all duration-300 ease-out transform group-hover:bg-blue-600 group-hover:scale-105"></span>
            <span className="relative flex items-center space-x-2 text-blue-600 transition-colors duration-300 ease-in-out group-hover:text-white">
              <FaPrint className="text-lg animate-spin-slow group-hover:text-white" />
              <span>Print</span>
            </span>
          </button>

          <button className="text-white bg-blue-500 flex items-center p-2 rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg">
            <FaDownload className="mr-2 text-xl animate-bounce" />
            Download
          </button>

          <button
            onClick={openModal}
            className="text-white flex items-center bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <span className="animate-pulse bg-white bg-opacity-20 p-1 rounded-full mr-2"></span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Sales Summary Card */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <FaChartLine className="text-indigo-500 text-3xl animate-bounce" />
            <div>
              <h3 className="text-lg font-bold">Total Sales Summary</h3>
              <p>Total Sales: ₹{totalSales.toFixed(2)}</p>{" "}
              {/* Total Sales = POS Sales + WhatsApp Sales */}
              <p>Net Sales (after discount): ₹{netSales.toFixed(2)}</p>{" "}
              {/* Net Sales = Total Sales - POS Discount */}
              <p>Tax Collected: ₹0.00</p>
              <p>Refund: -₹0.00</p>
              <p>Charges: ₹0.00</p>
              <p>Discount: -₹{posDiscount.toFixed(2)}</p>
              <p className="font-bold">Grand Total: ₹0.00</p>
            </div>
          </div>
        </div>

        {/* POS Sales Report Card */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <FaShoppingCart className="text-blue-500 text-3xl animate-bounce" />
            <div>
              <h3 className="text-lg font-bold">POS Sales Report</h3>
              <p>Net Sales: ₹{posSales.toFixed(2)}</p>
              <p>Tax Collected: ₹0.00</p>
              <p>Refund: -₹0.00</p>
              <p>Charges: ₹0.00</p>
              <p>Discount: -₹{posDiscount.toFixed(2)}</p>
              <p className="font-bold">Subtotal: ₹{subtotal.toFixed(2)}</p> {/* Subtotal = POS Sales - POS Discount */}
            </div>
          </div>
        </div>

        {/* WhatsApp Ordering Report Card */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <FaWhatsapp className="text-green-500 text-3xl animate-bounce" />
            <div>
              <h3 className="text-lg font-bold">WhatsApp Ordering Report</h3>
              <p>Net Sales: ₹{whatsappSales.toFixed(2)}</p>
              <p>Tax Collected: ₹0.00</p>
              <p>Refund: -₹0.00</p>
              <p>Charges: ₹0.00</p>
              <p>Discount: -₹0.00</p>
              <p className="font-bold">Subtotal: ₹{whatsappSales.toFixed(2)}</p> {/* Subtotal = WhatsApp Sales */}
            </div>
          </div>
        </div>

        {/* Payment Method Report Card */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <FaCashRegister className="text-yellow-500 text-3xl animate-bounce" />
            <div>
              <h3 className="text-lg font-bold">Payment Method Report</h3>
              <p>Cash: ₹0.00</p>
              <p>UPI: ₹0.00</p>
              <p>Credit: ₹0.00</p>
              <p>Card: ₹0.00</p>
            </div>
          </div>
        </div>

        {/* Price Category Sales Report Card */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <FaCreditCard className="text-red-500 text-3xl animate-bounce" />
            <div>
              <h3 className="text-lg font-bold">Price Category Sales</h3>
              <p>Dine-in: ₹0.00</p>
              <p>Takeaway: ₹0.00</p>
              <p>Delivery: ₹0.00</p>
            </div>
          </div>
        </div>

        {/* Employee Sales Report Card */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <FaUser className="text-teal-500 text-3xl animate-bounce" />
            <div>
              <h3 className="text-lg font-bold">Employee Sales</h3>
              <p>X = ₹0.00</p>
              <p>Y = ₹0.00</p>
            </div>
          </div>
        </div>

        {/* Credit Summary Report Card */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <FaTruck className="text-purple-500 text-3xl animate-bounce" />
            <div>
              <h3 className="text-lg font-bold">Credit Summary</h3>
              <p>X = ₹0.00</p>
              <p>Y = ₹0.00</p>
            </div>
          </div>
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
          <button onClick={closeModal} className="text-gray-500 mr-4">
            Cancel
          </button>
          <button onClick={handleAddExpense} className="text-blue-500">
            Add Expense
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Reports;
