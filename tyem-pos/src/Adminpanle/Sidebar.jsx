import React from 'react'
import { Link } from 'react-router-dom';
import {  FaHome, FaChartLine,  FaClipboard } from 'react-icons/fa';
import { BsGrid1X2Fill,BsPeopleFill,BsPeople,BsBoxSeam ,BsFillGearFill } from 'react-icons/bs';

function Sidebar ({openSidebarToggle, OpenSidebar}) {
  return (
      <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
          <div className='sidebar-title'>
              <div className='sidebar-brand'>
              <img src='' alt='' className="icon_header text-2xl mr-2" />
            <h1 className="text-xl font-bold">TYEMventures</h1>
              </div>
              <span className='icon close_icon' onClick={OpenSidebar}>X</span>
          </div>
  
          <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                  <a href="">
                      <FaHome  className='icon'/> Home
                  </a>
              </li>
              <li className='sidebar-list-item'>
                  <a href="">
                      <BsGrid1X2Fill className='icon'/> Dashboard
                  </a>
              </li>
              <li className='sidebar-list-item'>
              <Link to="/sale">
              <FaChartLine className="icon" onClick={OpenSidebar} /> Sales
             </Link>
              </li>
              <li className='sidebar-list-item'>
                  <a href="">
                      <FaClipboard className='icon'/> Reports
                  </a>
              </li>
              <li className='sidebar-list-item'>
                  <a href="">
                      <BsPeopleFill className='icon'/> Customers
                  </a>
              </li>
              <li className='sidebar-list-item'>
                  <a href="">
                      <BsPeople className='icon'/> Employees
                  </a>
              </li>
              <li className='sidebar-list-item'>
                  <a href="">
                      <BsBoxSeam  className='icon'/> Inventory Management
                  </a>
              </li>
              <li className='sidebar-list-item'>
                  <a href="">
                      <BsFillGearFill className='icon'/> Setting
                  </a>
              </li>
          </ul>
      </aside>
  )
}

export default Sidebar
