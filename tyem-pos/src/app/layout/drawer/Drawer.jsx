import React from "react";
import { Layout } from "antd";
import styled from "styled-components";
import {
  AiOutlineShoppingCart,
  AiOutlineFork,
  AiOutlineBarChart,
  AiOutlineMoneyCollect,
  AiOutlineTeam,
  AiOutlineSetting,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from '../../../assets/Logo.png';

const { Sider } = Layout;

const DrawerMenuItemContainer = styled.div`
  width: 100%;
  height: 60px; /* Adjust height */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aaa;
  position: relative;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #1f1f1f;
    color: white;

    .shortcut-key {
      opacity: 1;
    }
  }

  ${(props) =>
    props.active &&
    `
    background-color: #1f1f1f;
    color: white;
  `}
`;

const ShortcutKey = styled.span`
  position: absolute;
  bottom: -15px;
  font-size: 0.7rem;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;

const DrawerMenuItem = ({ Icon, label, active, path, shortcut }) => {
  return (
    <Link to={path}>
      <DrawerMenuItemContainer active={active}>
        <Icon size={24} />
        <p className="text-xs font-medium mt-1">{label}</p>
        <ShortcutKey className="shortcut-key">{shortcut}</ShortcutKey>
      </DrawerMenuItemContainer>
    </Link>
  );
};

const Drawer = ({ activeMenu, setActiveMenu, collapsed }) => {

  const menuItems = [
    {
      label: "Sell",
      icon: AiOutlineShoppingCart,
      path: "/sell",
      shortcut: "Alt+1",
    },
    {
      label: "Tables",
      icon: AiOutlineFork,
      path: "/tables",
      shortcut: "Alt+2",
    },
    {
      label: "Online Orders",
      icon: AiOutlineShoppingCart,
      path: "/online-orders",
      shortcut: "Alt+3",
    },
    {
      label: "Sales",
      icon: AiOutlineBarChart,
      path: "/sales",
      shortcut: "Alt+4",
    },
    {
      label: "Reports",
      icon: AiOutlineBarChart,
      path: "/reports",
      shortcut: "Alt+5",
    },
    {
      label: "Cash",
      icon: AiOutlineMoneyCollect,
      path: "/cash",
      shortcut: "Alt+6",
    },
    {
      label: "Customers",
      icon: AiOutlineTeam,
      path: "/customers",
      shortcut: "Alt+7",
    },
    {
      label: "Settings",
      icon: AiOutlineSetting,
      path: "/settings",
      shortcut: "Alt+8",
    },
  ];

  return (
    <Sider
      theme="dark"
      trigger={null}
      collapsible
      width={100} /* Adjusted width */
      collapsed={collapsed}
      className="bg-gray-900"
    >
      <div className="flex flex-col items-center py-4">
        <img src={logo} alt="logo" className="w-10 mb-4" />
        {menuItems.map((item) => (
          <DrawerMenuItem
            Icon={item.icon}
            label={item.label}
            active={activeMenu === item.label}
            path={item.path}
            key={item.path}
            shortcut={item.shortcut}
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
