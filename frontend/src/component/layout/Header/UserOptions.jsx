import React, { Fragment, useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction, Backdrop } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Navigate, useNavigate } from "react-router-dom"; // ✅ Use Navigate
import { logout } from "../../../userSlice.jsx";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserOptions = ({ user }) => {
  const { cartItems } = useSelector((state) => state.cart);


  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    navigate("/admin/dashboard"); // ✅ Use navigate
  }

  function orders() {
    navigate("/orders");
  }
  function account() {
    navigate("/account");
  }
  function cart() {
    navigate("/cart");
  }

  // function logoutUser() {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));
  //   if (storedUser && storedUser._id) {
  //     localStorage.removeItem(`shippingInfo_${storedUser._id}`);
  //   }
  //   dispatch(logout());
  //   toast.success("Logout Successfully");
  //   navigate("/login");
  // }
  function logoutUser() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      localStorage.removeItem(`shippingInfo_${storedUser._id}`);
    }
    dispatch(logout());
    toast.success("Logout Successfully");

    setTimeout(() => {
      navigate("/login");
    }, 1500); // give toast 1.5s to show
  }

  return (
    <Fragment>
      {/* <ToastContainer /> */}
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar?.url || "/Profile.png"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;