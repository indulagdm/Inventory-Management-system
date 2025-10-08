import React from "react";
import Navbar from "./Navbar.jsx"; // Adjust path based on your structure
import { useLocation } from "react-router-dom";
import Footer from "./Footer.jsx";

const Layout = ({ children }) => {
  const location = useLocation();

  // Show Navbar only on the main page ("/")
  const showNavbar =
    location.pathname === "/" ||
    location.pathname === "/items" ||
    location.pathname === "/categories" ||
    location.pathname === "/invoices" ||
    location.pathname === "/transactions";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          marginLeft: showNavbar ? "2rem" : 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {showNavbar && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "250px",
              height: "100vh",
              zIndex: 1000,
            }}
          >
            <Navbar />
          </div>
        )}
        <div
          style={{
            marginLeft: showNavbar ? "250px" : "0",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: "100vh",
          }}
        >
          <main style={{ flex: 1, padding: "20px" }}>{children}</main>
        </div>

        {/* {showNavbar && <Footer/>} */}
      </div>
    </div>

    // <div style={{ display: "flex", minHeight: "100vh" }}>
    //   <div>
    //     <Navbar />
    //   </div>

    //   <div
    //     style={{
    //       marginLeft: showNavbar ? "250px" : 0, // if no sidebar, take full width
    //       display: "flex",
    //       flexDirection: "column",
    //       flex: 1,
    //     }}
    //   >
    //     {showNavbar && <Navbar />}
    //     <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    //   </div>
    // </div>
  );
};

export default Layout;
