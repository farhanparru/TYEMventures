import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const AddCategory = ({ modalIsOpen, closeModal }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [arabicDescription, setArabicDescription] = useState('');
  const [position, setPosition] = useState('');
  const [category, setCategory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newCategory = {
      categoryName,
      description: categoryDescription,
      arabicName,
      arabicDescription,
      enterPosition: position
    };

    try {
      const response = await axios.post('http://localhost:8000/api/user/createCategory', newCategory);
      
      if (response.status === 201) {
        setCategory([...category, response.data.data]);
        // Optionally, you can clear the form fields here
        setCategoryName('');
        setCategoryDescription('');
        setArabicName('');
        setArabicDescription('');
        setPosition('');
        closeModal();
      }
    } catch (error) {
      console.error('There was an error creating the category!', error);
    }
  };

  const handleTranslate = async () => {
    const apiKey = '';
    const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    try {
      const response = await axios.post(apiUrl, {
        q: categoryName,
        target: 'ar' // Arabic language code
      });

      if (response.data && response.data.data && response.data.data.translations) {
        setArabicName(response.data.data.translations[0].translatedText);
      }
    } catch (error) {
      console.error('There was an error translating the text!', error);
    }
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
            required
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
            required
          />
          <button type="button" onClick={handleTranslate} className="p-2 bg-purple-500 text-white rounded mt-2">Translate</button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Arabic Description</label>
          <textarea
            className="p-2 border rounded w-full"
            placeholder="Arabic Description"
            value={arabicDescription}
            onChange={(e) => setArabicDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Enter Position</label>
          <input
            type="number"
            className="p-2 border rounded w-full"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={closeModal} className="p-2 bg-purple-500 text-white rounded mr-2">Cancel</button>
        <button type="submit" className="p-2 bg-purple-500 text-white rounded">Save</button>
      </form>
    </Modal>
  );
};

export default AddCategory;
