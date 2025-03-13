import { FaHeart } from "react-icons/fa";
import React from "react";
import profilePng from "../../assets/Profile.png";

const ReviewCard = ({ review }) => {
  const options = {
    value: review.like,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      <p>{review.name}</p>
      <FaHeart {...options} />
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
