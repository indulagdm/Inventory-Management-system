import React from "react";
import Navbar from "./Navbar.jsx"; // Adjust path based on your structure
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  // return (
  //   <div className="app-container">
  //     <Navbar /> {/* Navbar will appear on all pages */}
  //     <main>{children}</main> {/* Child pages rendered here */}
  //   </div>
  // );

  const location = useLocation();

  // Show Navbar only on the main page ("/")
  const showNavbar = location.pathname === "/";

  return (
    <div className="flex-1 p-6">
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
