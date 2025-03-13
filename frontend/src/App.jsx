import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Component/Layout/Header/Header";
import Footer from "./Component/Layout/Footer/Footer.jsx";

import Home from "./Component/Home/Home.jsx"; //
import BlogDetails from "./Component/Blog/BlogDetail.jsx"; //
import Blogs from "./Component/Blog/Blogs.jsx"; //

import Search from "./Component/Blog/Search.jsx";
import LoginSignUp from "./Component/User/LoginSignUp.jsx";
import Store from "./Store.jsx";
import { useEffect, useState } from "react";
import { loadUser } from "./Slices/UserSlice.jsx";
import UserOptions from "./Component/Layout/Header/UserOption.jsx";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./Component/User/Profile.jsx";
import ProtectedRoute from "./Component/Route/ProtectedRoute.jsx";

import UpdateProfile from "./Component/User/UpdateProfile.jsx"; //

import { Navigate } from "react-router-dom";
import UpdatePassword from "./Component/User/UpdatePassword.jsx";
import ForgotPassword from "./Component/User/ForgotPassword.jsx";
import ResetPassword from "./Component/User/ResetPassword.jsx";

import Cart from "./Component/Cart/Cart.jsx";
import Shipping from "./Component/Cart/Shipping.jsx";
import ConfirmOrder from "./Component/Cart/ConfirmOrder.jsx";
import axios from "axios";
import Payment from "./Component/Cart/Payment.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./Component/Cart/OrderSuccess.jsx";
import MyOrders from "./Component/Order/MyOrders.jsx";
import OrderDetails from "./Component/Order/OrderDetails.jsx";

import Dashboard from "./Component/Admin/Dashboard.jsx";
import BlogList from "./Component/Admin/BlogList.jsx"; //
import NewBlog from "./Component/Admin/NewBlog.jsx"; //
import UpdateBlog from "./Component/Admin/UpdateBlog.jsx"; //
import OrderList from "./Component/Admin/OrderList.jsx";
import ProcessOrder from "./Component/Admin/ProcessOrder.jsx";
import UsersLists from "./Component/Admin/UsersLists.jsx"; //
import UpdateUser from "./Component/Admin/UpdateUser.jsx";
import BlogReviews from "./Component/Admin/BlogReviews.jsx";

// import Contact from "./Component/layout/Contact/Contact";
// import About from "./Component/layout/About/About";
// import NotFound from "./Component/layout/Not Found/NotFound";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    dispatch(loadUser());
    getStripeApiKey();
  }, [dispatch]);

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        {/* <Route exact path="/" element={<Home />} />
        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRoute
              exact
              path="/process/payment"
              component={<Payment />}
            />
          </Elements>
        )} */}
        <Route exact path="/" element={<Home />} />
        <Route exact path="/blog/:id" element={<BlogDetails />} />
        <Route exact path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:keyword" element={<Blogs />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/login" element={<LoginSignUp />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/account" /> : <LoginSignUp />
          }
        />
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
        <Route exact path="/blogpayments/me" element={<MyOrders />} />
        <Route exact path="/blogpayment/:id" element={<OrderDetails />} />
        <Route
          isAdmin={true}
          exact
          path="/admin/dashboard"
          element={<Dashboard />}
        />
        <Route
          isAdmin={true}
          exact
          path="/admin/blogs"
          element={<BlogList />}
        />
        <Route
          isAdmin={true}
          exact
          path="/admin/blog/new"
          element={<NewBlog />}
        />
        <Route
          exact
          path="/admin/blog/:id"
          isAdmin={true}
          element={<UpdateBlog />}
        />
        <Route
          exact
          path="/admin/blogpayments"
          isAdmin={true}
          element={<OrderList />}
        />
        <Route
          exact
          path="/admin/blogpayment/:id"
          isAdmin={true}
          element={<ProcessOrder />}
        />
        <Route
          exact
          path="/admin/users"
          isAdmin={true}
          element={<UsersLists />}
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
          element={<BlogReviews />}
        />
        {/* <Route exact path="/contact" element={<Contact />} /> */}

        {/* <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
        <ProtectedRoute exact path="/account" component={Profile} />
        <Route exact path="/about" element={<About />} />
        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/success" component={OrderSuccess} />
        <ProtectedRoute exact path="/orders" component={MyOrders} />
        <ProtectedRoute exact path="/order/:id" component={OrderDetails} />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/dashboard"
          component={Dashboard}
        /> */}
        {/* <ProtectedRoute
          exact
          path="/admin/products"
          isAdmin={true}
          component={ProductList}
        /> */}
        {/* <ProtectedRoute
          exact
          path="/admin/product"
          isAdmin={true}
          component={NewProduct}
        /> */}
        {/* <ProtectedRoute
          exact
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
        /> */}
        {/* <ProtectedRoute
          exact
          path="/admin/orders"
          isAdmin={true}
          component={OrderList}
        />
        <ProtectedRoute
          exact
          path="/admin/order/:id"
          isAdmin={true}
          component={ProcessOrder}
        />
        <ProtectedRoute
          exact
          path="/admin/users"
          isAdmin={true}
          component={UsersLists}
        />
        <ProtectedRoute
          exact
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
        /> */}
        {/* <ProtectedRoute
          exact
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
        /> */}
        {/* <Route
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
        /> */}
        {/* </Switch> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
