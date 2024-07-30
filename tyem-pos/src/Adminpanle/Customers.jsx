import React from "react";
import Headr from "./Headr"; // Adjust the path as necessary
import Sidebar from "./Sidebar"; // Adjust the path as necessary
import { useState } from "react";

const Customers = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const customers = [
    {
      name: "shamin farhan",
      email: "shamin87@gmail.com",
      phone: "7896541236",
      credits: "₹0.00",
      outstanding: "₹0.00",
      rewardPoints: 0,
      createdDate: "Jul 13, 2024",
    },
    {
      name: "Muhammad Shamin Farhan Farhan",
      email: "farhanparru87@gmail.com",
      phone: "9072937703",
      credits: "₹0.00",
      outstanding: "₹0.00",
      rewardPoints: 0,
      createdDate: "Jul 13, 2024",
    },
    {
      name: "me",
      email: "me@example.com",
      phone: "9747311313",
      credits: "₹0.00",
      outstanding: "₹0.00",
      rewardPoints: 0,
      createdDate: "Jan 16, 2024",
    },
    {
      name: "ashi",
      email: "ashi@example.com",
      phone: "9961619402",
      credits: "₹0.00",
      outstanding: "₹612.00",
      rewardPoints: 0,
      createdDate: "Jan 15, 2024",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
    <Headr className="header" OpenSidebar={OpenSidebar} />
      <div className="flex flex-grow">
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <div className="flex-grow p-4">
          <h1 className="text-2xl font-bold mb-4">Customers</h1>
          <div className="mb-4 flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center space-x-2">
              <input
                type="text"
                placeholder="Filter by Name, Code, Email"
                className="border border-gray-300 rounded px-2 py-1"
              />
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>All Groups</option>
                {/* Add more options as needed */}
              </select>
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>All Employee</option>
                {/* Add more options as needed */}
              </select>
              <button className="border border-purple-500 text-purple-500 rounded px-4 py-1">
                More Filters
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="border border-purple-500 text-purple-500 rounded px-4 py-1">
                Login To Online Store
              </button>
              <button className="bg-purple-500 text-white rounded px-4 py-1">
                + Create Customer
              </button>
              <button className="border border-purple-500 text-purple-500 rounded px-4 py-1">
                Export
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Customer
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Email
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Phone
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Credits
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Outstanding
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Reward Points
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Created Date
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm leading-4 text-gray-500 tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr
                    key={index}
                    className="bg-gray-100 border-b border-gray-200"
                  >
                    <td className="py-2 px-4">{customer.name}</td>
                    <td className="py-2 px-4">{customer.email}</td>
                    <td className="py-2 px-4">{customer.phone}</td>
                    <td className="py-2 px-4">
                      <span className="text-green-500">{customer.credits}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={
                          customer.outstanding === "₹0.00"
                            ? "text-black"
                            : "text-red-500"
                        }
                      >
                        {customer.outstanding}
                      </span>
                    </td>
                    <td className="py-2 px-4">{customer.rewardPoints}</td>
                    <td className="py-2 px-4">{customer.createdDate}</td>
                    <td className="py-2 px-4">
                      <button className="bg-purple-500 text-white py-1 px-3 rounded mr-2">
                        View
                      </button>
                      <button className="bg-red-500 text-white py-1 px-3 rounded">
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
