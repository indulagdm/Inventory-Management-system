import React from "react";
import './Footer.css';

const Footer = () => {
  return (
    <div>
      <div className="footer-container">
        <div className="footer-left">
            <h6>Halo</h6>
        </div>
        <div className="footer-right">
          <div className="social-icon">
            <div className="footer-social">
              <h6>facebook</h6>
              <h6>whatsapp</h6>
            </div>
            <div className="company-details">
                <h6>Vista</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
