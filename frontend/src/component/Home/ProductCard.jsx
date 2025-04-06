import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  // Check if product.images exists and has at least one image
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "/default-product.jpg";

  const options = {
    value: product.ratings || 0, // Default to 0 if ratings is undefined
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={imageUrl} alt={product.name} />
      <p>{product.name}</p>
      <p className="productPrice">₹{product.price}</p>
      <div>
        <FaStar {...options} />
        <span className="productCardSpan">
          ({product.numOfReviews || 0} Reviews)
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
