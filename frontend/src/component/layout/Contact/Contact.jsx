import React, { useState } from "react";
import "./Contact.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you for reaching out to our eco-friendly marketplace!", {
      position: "top-center",
      autoClose: 3000
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contactPageContainer">
      <div className="contactLeft">
        <div className="ecoBg">
          <svg width="70" height="70" fill="none">
            <circle cx="35" cy="35" r="30" fill="#e7f7ea" />
            <path
              d="M25 40c5-20 30-25 25 5-1 6-8 10-13 10S26 48 25 40Z"
              fill="#72b774"
              stroke="#38794e"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="companyInfo">
          <h2>EcoMarket HQ</h2>
          <p>123 Green Avenue, Tree City, Earth 00001</p>
          <p>Email: hello@ecomarket.com</p>
          <p>Customer Care: +1 (800) 555-3333</p>
          <p className="verifiedShop">Safe & Verified Marketplace ✔️</p>
          <h3>We're here for you.</h3>
          <ul className="contactFeatures">
            <li>🌿 <strong>Eco-Customer Support:</strong> Quick help from our green team</li>
            <li>🚚 <strong>Order Tracking:</strong> Need help tracking your shipment? Just ask!</li>
            <li>♻️ <strong>Returns Center:</strong> Hassle-free eco returns & exchanges</li>
            <li>🔒 <strong>Data Secure:</strong> Your info is safe & never shared</li>
          </ul>
          <div className="contactLinks">
            <a href="/faq">FAQs</a>
            <a href="/shipping">Shipping Info</a>
            <a href="/returns">Returns</a>
            <a href="/about">About Us</a>
            <a href="/careers">Jobs</a>
          </div>
          <div className="socialIcons">
            <a href="#" className="socialItem" aria-label="Instagram">
              <svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="10" stroke="#38794e" strokeWidth="1.5" fill="none"/><circle cx="11" cy="11" r="5" fill="#72b774"/><circle cx="16" cy="6" r="1" fill="#38794e"/></svg>
            </a>
            <a href="#" className="socialItem" aria-label="Facebook">
              <svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="10" stroke="#38794e" strokeWidth="1.5" fill="none"/><rect x="9" y="8" width="2" height="6" fill="#72b774"/><rect x="11" y="12" width="2" height="2" fill="#38794e"/></svg>
            </a>
            <a href="#" className="socialItem" aria-label="Twitter">
              <svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="10" stroke="#38794e" strokeWidth="1.5" fill="none"/><path d="M7 12c2.5 2 7 2 9-2" stroke="#72b774" strokeWidth="1.5" fill="none"/></svg>
            </a>
          </div>
        </div>
      </div>
      <form className="contactForm" onSubmit={handleSubmit}>
        <h2 className="formTitle">Contact Us</h2>
        <p className="formSubtitle">We’re here to help and answer any questions about our eco-marketplace. 🌿</p>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="How may we help you?"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="contactBtn">Send Message</button>
        <div className="supportNote">
          <strong>Support Hours:</strong> 9AM – 7PM Mon–Sat<br />
          <span>We reply within 1 business day!</span>
        </div>
      </form>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Contact;
