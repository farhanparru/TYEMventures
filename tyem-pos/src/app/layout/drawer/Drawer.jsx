import React from "react";
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Layout } from "antd";
import styled, { keyframes } from "styled-components";
import {
  UilEstate,
  UilUsersAlt,
  UilBox,
  UilFileGraph,
  UilSetting,
  UilTag, // Sales icon
} from "@iconscout/react-unicons";
import { drawerMenuLabels } from "./constants/drawerMenu";
import { Link } from "react-router-dom";
import logo from '../../../assets/Logo.png';
import { useOrderContext } from "../../pages/home/sections/body/components/OrderContext";

const { Sider } = Layout;

const Badge = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DrawerMenuItemContainer = styled.div`
  width: 100%;
  padding: 0.5rem;
  height: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border-radius: 0.5rem;
  position: relative;
  color: ${(props) => (props.active ? "white" : "gray")};
  background-color: ${(props) => (props.active ? "gray" : "transparent")};
  border-left: ${(props) => (props.active ? "4px solid blue" : "none")};
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: gray;
    color: white;
  }
`;

const IconContainer = styled.div`
  position: relative;
  font-size: 24px; /* Adjust icon size */
`;

const ShortcutKey = styled.span`
  font-size: 0.6rem;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${(props) => (props.active ? "white" : "gray")};
  padding: 2px 4px;
  border-radius: 4px;
  margin-top: 4px;
`;

const DrawerMenuItem = ({ Icon, label, active, onClick, path, badge, shortcut }) => {
  return (
    <Link to={path}>
      <DrawerMenuItemContainer onClick={onClick} active={active}>
        <IconContainer>
          <Icon className="text-xl" />
          {badge && <Badge>{badge}</Badge>}
        </IconContainer>
        <p className={`text-xs font-medium ${active ? 'font-bold' : ''}`}>{label}</p>
        <ShortcutKey active={active}>{shortcut}</ShortcutKey>
      </DrawerMenuItemContainer>
    </Link>
  );
};

const Drawer = ({ activeMenu, setActiveMenu, collapsed }) => {
  const { totalOrders } = useOrderContext(); // Access totalOrders from context

  const menuItems = [
    {
      label: drawerMenuLabels.home.label,
      icon: UilEstate,
      onClick: () => setActiveMenu(drawerMenuLabels.home.label),
      path: drawerMenuLabels.home.path,
      shortcut: "Alt+1", // Add shortcut here
    },
    {
      label: drawerMenuLabels.customers.label,
      icon: UilUsersAlt,
      onClick: () => setActiveMenu(drawerMenuLabels.customers.label),
      path: drawerMenuLabels.customers.path,
      shortcut: "Alt+2", // Add shortcut here
    },
    {
      label: drawerMenuLabels.online.label,
      icon: AiOutlineShoppingCart,
      onClick: () => setActiveMenu(drawerMenuLabels.online.label),
      path: drawerMenuLabels.online.path,
      badge: totalOrders, // Use totalOrders from context
      shortcut: "Alt+3", // Add shortcut here
    },
    {
      label: drawerMenuLabels.orders.label,
      icon: UilBox,
      onClick: () => setActiveMenu(drawerMenuLabels.orders.label),
      path: drawerMenuLabels.orders.path,
      shortcut: "Alt+4", // Add shortcut here
    },
    {
      label: drawerMenuLabels.reports.label,
      icon: UilFileGraph,
      onClick: () => setActiveMenu(drawerMenuLabels.reports.label),
      path: drawerMenuLabels.reports.path,
      shortcut: "Alt+5", // Add shortcut here
    },
    {
      label: drawerMenuLabels.settings.label,
      icon: UilSetting,
      onClick: () => setActiveMenu(drawerMenuLabels.settings.label),
      path: drawerMenuLabels.settings.path,
      shortcut: "Alt+6", // Add shortcut here
    },
    {
      label: drawerMenuLabels.sales.label,
      icon: UilTag, // Sales icon
      onClick: () => setActiveMenu(drawerMenuLabels.sales.label),
      path: drawerMenuLabels.sales.path,
      shortcut: "Alt+7", // Add shortcut here
    },
    {
      label: drawerMenuLabels.scheduledOrders.label,
      icon: AiOutlineShoppingCart, // Scheduled Orders icon
      onClick: () => setActiveMenu(drawerMenuLabels.scheduledOrders.label),
      path: drawerMenuLabels.scheduledOrders.path,
      shortcut: "Alt+8", // Add shortcut here
    }
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
            badge={item.badge} // Pass badge prop here
            shortcut={item.shortcut} // Pass shortcut prop here
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
