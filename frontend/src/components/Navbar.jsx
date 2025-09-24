import React, { useState } from "react";
import companyLogo from "../../public/images/vista-inventory.png";
import { FaHome, FaUser, FaCog, FaBars } from "react-icons/fa";
import { MdCategory,MdInventory  } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"

const Navbar = () => {

  const menuItems = [
    { label: "Home", icon: <FaHome />, path: "/" },
    { label: "Category", icon: <MdCategory />, path: "/category" },
    { label: "Item", icon: <MdInventory />, path: "/item" },
  ];

  const navigate = useNavigate();

  return (
    // <>
    //   {/* Mobile Hamburger */}
    //   <div className="md:hidden flex items-center p-4 bg-gray-800 text-white">
    //     <button onClick={() => setMobileOpen(!mobileOpen)}>
    //       <FaBars size={24} />
    //     </button>
    //     <span className="ml-2 font-bold">Menu</span>
    //   </div>

    //   {/* Sidebar */}
    //   <div
    //     className={`
    //       fixed top-0 left-0 h-full bg-gray-800 text-white
    //       transform transition-transform duration-300 ease-in-out
    //       ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
    //       md:translate-x-0 md:flex md:flex-col
    //       ${isOpen ? 'w-64' : 'w-20'}
    //     `}
    //   >
    //     {/* Toggle Button for Desktop */}
    //     <div className="hidden md:flex justify-end p-2">
    //       <button onClick={() => setIsOpen(!isOpen)}>
    //         <FaBars />
    //       </button>
    //     </div>

    //     {/* Menu Items */}
    //     <nav className="flex flex-col mt-4 space-y-2">
    //       {menuItems.map((item) => (
    //         <Link
    //           key={item.name}
    //           to={item.path}
    //           className="flex items-center p-2 hover:bg-gray-700 rounded"
    //         >
    //           <span className="text-lg">{item.icon}</span>
    //           {isOpen && <span className="ml-2">{item.name}</span>}
    //         </Link>
    //       ))}
    //     </nav>
    //   </div>

    //   {/* Overlay on Mobile */}
    //   {mobileOpen && (
    //     <div
    //       className="fixed inset-0 bg-black opacity-50 md:hidden"
    //       onClick={() => setMobileOpen(false)}
    //     ></div>
    //   )}
    // </>

    // <div className="h-screen w-56 bg-gray-900 text-white flex flex-col">
    //   {/* Logo */}
    //   <div className="flex items-center justify-center py-6 border-b border-gray-700">
    //     <div className="text-center">
    //       <div className="w-12 h-12 mx-auto flex items-center justify-center bg-white text-black rounded-full font-bold text-xl">
    //         M
    //       </div>
    //       <h1 className="mt-2 font-bold text-sm tracking-wide">MARLINE</h1>
    //     </div>
    //   </div>

    //   {/* Menu Items */}
    //   <nav className="flex-1 mt-6">
    //     <ul className="space-y-2">
    //       {menuItems.map((item) => (
    //         <li key={item.name}>
    //           <button
    //             onClick={() => setActive(item.name)}
    //             className={`flex items-center gap-3 w-full px-4 py-2 text-sm font-medium transition-all
    //               ${
    //                 active === item.name
    //                   ? "bg-white text-black rounded-full"
    //                   : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
    //               }`}
    //           >
    //             {item.icon}
    //             <span>{item.name}</span>
    //           </button>
    //         </li>
    //       ))}
    //     </ul>
    //   </nav>
    // </div>

    <div className="sidebar">
      <div className="logo-container">
        <img
          src={companyLogo}
          alt="company Logo"
          className=""
        />
        <h2 className="">Vista Inventory</h2>
      </div>
      {menuItems.map((item, index) => (
        <div key={index} className="sidebar-item" onClick={()=>navigate(item.path)}>
          <span role="img" aria-label={item.label}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
