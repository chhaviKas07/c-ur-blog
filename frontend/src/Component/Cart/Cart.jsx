import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  addItemsToCartThunk,
  removeItemsFromCartThunk,
} from "../../CartSlice.jsx";
import Typography from "@mui/material/Typography";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const increaseQuantity = (id, currentQty, stock) => {
    const available = stock - currentQty;
    const addQty = Math.min(1, available); // Never exceeds stock
    
    if (addQty > 0) {
      dispatch(addItemsToCartThunk({ id, quantity: addQty }));
    } else {
      toast.error("Maximum available quantity reached");
    }
  };

  // const decreaseQuantity = (id, currentQty) => {
  //   const removeQty = Math.min(1, currentQty); // Never goes below 0
  //   dispatch(addItemsToCartThunk({ id, quantity: -removeQty }));
  // };

  const decreaseQuantity = (id, currentQty) => {
    if (currentQty <= 1) return;
    dispatch(removeItemsFromCartThunk({ id, quantity: 1 })); // Always decrement by 1
};

  const deleteCartItems = (id) => {
    if (!id) return;
    dispatch(removeItemsFromCartThunk(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>No Products in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Price</p>
            </div>

            {cartItems.map((item) => {
              const itemId = item.product || item._id || item.id;
              return (
                <div className="cartContainer" key={itemId}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="cartInput">
                  <button
                      onClick={() => decreaseQuantity(itemId, item.quantity)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    
                    <button
    onClick={() => increaseQuantity(itemId, item.quantity, item.stock)}
    disabled={item.quantity >= item.stock}
  >
    +
  </button>
                  </div>
                  <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              );
            })}

            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{`₹${totalAmount.toFixed(2)}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
