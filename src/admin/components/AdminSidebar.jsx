import React, { useState } from 'react';
import { FaUniversity, FaStar, FaComments, FaUser, FaSignOutAlt, FaBook } from 'react-icons/fa';
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";

const AdminSidebar = ({ setActiveSection, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const logOut = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    localStorage.removeItem('uid')
  }

  const menuItems = [
    { title: 'University Profile', icon: <FaBook />, section: 'university-profile' },
    { title: 'Manage University', icon: <FaUniversity />, section: 'university' },
    { title: 'View Reviews', icon: <FaStar />, section: 'reviews' },
    { title: 'Manage Forum', icon: <FaComments />, section: 'forum' },
    { title: 'Profile', icon: <FaUser />, section: 'profile' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-all duration-200 ${
        isOpen ? 'w-64' : 'w-16'
      } bg-cream bg-opacity-20 backdrop-blur-md shadow-lg p-4 flex flex-col justify-between`}
    >
      <div>
        <div
          className="text-2xl font-semibold mb-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <GoSidebarCollapse /> : <GoSidebarExpand />}
        </div>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.section}
              className={`flex items-center gap-4 p-2 mb-3 cursor-pointer rounded-lg hover:bg-light-brown transition ${
                activeSection === item.section ? 'bg-light-brown' : ''
              }`}
              onClick={() => setActiveSection(item.section)}
              title={item.title}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span>{item.title}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`flex items-center gap-4 cursor-pointer rounded-lg hover:bg-red-600 transition p-2`}
        onClick={() => logOut()}
      >
        <FaSignOutAlt className="text-lg text-red-500" />
        {isOpen && <span>Logout</span>}
      </div>
    </div>
  );
};

export default AdminSidebar;
