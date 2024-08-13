import React, { useState } from 'react';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import { AiFillFileExcel } from 'react-icons/ai';


const ExcelModel = ({ modalIsOpen, closeModal, onUpload }) => {


    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
  
    const handleUpload = () => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
          onUpload(sheetData); // Pass the data to the parent component
          closeModal(); // Close the modal after uploading
        };
        reader.readAsArrayBuffer(file);
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
        width: '400px',
      },
    };
  





    return (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Import Excel Modal"
          style={customStyles}
        >
          <h2 className="text-center mb-4">Import Excel File</h2>
          <div className="mb-4">
            <label className="block text-gray-700">
              Select Excel File <AiFillFileExcel className="inline-block text-green-500" />
            </label>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="p-2 border rounded w-full" />
          </div>
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="p-2 bg-gray-500 text-white rounded mr-2"
            >
              Close
            </button>
            <button
              onClick={handleUpload}
              className="p-2 bg-purple-500 text-white rounded"
            >
              Upload
            </button>
          </div>
        </Modal>
      );
    };
export default ExcelModel
