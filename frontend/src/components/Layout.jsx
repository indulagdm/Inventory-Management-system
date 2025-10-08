import React from "react";
import Sidebar from "./Navbar.jsx"; // Rename to Sidebar for clarity
import { useLocation } from "react-router-dom";
import Footer from "./Footer.jsx";
import "./Layout.css"; // Import layout styles

const Layout = ({ children }) => {
  const location = useLocation();

  // Show sidebar only on specific routes
  const showSidebar =
    location.pathname === "/" ||
    location.pathname === "/items" ||
    location.pathname === "/categories" ||
    location.pathname === "/invoices" ||
    location.pathname === "/transactions";

  return (
    <div className="layout-container">
      {showSidebar && (
        <aside className="sidebar">
          <Sidebar />
        </aside>
      )}
      <div className={`main-content ${showSidebar ? "with-sidebar" : ""}`}>
        <main>{children}</main>
        {/* Uncomment if Footer is needed */}
        {/* {showSidebar && <Footer />} */}
      </div>
    </div>
  );
};

export default Layout;
