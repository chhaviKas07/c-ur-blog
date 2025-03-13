import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";

const CartItemCard = ({ item, deleteCartItems }) => {
  return (
    <div className="CartItemCard">
      <img src={item.image} alt="ssa" />
      <div>
        <Link to={`/blog/${item.blog}`}>{item.title}</Link>
        <span>{`Description: ${item.description}`}</span>
        <p onClick={() => deleteCartItems(item.blog)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
