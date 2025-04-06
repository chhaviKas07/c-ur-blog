import { FaHeart } from "react-icons/fa";
import React from "react";
import profilePng from "../../assets/profile.png";

const ReviewCard = ({ review }) => {
  const renderHearts = (count) => {
    const hearts = [];
    for (let i = 0; i < count; i++) {
      hearts.push(<FaHeart key={i} style={{ color: "red", marginRight: "2px" }} />);
    }
    return hearts;
  };

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      <p>{review.name}</p>
      <div>{renderHearts(review.like || 0)}</div>
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
