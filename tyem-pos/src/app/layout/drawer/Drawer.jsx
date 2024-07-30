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

const { Sider } = Layout;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  50% {
    transform: translateX(4px);
  }
  75% {
    transform: translateX(-4px);
  }
`;

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
  transform: scale(2);
  transition: transform 0.3s, background-color 0.9s;
  animation: ${pulse} 1.16s infinite;

  &:hover {
    animation: ${shake} 0.5s;
  }
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
  background-color: ${(props) => (props.active ? "gray" : "transparent")};
  color: ${(props) => (props.active ? "white" : "gray")};
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: gray;
    color: white;
  }
`;

const IconContainer = styled.div`
  position: relative;
`;

const DrawerMenuItem = ({ Icon, label, active, onClick, path, badge }) => {
  return (
    <Link to={path}>
      <DrawerMenuItemContainer onClick={onClick} active={active}>
        <IconContainer>
          <Icon className="text-xl" />
          {badge && <Badge>{badge}</Badge>}
        </IconContainer>
        <p className="text-xs font-medium">{label}</p>
      </DrawerMenuItemContainer>
    </Link>
  );
};



const Drawer = ({ activeMenu, setActiveMenu, collapsed }) => {
  const menuItems = [
    {
      label: drawerMenuLabels.home.label,
      icon: UilEstate,
      onClick: () => setActiveMenu(drawerMenuLabels.home.label),
      path: drawerMenuLabels.home.path,
    },
    {
      label: drawerMenuLabels.customers.label,
      icon: UilUsersAlt,
      onClick: () => setActiveMenu(drawerMenuLabels.customers.label),
      path: drawerMenuLabels.customers.path,
    },
    {
      label: drawerMenuLabels.online.label,
      icon: AiOutlineShoppingCart,
      onClick: () => setActiveMenu(drawerMenuLabels.online.label),
      path: drawerMenuLabels.online.path,
      badge: 10, // Add badge count here// Add badge count here
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
    {
      label: drawerMenuLabels.sales.label,
      icon: UilTag, // Sales icon
      onClick: () => setActiveMenu(drawerMenuLabels.sales.label),
      path: drawerMenuLabels.sales.path,
    },
    {
      label: drawerMenuLabels.scheduledOrders.label,
      icon: AiOutlineShoppingCart, // Scheduled Orders icon
      onClick: () => setActiveMenu(drawerMenuLabels.scheduledOrders.label),
      path: drawerMenuLabels.scheduledOrders.path,
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
