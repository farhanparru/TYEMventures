import React, { useState } from 'react';
import Headr from './Headr';
import Sidebar from './Sidebar';
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react';

function Odersale() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header Component */}
      <Headr className='header' OpenSidebar={OpenSidebar} />

      <div className="flex flex-grow">
        {/* Sidebar Component */}
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

        <div className="flex-grow p-5 ml-[200px]">
          {/* Card Component for Sales */}
          <CCard className="mb-4" style={{ backgroundColor: '#ffffff' }}>
            <CCardHeader>
              <h1 className="text-xl font-bold text-gray-800">Sales</h1>
            </CCardHeader>
            <CCardBody>
              {/* Table Component */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  {/* Table Head */}
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 lg:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 sm:px-6 lg:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-4 py-3 sm:px-6 lg:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 sm:px-6 lg:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Details
                      </th>
                      <th className="px-4 py-3 sm:px-6 lg:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-4 py-3 sm:px-6 lg:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 sm:px-6 lg:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created Date
                      </th>
                      <th className="px-4 py-3 sm:px-6 lg:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 sm:px-6 lg:px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {/* Table Body (Placeholder for data) */}
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-4 sm:px-6 lg:px-8 whitespace-nowrap">...</td>
                      <td className="px-4 py-4 sm:px-6 lg:px-8 whitespace-nowrap">...</td>
                      <td className="px-4 py-4 sm:px-6 lg:px-8 whitespace-nowrap">...</td>
                      <td className="px-4 py-4 sm:px-6 lg:px-8 whitespace-nowrap">...</td>
                      <td className="px-4 py-4 sm:px-6 lg:px-8 whitespace-nowrap">...</td>
                      <td className="px-4 py-4 sm:px-6 lg:px-8 whitespace-nowrap">...</td>
                      <td className="px-4 py-4 sm:px-6 lg:px-8 whitespace-nowrap">...</td>
                      <td className="px-4 py-4 sm:px-6 lg:px-8 whitespace-nowrap">
                        <button className="text-blue-600 hover:underline">View</button>
                      </td>
                    </tr>
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  );
}

export default Odersale;