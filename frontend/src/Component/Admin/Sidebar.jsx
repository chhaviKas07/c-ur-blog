import { React, useState, useEffect } from "react";
import "./sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const Sidebar = () => {
  const location = useLocation();
  // Section active when any child route matches:
  const isProductsActive =
    location.pathname.startsWith("/admin/products") ||
    location.pathname.startsWith("/admin/product/new");
  const [sidebarTop, setSidebarTop] = useState(70);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY === 0) {
  //       // At top of page
  //       setSidebarTop(70); // sidebar top 0px
  //     } else {
  //       setSidebarTop(5); // otherwise 70px below header
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   // Call handler once on mount in case page is already scrolled
  //   handleScroll();

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <div className="sidebar"
    //  style={{
    //   top: `${sidebarTop}px`,
    //   position: "fixed",
    //   left: 0,
    //   height: `calc(100vh - ${sidebarTop}px)`,
    // }}
    >
      <NavLink to="/admin/dashboard" className="sidebar-link">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </NavLink>

      <div className={`sidebar-section${isProductsActive ? " active-section" : ""}`}>
        <p className="sidebar-section-title">
          <Inventory2Icon /> Products
        </p>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <PostAddIcon />
          <span>All</span>
        </NavLink>

        <NavLink
          to="/admin/product/new"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <AddIcon />
          <span>Create</span>
        </NavLink>
      </div>

      <NavLink to="/admin/orders" className="sidebar-link">
        <p>
          <ListAltIcon /> Orders
        </p>
      </NavLink>

      <NavLink to="/admin/users" className="sidebar-link">
        <p>
          <PeopleIcon /> Users
        </p>
      </NavLink>

      <NavLink to="/admin/reviews" className="sidebar-link">
        <p>
          <RateReviewIcon /> Reviews
        </p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
