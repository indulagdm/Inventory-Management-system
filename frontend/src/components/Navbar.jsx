import React, {useState} from "react";
import companyLogo from "../../public/images/vista-inventory.png";
import { FaHome, FaUser, FaCog, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  // const [isOpen, setIsOpen] = useState(false);

  // const toggleSidebar = () => setIsOpen(!isOpen);
  // return (
  //   <div>
  //     {/* Mobile Hamburger Icon */}
  //     <div className="md:hidden flex items-center p-4 bg-gray-800 text-white">
  //       <button onClick={toggleSidebar}>
  //         {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
  //       </button>
  //       <span className="ml-2 font-bold">Menu</span>
  //     </div>

  //     {/* Sidebar */}
  //     <div
  //       className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
  //         isOpen ? "translate-x-0" : "-translate-x-full"
  //       } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col`}
  //     >
  //       <h2 className="text-2xl font-bold p-4 border-b border-gray-700">
  //         My App
  //       </h2>
  //       <nav className="flex flex-col p-4 space-y-2">
  //         <Link to="/" className="hover:bg-gray-700 p-2 rounded">
  //           Home
  //         </Link>
  //         <Link to="/about" className="hover:bg-gray-700 p-2 rounded">
  //           About
  //         </Link>
  //         <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">
  //           Dashboard
  //         </Link>
  //         <Link to="/contact" className="hover:bg-gray-700 p-2 rounded">
  //           Contact
  //         </Link>
  //       </nav>
  //     </div>

  //     {/* Overlay on Mobile */}
  //     {isOpen && (
  //       <div
  //         className="fixed inset-0 bg-black opacity-50 md:hidden"
  //         onClick={toggleSidebar}
  //       ></div>
  //     )}
  //   </div>
  // );

  const [isOpen, setIsOpen] = useState(false); // Desktop toggle
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile toggle

  const menuItems = [
    { name: 'Home', icon: <FaHome />, path: '/' },
    { name: 'Profile', icon: <FaUser />, path: '/profile' },
    { name: 'Settings', icon: <FaCog />, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center p-4 bg-gray-800 text-white">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          <FaBars size={24} />
        </button>
        <span className="ml-2 font-bold">Menu</span>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-gray-800 text-white
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:flex md:flex-col
          ${isOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Toggle Button for Desktop */}
        <div className="hidden md:flex justify-end p-2">
          <button onClick={() => setIsOpen(!isOpen)}>
            <FaBars />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col mt-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span className="ml-2">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay on Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
