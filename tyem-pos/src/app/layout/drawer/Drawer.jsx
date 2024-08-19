import React from 'react';
import { FaUtensils, FaShoppingCart, FaChartLine, FaClipboardList, FaCashRegister, FaUsers, FaCog, FaGlobe } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="flex flex-col w-20 bg-gray-900 text-gray-400 h-screen">
      <div className="flex justify-center items-center p-4">
        <img src="logo.png" alt="Logo" className="w-10 h-10" />
      </div>
      <div className="flex flex-col mt-8 space-y-6">
        <MenuItem icon={<FaShoppingCart size={20} />} label="SELL" shortcut="Alt+1" active />
        <MenuItem icon={<FaUtensils size={20} />} label="TABLES" shortcut="Alt+2" />
        <MenuItem icon={<FaGlobe size={20} />} label="ONLINE ORDERS" shortcut="Alt+3" />
        <MenuItem icon={<FaChartLine size={20} />} label="SALES" shortcut="Alt+4" />
        <MenuItem icon={<FaClipboardList size={20} />} label="REPORTS" shortcut="Alt+5" />
        <MenuItem icon={<FaCashRegister size={20} />} label="CASH" shortcut="Alt+6" />
        <MenuItem icon={<FaUsers size={20} />} label="CUSTOMERS" shortcut="Alt+7" />
        <MenuItem icon={<FaCog size={20} />} label="SETTINGS" shortcut="Alt+8" />
      </div>
      <div className="mt-auto p-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 bg-green-500 rounded-full"></span>
          <span className="text-xs">Online</span>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, shortcut, active }) => {
  return (
    <div className={`flex flex-col items-center text-center py-3 cursor-pointer ${active ? 'text-white bg-gray-800' : 'hover:text-white hover:bg-gray-800'} group relative`}>
      <div className={`text-lg ${active ? 'text-blue-500' : ''}`}>
        {icon}
      </div>
      <span className="text-xs mt-2">{label}</span>
      <span className="text-xs mt-1 text-gray-500">{shortcut}</span>
      {active && <div className="absolute left-0 h-full w-1 bg-blue-500"></div>}
    </div>
  );
};

export default Sidebar;
