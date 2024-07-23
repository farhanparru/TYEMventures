import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AddCategory = ({ modalIsOpen, closeModal }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [arabicDescription, setArabicDescription] = useState('');
  const [position, setPosition] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log("Category Name:", categoryName);
    console.log("Category Description:", categoryDescription);
    console.log("Arabic Name:", arabicName);
    console.log("Arabic Description:", arabicDescription);
    console.log("Position:", position);
    closeModal();
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%', // Adjust the width as needed
      height: 'auto' // Adjust the height as needed
    }
  };

  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Add Category Modal" style={customStyles}>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Category Name *</label>
          <input
            type="text"
            className="p-2 border rounded w-full"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category Description</label>
          <textarea
            className="p-2 border rounded w-full"
            placeholder="Category Description"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Arabic Name</label>
          <input
            type="text"
            className="p-2 border rounded w-full"
            placeholder="Arabic Name"
            value={arabicName}
            onChange={(e) => setArabicName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Arabic Description</label>
          <textarea
            className="p-2 border rounded w-full"
            placeholder="Arabic Description"
            value={arabicDescription}
            onChange={(e) => setArabicDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Enter Position</label>
          <input
            type="text"
            className="p-2 border rounded w-full"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <button type="button" onClick={closeModal} className="p-2 bg-purple-500 text-white rounded mr-2">Cancel</button>
        <button type="submit" className="p-2 bg-purple-500 text-white rounded">Save</button>
      </form>
    </Modal>
  );
};

export default AddCategory;
