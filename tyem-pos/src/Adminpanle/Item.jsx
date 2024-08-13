import React, { useEffect, useState } from "react";
import ExcelImportModal from "./ExcelModel";
import Header from "./Headr"; // Import your Header component
import Sidebar from "./Sidebar"; // Import your Sidebar component
import Modal from "react-modal";
import AddCategory from "./AddCategory"; // Import the AddCategory component
import axios from "axios";
import { AiFillFileExcel } from 'react-icons/ai';

Modal.setAppElement("#root");

const Item = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [itemModalIsOpen, setItemModalIsOpen] = useState(false);
  const [categoryModalIsOpen, setCategoryModalIsOpen] = useState(false);
  const [excelModalIsOpen, setExcelModalIsOpen] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const items = [
    {
      name: "ABOOD",
      variation: "89",
      category: "ROYAL SPECIAL SHAKE",
      stock: "2",
      price: "₹100.00",
      mrp: "₹0.00",
    },
    {
      name: "AFGANI TIKKA (8 PCS)",
      variation: "335",
      category: "Tandoor STARTER",
      stock: "0",
      price: "₹270.00",
      mrp: "₹0.00",
      low: true,
    },
    {
      name: "ALFAHAM",
      variation: "2 Variations",
      category: "ARABIC",
      stock: "0",
      price: "₹220.00 - ₹390.00",
      mrp: "₹0.00",
      low: true,
    },
    // Add more items here
  ];

  const openItemModal = () => {
    setItemModalIsOpen(true);
  };

  const closeItemModal = () => {
    setItemModalIsOpen(false);
  };

  const openCategoryModal = () => {
    setCategoryModalIsOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalIsOpen(false);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%", // Adjust the width as needed
      height: "80%", // Adjust the height as needed
    },
  };

  const openExcelModal = () => setExcelModalIsOpen(true);
  const closeExcelModal = () => setExcelModalIsOpen(false);

  const handleExcelUpload = (data) => {
    console.log("Uploaded Excel Data:", data);
    // Process the data as needed, for example:
    // setItems(data);
  };

  // get Categrioes

  useEffect(() => {
    if (itemModalIsOpen) {
      axios
        .get("http://localhost:8000/api/user/getCategory")
        .then((response) => {
          setCategories(response.data.categories);
        })
        .catch((error) => {
          console.error("There was an error fetching the categories!", error);
        });
    }
  }, [itemModalIsOpen]);

  return (
    <div className="p-4 flex flex-col h-screen">
      <Header OpenSidebar={OpenSidebar} />
      <div className="flex flex-grow">
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <div className="flex flex-col flex-grow p-4">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Filter by Item Name"
              className="p-2 border rounded"
            />
            <select className="p-2 border rounded">
              <option>Select Categories</option>
            </select>
            <select className="p-2 border rounded">
              <option>Select Brand</option>
            </select>
            <select className="p-2 border rounded">
              <option>Select Price Categories</option>
            </select>
            <button className="p-2 bg-purple-500 text-white rounded">
              More Filters
            </button>
            <button
              className="p-2 bg-purple-500 text-white rounded"
              onClick={openItemModal}
            >
              Create Item
            </button>
            <button
              className="p-2 bg-purple-500 text-white rounded"
              onClick={openCategoryModal}
            >
              Add Category
            </button>
            <button
              className="p-2 bg-gray-500 text-white rounded flex items-center"
              onClick={openExcelModal}
            >
              <AiFillFileExcel
                className="mr-2"
                size={20}
                style={{ color: "gray" }}
              />{" "}
              {/* Set icon color to gray */}
              Import Excel
            </button>
          </div>

          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Item</th>
                <th className="py-2 px-4 border-b">Variation</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">In Stock</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Position</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">{item.variation}</td>
                  <td className="py-2 px-4 border-b">{item.category}</td>
                  <td className="py-2 px-4 border-b">
                    {item.stock}
                    {item.low && (
                      <span className="text-yellow-500 ml-2">LOW</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.price}
                    <div className="text-gray-500 text-sm">{item.mrp}</div>
                  </td>
                  <td className="py-2 px-4 border-b">-</td>
                  <td className="py-2 px-4 border-b">
                    <button className="p-2 bg-purple-500 text-white rounded">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={itemModalIsOpen}
        onRequestClose={closeItemModal}
        contentLabel="Create Item Modal"
        style={customStyles}
      >
        <h2>Create Item</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Name *</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              placeholder="Item Name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Category *</label>
            <select
              className="p-2 border rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Alternate Name</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              placeholder="Alternate Name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Brand</label>
            <select className="p-2 border rounded w-full">
              <option>Select Brand</option>
              {/* Add brands here */}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Position</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              placeholder="Position"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              className="p-2 border rounded w-full"
              placeholder="Enter a description of this item. Describe details like features, options and measurements."
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input type="file" className="p-2 border rounded w-full" />
          </div>
          <button
            type="button"
            onClick={closeItemModal}
            className="p-2 bg-purple-500 text-white rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="p-2 bg-purple-500 text-white rounded"
          >
            Save
          </button>
        </form>
      </Modal>
      <AddCategory
        modalIsOpen={categoryModalIsOpen}
        closeModal={closeCategoryModal}
      />
      <ExcelImportModal
        modalIsOpen={excelModalIsOpen}
        closeModal={closeExcelModal}
        onUpload={handleExcelUpload}
      />
    </div>
  );
};

export default Item;
