import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { loadUser } from "./userSlice.jsx";
import { loadShippingInfo, loadShippingInfoForUser } from "./CartSlice.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ScrollToTop from "./component/ScrollToTop.jsx";
import store from "./store.jsx";
import Payment from "./component/Cart/Payment.jsx";                    //R C
import Footer from "./component/layout/Footer/Footer.jsx";             //D
import Header from "./component/layout/Header/Header.jsx";             //D
import Home from "./component/Home/Home.jsx";                          //D
import ProductDetails from "./component/Product/ProductDetails.jsx";   //D
import Products from "./component/Product/Products.jsx";               //D
import Search from "./component/Product/Search.jsx";                   //D 
import LoginSignUp from "./component/User/LoginSignUp.jsx";            //D
import UserOptions from "./component/layout/Header/UserOptions.jsx";   //D
import Profile from "./component/User/Profile.jsx";                    //D
import ProtectedRoute from "./component/Route/ProtectedRoute.jsx";     //D
import UpdateProfile from "./component/User/UpdateProfile.jsx";        //D
import UpdatePassword from "./component/User/UpdatePassword.jsx";      //D
import ForgotPassword from "./component/User/ForgotPassword.jsx";      //D
import ResetPassword from "./component/User/ResetPassword.jsx";        //D
import Cart from "./component/Cart/Cart.jsx";                          //D         
import Shipping from "./component/Cart/Shipping.jsx";                  //D
import ConfirmOrder from "./component/Cart/ConfirmOrder.jsx";          //D
import OrderSuccess from "./component/Cart/OrderSuccess.jsx";          //D 
import MyOrders from "./component/Order/MyOrders.jsx";                 //D                   
import OrderDetails from "./component/Order/OrderDetails.jsx";         //D

import Dashboard from "./component/Admin/Dashboard.jsx";               //D  
import ProductList from "./component/Admin/ProductList.jsx";           //D 
import NewProduct from "./component/Admin/NewProduct.jsx";             //D 
import UpdateProduct from "./component/Admin/UpdateProduct.jsx";       //D
import OrderList from "./component/Admin/OrderList.jsx";               //D 
import ProcessOrder from "./component/Admin/ProcessOrder.jsx";         //D
import UsersList from "./component/Admin/UsersList.jsx";               //D   
import UpdateUser from "./component/Admin/UpdateUser.jsx";             //D   
import ProductReviews from "./component/Admin/ProductReviews.jsx";     //D   

import Contact from "./component/layout/Contact/Contact.jsx";          //D
import About from "./component/layout/About/About.jsx";                //D
import NotFound from "./component/layout/Not Found/NotFound.jsx";      //D


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    try {
      const token = localStorage.getItem("token"); // or get it from Redux

      const { data } = await axios.get("/api/v1/stripeapikey", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.error("Failed to get Stripe API Key:", error);
    }
  }

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);


  useEffect(() => {
    if (isAuthenticated) {
      getStripeApiKey();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(loadShippingInfo());
    }
  }, [user]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      // console.log("📦 App init: loading shipping info for user", user._id);
      dispatch(loadShippingInfoForUser(user._id));
    }
  }, [dispatch]);

  window.addEventListener("contextmenu", (e) => e.preventDefault());


  const location = useLocation();

  const hiddenPaths = [
    "/admin/dashboard",
    "/shipping",
    "/process/payment",
    "/success",
    "/order/confirm",
    "/admin/products",
    "/admin/product/new",
    "/admin/orders",
    "/admin/users",
    "/admin/user/",
    "/admin/reviews",
    "/admin/product/",
    "/admin/order/",
  ];

  const hideHeaderFooter = hiddenPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <ToastContainer />
      {/* <ToastContainer position="bottom-center" autoClose={3000} newestOnTop /> */}
      {!hideHeaderFooter && <Header />}

      {isAuthenticated && <UserOptions user={user} />}
      <ScrollToTop />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/login" element={<LoginSignUp />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/account" /> : <LoginSignUp />
          }
        />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/about" element={<About />} />
        <Route element={<ProtectedRoute />}>
          <Route exact path="/account" element={<Profile />} />
          <Route exact path="/me/update" element={<UpdateProfile />} />
          <Route exact path="/password/update" element={<UpdatePassword />} />
        </Route>
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route
          exact
          path="/password/reset/:token"
          element={<ResetPassword />}
        />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/shipping" element={<Shipping />} />
        <Route exact path="/order/confirm" element={<ConfirmOrder />} />

        {stripeApiKey && (
          <Route
            path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            }
          />
        )}
        <Route exact path="/success" element={<OrderSuccess />} />
        <Route exact path="/orders" element={<MyOrders />} />
        <Route exact path="/order/:id" element={<OrderDetails />} />

        <Route
          isAdmin={true}
          exact
          path="/admin/dashboard"
          element={<Dashboard />}
        />
        <Route
          isAdmin={true}
          exact
          path="/admin/products"
          element={<ProductList />}
        />
        <Route
          exact
          path="/admin/product/new"
          isAdmin={true}
          element={<NewProduct />}
        />

        <Route
          exact
          path="/admin/orders"
          isAdmin={true}
          element={<OrderList />}
        />

        <Route
          exact
          path="/admin/users"
          isAdmin={true}
          element={<UsersList />}
        />

        <Route
          exact
          path="/admin/user/:id"
          isAdmin={true}
          element={<UpdateUser />}
        />

        <Route
          exact
          path="/admin/reviews"
          isAdmin={true}
          element={<ProductReviews />}
        />

        <Route
          exact
          path="/admin/product/:id"
          isAdmin={true}
          element={<UpdateProduct />}
        />

        <Route
          exact
          path="/admin/order/:id"
          isAdmin={true}
          element={<ProcessOrder />}
        />

        <Route
          path="*"
          element={
            window.location.pathname === "/process/payment" ? null : <NotFound />
          }
        />

      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
