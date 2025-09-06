import React from "react";
import "./Footer.css";
import logo from "../../../assets/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter"; // X is still TwitterIcon here
import YouTubeIcon from "@mui/icons-material/YouTube";
import PinterestIcon from "@mui/icons-material/Pinterest";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="footer" className="ecoFooter">
      <h2 className="ecoFooter__title">
        <img src={logo} alt="EcoMarket Logo" />
      </h2>

      <div className="ecoFooter__social">
        <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
          <FacebookIcon />
        </a>
        <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          <InstagramIcon />
        </a>
        <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
          <TwitterIcon />
        </a>
        <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
          <YouTubeIcon />
        </a>
        <a href="https://pinterest.com" aria-label="Pinterest" target="_blank" rel="noopener noreferrer">
          <PinterestIcon />
        </a>
      </div>

      <p className="ecoFooter__text">
        We’re committed to sustainable living, conscious choices, and a greener tomorrow.
        From eco-friendly products to responsible packaging, EcoMarket is your one-stop place for ethical shopping.
        Let’s grow green together.
      </p>

      <nav className="ecoFooter__nav" aria-label="Footer Navigation">
        <Link to="/about">About</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </footer>
  );
};

export default Footer;
