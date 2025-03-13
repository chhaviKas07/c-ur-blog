import React, { Fragment, useEffect } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../Layout/MetaData";
import { Link, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {
  getUserBlogPaymentDetails,
  clearErrors,
} from "../../Slices/OrderSlice"; // Ensure this import path matches your actual path
import Loader from "../Layout/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderDetails = () => {
  const { userBlogPayment, error, loading } = useSelector(
    (state) => state.orders
  );

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getUserBlogPaymentDetails(id));
  }, [dispatch, error, id]);

  return (
    <Fragment>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Order Details" />
          <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
              <Typography component="h1">
                Order #{userBlogPayment?._id || "Not Found"}
              </Typography>
              <Typography>Shipping Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name:</p>
                  <span>{userBlogPayment?.user?.name || "Not Available"}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>
                    {userBlogPayment?.userInfo?.phoneNo || "Not Available"}
                  </span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>
                    {userBlogPayment?.userInfo
                      ? `${userBlogPayment.userInfo.address}, ${userBlogPayment.userInfo.city}, ${userBlogPayment.userInfo.state}, ${userBlogPayment.userInfo.pinCode}, ${userBlogPayment.userInfo.country}`
                      : "Not Available"}
                  </span>
                </div>
              </div>
              <Typography>Payment</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      userBlogPayment?.paymentInfo?.status === "succeeded"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {userBlogPayment?.paymentInfo?.status === "succeeded"
                      ? "PAID"
                      : "NOT PAID"}
                  </p>
                </div>
                <div>
                  <p>Amount:</p>
                  <span>{userBlogPayment?.totalPrice || "Not Available"}</span>
                </div>
              </div>

              <Typography>Order Status</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      userBlogPayment?.userBlogPaymentStatus === "Delivered"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {userBlogPayment?.userBlogPaymentStatus || "Not Available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="orderDetailsCartItems">
              <Typography>Order Items:</Typography>
              <div className="orderDetailsCartItemsContainer">
                {userBlogPayment?.orderItems?.map((item) => (
                  <div key={item.blog}>
                    <img src={item.image} alt={item.title} />
                    <Link to={`/product/${item.blog}`}>{item.title}</Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                )) || "No Items"}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
