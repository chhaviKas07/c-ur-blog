import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>About Us</h4>
        <p>We promote sustainable shopping through eco-friendly products.</p>
      </div>

      <div className="midFooter">
        <h1>Eco-friendly Marketplace</h1>
        <p>Quality and Sustainability First</p>
        <p>Copyright © 2024 CHHAVI</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
