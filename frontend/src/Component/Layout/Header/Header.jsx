import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdAccountCircle, MdSearch, MdAddShoppingCart, MdMenu, MdClose } from "react-icons/md";
import logo from "../../../assets/logo.png";
import "./Header.css";
import { useSelector } from "react-redux";
import UserOptions from "./UserOptions";

const Header = () => {
  const { user } = useSelector((state) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <img src={logo} alt="EcoMarket Logo" />
        </Link>
        <button className="header__burger" onClick={toggleMenu} aria-label="Toggle navigation menu">
          {menuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
        </button>
        <nav id="navbar" className={`header__nav ${menuOpen ? "active" : ""}`}>
          <ul>
            <li className="item"><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li className="item"><Link to="/products" onClick={closeMenu}>Products</Link></li>
            <li className="item"><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            <li className="item"><Link to="/about" onClick={closeMenu}>About</Link></li>
          </ul>
        </nav>
        <div className="header__icons">
          <Link to="/search" aria-label="Search" className="icon-link"><MdSearch size={26} /></Link>
          <Link to="/cart" aria-label="Shopping Cart" className="icon-link">
            <MdAddShoppingCart size={26} />
          </Link>
{user ? (
  <UserOptions user={user} />
) : (
  <Link to="/login" aria-label="User Account" className="icon-link">
    <MdAccountCircle size={28} />
  </Link>
)}
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
