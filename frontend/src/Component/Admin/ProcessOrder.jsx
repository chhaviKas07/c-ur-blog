import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../Layout/MetaData";
import { Link, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import SideBar from "./Sidebar";
import {
  getUserBlogPaymentDetails,
  clearErrors,
  updateUserBlogPayment,
  updateBlogPaymentReset,
} from "../../Slices/OrderSlice";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader/Loader";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@mui/material";
import "./processOrder.css";

const ProcessOrder = () => {
  const { userBlogPayment, error, loading } = useSelector(
    (state) => state.orders
  );
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.orders
  );

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("status", status);

    dispatch(updateUserBlogPayment({ id, paymentData: myForm }));
  };

  const dispatch = useDispatch();
  const { id } = useParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Order Updated Successfully");
      dispatch(updateBlogPaymentReset()); // Ensure this is a function call
    }

    if (id) {
      dispatch(getUserBlogPaymentDetails(id));
    }
  }, [dispatch, toast, error, id, isUpdated, updateError]);

  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display:
                  userBlogPayment?.userBlogPaymentStatus === "Delivered"
                    ? "block"
                    : "grid",
              }}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{userBlogPayment?.user?.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>{userBlogPayment?.userInfo?.phoneNo}</span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {userBlogPayment?.userInfo &&
                          `${userBlogPayment.userInfo.address}, ${userBlogPayment.userInfo.city}, ${userBlogPayment.userInfo.state}, ${userBlogPayment.userInfo.pinCode}, ${userBlogPayment.userInfo.country}`}
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
                      <span>{userBlogPayment?.totalPrice}</span>
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
                        {userBlogPayment?.userBlogPaymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {userBlogPayment?.orderItems?.map((item) => (
                      <div key={item.product}>
                        <img src={item.image} alt="Product" />
                        <Link to={`/product/${item.product}`}>
                          {item.name}
                        </Link>{" "}
                        <span>
                          {item.quantity} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/*  */}
              <div
                style={{
                  display:
                    userBlogPayment?.userBlogPaymentStatus === "Delivered"
                      ? "none"
                      : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Category</option>
                      {userBlogPayment?.userBlogPaymentStatus ===
                        "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}

                      {userBlogPayment?.userBlogPaymentStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                      loading ? true : false || status === "" ? true : false
                    }
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
