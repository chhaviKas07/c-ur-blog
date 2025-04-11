// import React from "react";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import "./orderSuccess.css";
// import Typography from "@mui/material/Typography";
// import { Link } from "react-router-dom";

// const OrderSuccess = () => {
//   return (
//     <div className="orderSuccess">
//       <CheckCircleIcon />

//       <Typography>Your Order has been Placed successfully </Typography>
//       <Link to="/orders">View Orders</Link>
//     </div>
//   );
// };

// export default OrderSuccess;

import {React, useEffect} from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./orderSuccess.css";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeItemsFromCart, clearCart } from "../../CartSlice.jsx"

const OrderSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart()); // ✅ clear cart on component mount
  }, [dispatch]);

  return (
    <div className="orderSuccess">
      <CheckCircleIcon />

      <Typography>Your Order has been Placed successfully </Typography>
      <Link to="/orders">View Orders</Link>
    </div>
  );
};

export default OrderSuccess;

