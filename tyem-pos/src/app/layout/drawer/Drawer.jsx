import React from "react";
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Layout } from "antd";
import {
  UilEstate,
  UilUsersAlt,
  UilArrowGrowth,
  UilBox,
  UilFileGraph,
  UilWallet,
  UilSetting,
} from "@iconscout/react-unicons";
import { drawerMenuLabels } from "./constants/drawerMenu";
import { Link } from "react-router-dom";
import logo from '../../../assets/logo.png';

const { Sider } = Layout;

const DrawerMenuItem = ({ Icon, label, active, onClick, path }) => {
  const iconClass = `font-thin text-xl ${active ? "text-white" : "text-gray-500"}`;
  return (
    <Link to={path}>
      <div
        onClick={onClick}
        className={`w-full p-2 h-16 flex items-center rounded-lg 
          gap-1 flex-col justify-center
          ${active ? "bg-gray-800 text-white" : "hover:bg-gray-700 text-gray-500"}
          transition-all duration-300 ease-in-out`}
      >
        <Icon className={iconClass} />
        <p className={`text-[10px] font-medium ${active ? "text-white" : "text-gray-500"}`}>
          {label}
        </p>
      </div>
    </Link>
  );
};

const Drawer = ({ activeMenu, setActiveMenu, collapsed }) => {
  const menuItems = [
    {
      label: drawerMenuLabels.home.label,
      icon: UilEstate,
      onClick: () => {
        setActiveMenu(drawerMenuLabels.home.label);
      },
      path: drawerMenuLabels.home.path,
    },
    {
      label: drawerMenuLabels.customers.label,
      icon: UilUsersAlt,
      onClick: () => setActiveMenu(drawerMenuLabels.customers.label),
      path: drawerMenuLabels.customers.path,
    },
    {
      label: drawerMenuLabels.sales.label,
      icon: AiOutlineShoppingCart, // Updated to online orders icon
      onClick: () => setActiveMenu(drawerMenuLabels.sales.label),
      path: drawerMenuLabels.sales.path,
    },
    {
      label: drawerMenuLabels.orders.label,
      icon: UilBox,
      onClick: () => setActiveMenu(drawerMenuLabels.orders.label),
      path: drawerMenuLabels.orders.path,
    },
    {
      label: drawerMenuLabels.reports.label,
      icon: UilFileGraph,
      onClick: () => setActiveMenu(drawerMenuLabels.reports.label),
      path: drawerMenuLabels.reports.path,
    },
    {
      label: drawerMenuLabels.settings.label,
      icon: UilSetting,
      onClick: () => setActiveMenu(drawerMenuLabels.settings.label),
      path: drawerMenuLabels.settings.path,
    },
  ];

  return (
    <Sider
      theme="dark"
      trigger={null}
      collapsible
      width={120}
      collapsed={!collapsed}
      className="bg-gray-900"
    >
      <div className="flex flex-col items-center py-4">
        <img src={logo} alt="logo" className="w-12 mb-4" />
        {menuItems.map((item) => (
          <DrawerMenuItem
            Icon={item.icon}
            label={item.label}
            active={activeMenu === item.label}
            onClick={item.onClick}
            path={item.path}
            key={item.path}
          />
        ))}
      </div>
      <div className="mt-auto mb-4">
        <div className="flex items-center justify-center text-gray-500">
          <span className="text-xs">Online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
        </div>
      </div>
    </Sider>
  );
};

export default Drawer;
