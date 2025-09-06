import React from "react";
import profilePng from "../../assets/profile.png";
import { Rating } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useState } from "react";

const ReviewCard = ({ review }) => {
  const user = review.user || {};
  const userName = user.name || review.name || "Anonymous";
  const [imgError, setImgError] = useState(false);
  const avatarUrl = !imgError && user?.avatar?.url ? user.avatar.url : profilePng;
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = profilePng;
  };
  return (
    <div className="reviewCard">
      <img
        src={avatarUrl}
        alt={userName}
        onError={() => setImgError(true)}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <p>{userName}</p>
      <Rating value={review.rating} readOnly precision={0.5} />
      <span>{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
