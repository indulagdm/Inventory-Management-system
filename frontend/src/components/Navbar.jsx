import React from "react";
import companyLogo from "../../public/images/vista-inventory.png";
import { FaHome, FaUser, FaCog, FaBars } from "react-icons/fa";
import { MdCategory, MdInventory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div>
      <aside>
        <div className="logo-container">
          <img src={companyLogo} alt="company Logo" className="logo" />
          <h2 className="company-name">Vista Inventory</h2>
        </div>
        <div className="side-items-ul">
          <ul>
            <div className="side-item-li">
              <li onClick={() => navigate("/")}>
                <span className="label-logo">
                  <FaHome className="side-item-logo" />
                </span>
                <span>Home</span>
              </li>
            </div>
            <div className="side-item-li">
              <li onClick={() => navigate("/categories")}>
                <span className="label-logo">
                  <MdCategory className="side-item-logo" />
                </span>
                <span>Category</span>
              </li>
            </div>
            <div className="side-item-li">
              <li onClick={() => navigate("/items")}>
                <span className="label-logo">
                  <MdInventory className="side-item-logo" />
                </span>
                <span>Item</span>
              </li>
            </div>
          </ul>
        </div>
        <div className="footer-part">
          <p className="developer-name"> Developed By Vista IT Solutions @ 2025</p>
        </div>
      </aside>
    </div>

    // <div className="sidebar">
    //   <div className="logo-container">
    //     <img src={companyLogo} alt="company Logo" className="logo" />
    //     <h2 className="company-name">Vista Inventory</h2>
    //   </div>

    //   <div className="side-items-ul">
    //     <ul>
    //       <div className="side-item-li">
    //         <li onClick={() => navigate("/")}>
    //           <span className="label-logo">
    //             <FaHome className="side-item-logo"/>
    //           </span>
    //           <span>Home</span>
    //         </li>
    //       </div>
    //       <div className="side-item-li">
    //         <li onClick={() => navigate("/categories")}>
    //           <span className="label-logo">
    //             <MdCategory className="side-item-logo"/>
    //           </span>
    //           <span>Category</span>
    //         </li>
    //       </div>
    //       <div className="side-item-li">
    //         <li onClick={() => navigate("/items")}>
    //           <span className="label-logo">
    //             <MdInventory className="side-item-logo"/>
    //           </span>
    //           <span>Item</span>
    //         </li>
    //       </div>
    //     </ul>
    //   </div>
    // </div>
  );
};

export default Navbar;
