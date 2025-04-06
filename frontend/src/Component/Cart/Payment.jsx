// import React, { Fragment, useEffect, useRef } from "react";
// import CheckoutSteps from "../../Component/Cart/CheckoutSteps";
// import { useSelector, useDispatch } from "react-redux";
// import MetaData from "../../Component/Layout/MetaData";
// import Typography from "@mui/material/Typography";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   CardNumberElement,
//   CardCvcElement,
//   CardExpiryElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./payment.css";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import EventIcon from "@mui/icons-material/Event";
// import VpnKeyIcon from "@mui/icons-material/VpnKey";
// import { createUserBlogPayment, clearErrors } from "../../Slices/OrderSlice";

// // 4000003560000008

// const Payment = () => {
//   const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

//   const dispatch = useDispatch();
//   const stripe = useStripe();
//   const elements = useElements();
//   const payBtn = useRef(null);
//   const navigate = useNavigate();

//   const { shippingInfo, cartItems } = useSelector((state) => state.cart);
//   const { user } = useSelector((state) => state.user);
//   const { error } = useSelector((state) => state.orders);

//   const paymentData = {
//     amount: Math.round(orderInfo?.totalPrice * 100),
//   };

//   const order = {
//     shippingInfo,
//     orderItems: cartItems,
//     itemsPrice: orderInfo?.subtotal,
//     taxPrice: orderInfo?.tax,
//     shippingPrice: orderInfo?.shippingCharges,
//     totalPrice: orderInfo?.totalPrice,
//   };

//   useEffect(() => {
//     if (!orderInfo || !orderInfo.totalPrice) {
//       toast.error("Order information is incomplete. Please check your cart.");
//       navigate("/cart");
//     }
//   }, [orderInfo, navigate]);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     payBtn.current.disabled = true;

//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };

//       const { data } = await axios.post(
//         "/api/v1/payment/process",
//         paymentData,
//         config
//       );

//       const client_secret = data.client_secret;

//       if (!stripe || !elements) return;

//       const result = await stripe.confirmCardPayment(client_secret, {
//         payment_method: {
//           card: elements.getElement(CardNumberElement),
//           billing_details: {
//             name: user.name,
//             email: user.email,
//             address: {
//               line1: shippingInfo.address,
//               city: shippingInfo.city,
//               state: shippingInfo.state,
//               postal_code: shippingInfo.pinCode,
//               country: shippingInfo.country,
//             },
//           },
//         },
//       });

//       if (result.error) {
//         payBtn.current.disabled = false;
//         toast.error(result.error.message);
//       } else {
//         if (result.paymentIntent.status === "succeeded") {
//           order.paymentInfo = {
//             id: result.paymentIntent.id,
//             status: result.paymentIntent.status,
//           };
//           dispatch(createUserBlogPayment(order));
//           navigate("/success");
//         } else {
//           toast.error("There's some issue while processing payment");
//           payBtn.current.disabled = false;
//         }
//       }
//     } catch (error) {
//       payBtn.current.disabled = false;
//       toast.error(error.response.data.message);
//     }
//   };
//   return (
//     <Fragment>
//       <MetaData title="Payment" />
//       <CheckoutSteps activeStep={2} />
//       <div className="paymentContainer">
//         <form className="paymentForm" onSubmit={submitHandler}>
//           <Typography>Card Info</Typography>
//           <div>
//             <CreditCardIcon />
//             <CardNumberElement className="paymentInput" />
//           </div>
//           <div>
//             <EventIcon />
//             <CardExpiryElement className="paymentInput" />
//           </div>
//           <div>
//             <VpnKeyIcon />
//             <CardCvcElement className="paymentInput" />
//           </div>

//           <input
//             type="submit"
//             value={`Pay - ₹${orderInfo ? orderInfo.totalPrice : "0"}`}
//             ref={payBtn}
//             className="paymentFormBtn"
//           />
//         </form>
//       </div>
//     </Fragment>
//   );
// };

// export default Payment;

import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import Typography from "@mui/material/Typography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./payment.css";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { createOrder, clearErrors } from "../../OrderSlice"; // Updated import

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);
  const navigate = useNavigate();

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.orders); // Updated to userBlogPayments

  useEffect(() => {
    if (!orderInfo || !orderInfo.totalPrice) {
      toast.error("Order information is incomplete. Please check your cart.");
      navigate("/cart");
    }

    if (!user || !user.name || !user.email) {
      toast.error("User information is missing. Please log in again.");
      navigate("/login");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [orderInfo, navigate, error, dispatch, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const paymentData = {
        amount: Math.round(orderInfo?.totalPrice * 100), // Convert to smallest currency unit (e.g., cents for USD)
      };

      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) {
        payBtn.current.disabled = false;
        toast.error("Stripe or Elements not loaded.");
        return;
      }

      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        console.error("CardNumberElement not found");
        payBtn.current.disabled = false;
        toast.error("Payment form is not properly set up");
        return;
      }

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const order = {
            shippingInfo,
            orderItems: cartItems, // Include orderItems
            itemsPrice: orderInfo?.subtotal,
            taxPrice: orderInfo?.tax,
            shippingPrice: orderInfo?.shippingCharges,
            totalPrice: orderInfo?.totalPrice,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            },
          };
          dispatch(createOrder(order));
          navigate("/success");
        } else {
          toast.error("There's some issue while processing payment");
          payBtn.current.disabled = false;
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={submitHandler}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo ? orderInfo.totalPrice : "0"}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default Payment;
