import React, { useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import "./dashboard.css";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Doughnut, Line,Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement, 
} from "chart.js";
import { Line as LineChart } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, getAllProductsAdmin,fetchEcoSummary, fetchTopEcoProducts, fetchMonthlyCarbon  } from "../../productSlice.jsx";
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
  PointElement,
  BarElement          
);


const Dashboard = () => {
  const dispatch = useDispatch();

  // const { adminProducts = [] } = useSelector((state) => state.products) || {}; // Default to empty array
  // const { products = [] } = useSelector((state) => state.products);
  const { adminProducts = [] } = useSelector((state) => state.products);
  // const { orders = [] } = useSelector((state) => state.orders) || {}; // Default to empty array
  const { orders, loading, error } = useSelector((state) => state.orders);
  // console.log("Orders State:", orders, "Loading:", loading, "Error:", error);
  
  const { users = [] } = useSelector((state) => state.userAdmin) || {};


  // const { totalCarbonSaved, ecoCount, nonEcoCount, topProducts } = useSelector(state => state.products);
  
const {
  totalCarbonSaved = 0,
  ecoCount = 0,
  nonEcoCount = 0,
  topProducts = [],
} = useSelector((state) => state.products || {});
const { monthlyCarbon } = useSelector((state) => state.products);


useEffect(() => {
  dispatch(fetchEcoSummary());
  dispatch(fetchTopEcoProducts());
    dispatch(fetchMonthlyCarbon());
}, [dispatch]);

const ecoDoughnutData = {
  labels: ["Eco-Certified", "Non-Eco"],
  datasets: [
    {
      backgroundColor: ["#4CAF50", "#F44336"],
      hoverBackgroundColor: ["#66BB6A", "#E57373"],
      data: [ecoCount, nonEcoCount],
    },
  ],
};
const ecoBarData = {
  labels: topProducts.map((p) => p.name),
  datasets: [
    {
      label: "Carbon Saved (g)",
      backgroundColor: "#2196F3",
      data: topProducts.map((p) => p.carbonSaved),
    },
  ],
};

  let outOfStock = 0;
  adminProducts.forEach((item) => {
  if (item.stock === 0) {
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
    // console.log("Products:", adminProducts);
    // console.log("Orders:", orders);
    // console.log("Users:", users);
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
  // Round to 2 decimal places
totalAmount = parseFloat(totalAmount.toFixed(2));

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

  const monthlyCarbonData = {
  labels: monthlyCarbon.map((entry) => entry.month),
  datasets: [
    {
      label: "Monthly Carbon Saved (g)",
      data: monthlyCarbon.map((entry) => entry.carbonSaved),
      fill: false,
      borderColor: "#4CAF50",
      backgroundColor: "#81C784",
      tension: 0.3,
    },
  ],
};

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        {/* <Typography component="h1">Dashboard</Typography> */}

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
        <div className="chartSection">
  <div className="lineChart">
    <Line data={lineState} />
  </div>

  <div className="doughnutChart">
    <Doughnut data={doughnutState} />
  </div>

  <div className="doughnutChart">
    <Doughnut data={ecoDoughnutData} />
  </div>

  <div className="barChart">
    <Bar data={ecoBarData} />
  </div>
  <div className="lineChart">
  <h3 style={{ margin: "1rem 0" }}>📈 Monthly Carbon Saved</h3>
  <LineChart data={monthlyCarbonData} />
</div>
</div>

<div className="ecoSummaryBox">
  <h3>♻️ Eco Analytics</h3>
  <p><strong>Total Carbon Saved:</strong> {totalCarbonSaved?.toFixed(2) || 0} g CO₂</p>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
