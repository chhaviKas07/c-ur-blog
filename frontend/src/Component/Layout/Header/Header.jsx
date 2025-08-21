// import React from "react";
// import "./Header.css";
// import { ReactNavbar } from "overlay-navbar";
// import logo from "../../../assets/logo.png";
// import { MdAccountCircle } from "react-icons/md";
// import { MdSearch } from "react-icons/md";
// import { MdAddShoppingCart } from "react-icons/md";

// const options = {
//   burgerColorHover: "#eb4034",
//   logo,
//   logoWidth: "20vmax",
//   navColor1: "white",
//   logoHoverSize: "10px",
//   logoHoverColor: "#eb4034",
//   link1Text: "Home",
//   link2Text: "Products",
//   link3Text: "Contact",
//   link4Text: "About",
//   link1Url: "/",
//   link2Url: "/products",
//   link3Url: "/contact",
//   link4Url: "/about",
//   link1Size: "1.3vmax",
//   link1Color: "rgba(35, 35, 35,0.8)",
//   nav1justifyContent: "flex-end",
//   nav2justifyContent: "flex-end",
//   nav3justifyContent: "flex-start",
//   nav4justifyContent: "flex-start",
//   link1ColorHover: "#eb4034",
//   link1Margin: "1vmax",
//   profileIconUrl: "/login",
//   profileIconColor: "rgba(35, 35, 35,0.8)",
//   searchIconColor: "rgba(35, 35, 35,0.8)",
//   cartIconColor: "rgba(35, 35, 35,0.8)",
//   profileIconColorHover: "#eb4034",
//   searchIconColorHover: "#eb4034",
//   cartIconColorHover: "#eb4034",
//   cartIconMargin: "1vmax",
//   profileIcon: true,
//   profileIconColor: "rgba(35, 35, 35,0.8)",
//   ProfileIconElement: MdAccountCircle,
//   searchIcon: true,
//   searchIconColor: "rgba(35, 35, 35,0.8)",
//   SearchIconElement: MdSearch,
//   cartIcon: true,
//   cartIconColor: "rgba(35, 35, 35,0.8)",
//   CartIconElement: MdAddShoppingCart,
// };

// const Header = () => {
//   return <ReactNavbar {...options} />;
// };

// export default Header;



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
