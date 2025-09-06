import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";


const CartItemCard = ({ item, deleteCartItems }) => {
  // console.log("🛒 CartItemCard Item:", item); // Debug log

  return (
    <div className="CartItemCard">
      <img src={item.image} alt="Product" />
      <div>
        <Link to={`/products/${item.product || item._id || item.id}`}>{item.name}</Link>
        {/* <span>{`Description: ${item.description}`}</span> */}
        
        {/* Remove Button */}
        <p 
          onClick={() => {
            const itemId = item.product || item._id || item.id;
            // console.log("🗑 Removing item with ID:", itemId); // Debug log
            if (!itemId) {
              console.error("❌ No valid product ID found in CartItemCard.");
              return;
            }
            deleteCartItems(itemId);
          }}
          style={{ cursor: "pointer", color: "red", fontWeight: "bold" }}
        >
          ❌ Remove
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;
