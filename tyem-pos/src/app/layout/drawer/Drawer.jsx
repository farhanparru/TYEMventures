import React from "react";

import { Layout } from "antd";
import {
  UilEstate,
  UilRestaurant,
  UilUsersAlt,
  UilArrowGrowth,
  UilBox,
  UilFileGraph,
  UilWallet,
  UilSetting,
} from "@iconscout/react-unicons";
import { drawerMenuLabels } from "./constants/drawerMenu";
import { Link } from "react-router-dom";
import logo from '../../../assets/logo.png'
const { Sider } = Layout;

const DrawerMenuItem = ({ Icon, label, active, onClick, path }) => {
  const iconClass = ` font-thin  text-xl ${active ? "text-ch-headers-500" : "text-gray-500"
    }`;
  return (
    <Link to={path}>
      <div
        onClick={onClick}
        className={`w-full p-2 h-16 min-w-[65px] max-w-[65px] flex  items-center rounded-xl 
             gap-1 flex-col justify-center
              ${active
            ? " shadow-md  bg-ch-headers-100 text-ch-headers-500"
            : `
              hover:border hover:border-chicket-300 hover:scale-105 hover:shadow-md  text-ch-headers-500`
          }
              transition-all duration-300 ease-in-out
               `}
      >
        <Icon className={iconClass} />
        <p
          className={`text-[10px]  text-white font-medium  ${active ? `font-bold text-ch-headers-500` : `text-gray-500`
            }`}
        >
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
    // {
    //   label: drawerMenuLabels.kds.label,
    //   icon: UilRestaurant,
    //   onClick: () => {
    //     setActiveMenu(drawerMenuLabels.kds.label);
    //   },
    //   path: drawerMenuLabels.kds.path,
    // },
    {
      label: drawerMenuLabels.customers.label,
      icon: UilUsersAlt,
      onClick: () => setActiveMenu(drawerMenuLabels.customers.label),
      path: drawerMenuLabels.customers.path,
    },
    // {
    //   label: drawerMenuLabels.sales.label,
    //   icon: UilArrowGrowth,
    //   onClick: () => setActiveMenu(drawerMenuLabels.sales.label),
    //   path: drawerMenuLabels.sales.path,
    // },
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
    // {
    //   label: drawerMenuLabels.cash.label,
    //   icon: UilWallet,
    //   onClick: () => setActiveMenu(drawerMenuLabels.cash.label),
    //   path: drawerMenuLabels.cash.path,
    // },
    {
      label: drawerMenuLabels.settings.label,
      icon: UilSetting,
      onClick: () => setActiveMenu(drawerMenuLabels.settings.label),
      path: drawerMenuLabels.settings.path,
    },
  ];

  return (
    <Sider
      theme="light"
      trigger={null}
      collapsible
      width={120}
      prefixCls=""
      defaultCollapsed
      className={` ${collapsed ? " border-r-2 shadow-r-xl shadow-black" : "hidden"}`}
    >
      <div className="flex  flex-col gap-5 px-2 py-3  items-center">
        <img src={logo} alt="logo" className="w-12" />

        {menuItems.map((item, index) => (
          <DrawerMenuItem
            Icon={item.icon}
            label={item.label}
            active={activeMenu === item.label}
            collapsed={collapsed}
            onClick={item.onClick}
            path={item.path}
            key={item.path}
          />
        ))}
      </div>
    </Sider>
  );
};

export default Drawer;
