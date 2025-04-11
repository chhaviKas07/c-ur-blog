import React, { useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import "./dashboard.css";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, getAllProductsAdmin } from "../../productSlice.jsx";
import { getAllOrders } from "../../OrderSlice.jsx";
import { getAllUsers } from "../../userSlice.jsx";
import MetaData from "../layout/MetaData";
Chart.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement
);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { adminProducts = [] } = useSelector((state) => state.products) || {}; // Default to empty array
  // const { orders = [] } = useSelector((state) => state.orders) || {}; // Default to empty array
  const { orders, loading, error } = useSelector((state) => state.orders);
  console.log("Orders State:", orders, "Loading:", loading, "Error:", error);
  
  const { users = [] } = useSelector((state) => state.userAdmin) || {};

  // let outOfStock = 0;
  // orders.forEach((item) => {
  //   if (item.Stock === 0) {
  //     outOfStock += 1;
  //   }
  // });

  let outOfStock = 0;
  adminProducts.forEach((item) => {
  if (item.Stock === 0) {
    outOfStock += 1;
  }
});


  useEffect(() => {
    // dispatch(getProducts());
    dispatch(getAllProductsAdmin());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);
  
  useEffect(() => {
    console.log("Products:", adminProducts);
    console.log("Orders:", orders);
    console.log("Users:", users);
  }, [adminProducts, orders, users]);
  
  useEffect(() => {
    dispatch(getAllProductsAdmin({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllOrders({}));
  }, [dispatch]);
  
  let totalAmount = 0;
  orders.forEach((item) => {
    totalAmount += item.totalPrice;
  });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, adminProducts.length - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{adminProducts && adminProducts.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>
        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
