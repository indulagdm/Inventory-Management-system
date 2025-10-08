import React from "react";
import companyLogo from "../../public/images/Vista-International-rm-background.png";
import { FaHome, FaFileInvoice } from "react-icons/fa";
import { MdCategory, MdInventory, MdPointOfSale } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar-container">
      <div className="logo-container">
        <img src={companyLogo} alt="Company Logo" className="logo" />
        <h2 className="company-name">Inventory</h2>
      </div>
      <div className="side-items-ul">
        <ul>
          <li className="side-item-li" onClick={() => navigate("/")}>
            <span className="label-logo">
              <FaHome className="side-item-logo" />
            </span>
            <span>Home</span>
          </li>
          <li className="side-item-li" onClick={() => navigate("/categories")}>
            <span className="label-logo">
              <MdCategory className="side-item-logo" />
            </span>
            <span>Category</span>
          </li>
          <li className="side-item-li" onClick={() => navigate("/items")}>
            <span className="label-logo">
              <MdInventory className="side-item-logo" />
            </span>
            <span>Item</span>
          </li>
          <li className="side-item-li" onClick={() => navigate("/invoices")}>
            <span className="label-logo">
              <FaFileInvoice className="side-item-logo" />
            </span>
            <span>Invoice</span>
          </li>
          <li className="side-item-li" onClick={() => navigate("/transactions")}>
            <span className="label-logo">
              <MdPointOfSale className="side-item-logo" />
            </span>
            <span>Transactions</span>
          </li>
        </ul>
      </div>
      <div className="footer-part">
        <p className="developer-name">Developed By Vista IT Solutions @ 2025</p>
      </div>
    </aside>
  );
};

export default Navbar;
