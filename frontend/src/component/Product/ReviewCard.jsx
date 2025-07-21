// import React from "react";
// import { FaHeart, FaStar } from "react-icons/fa";
// import profilePng from "../../assets/profile.png";
// import "./reviewCard.css";

// const ReviewCard = ({ review }) => {
//   const renderHearts = (count) => {
//     const hearts = [];
//     for (let i = 0; i < count; i++) {
//       hearts.push(<FaHeart key={i} style={{ color: "red", marginRight: "2px" }} />);
//     }
//     return hearts;
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 0; i < Math.floor(rating); i++) {
//       stars.push(<FaStar key={i} style={{ color: "gold", marginRight: "2px" }} />);
//     }
//     return stars;
//   };

//   return (
//     <div className="reviewCard">
//       <img
//         src={review?.user?.avatar?.url || profilePng}
//         alt={review.name}
//         className="reviewCardAvatar"
//       />
//       <p>{review.name}</p>
//       <div className="reviewStars">
//         {renderStars(review.rating || 0)}
//       </div>
//       <div className="reviewHearts">
//         {renderHearts(review.like || 0)}
//       </div>
//       <span className="reviewCardComment">{review.comment}</span>
//     </div>
//   );
// };

// export default ReviewCard;


// import React from "react";
// import { FaHeart, FaStar } from "react-icons/fa";
// import profilePng from "../../assets/profile.png";
// import { useSelector } from "react-redux";
// import "./reviewCard.css";

// const ReviewCard = ({ review }) => {
//   const { user } = useSelector((state) => state.user);

//   const renderHearts = (count) => {
//     const hearts = [];
//     for (let i = 0; i < count; i++) {
//       hearts.push(
//         <FaHeart key={i} style={{ color: "red", marginRight: "2px" }} />
//       );
//     }
//     return hearts;
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 0; i < Math.floor(rating); i++) {
//       stars.push(
//         <FaStar key={i} style={{ color: "gold", marginRight: "2px" }} />
//       );
//     }
//     return stars;
//   };

//   return (
//     <div className="reviewCard">
//       {/* <img
//         src={user?._id === review?.user ? user.avatar?.url : profilePng}
//         alt={review.name}
//         className="reviewCardAvatar"
//       /> */}
//    <img
//   src={review.user?.avatar?.url || profilePng}
//   alt={review.user?.name || "User"}
//   className="reviewCardAvatar"
// />
//       <p>{review.name}</p>
//       <div className="reviewStars">{renderStars(review.rating || 0)}</div>
//       <div className="reviewHearts">{renderHearts(review.like || 0)}</div>
//       <span className="reviewCardComment">{review.comment}</span>
//     </div>
//   );
// };

// export default ReviewCard;

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
  // Extract avatar URL
  // const avatarUrl = user.avatar?.url;

  // Fallback function if image fails
  const handleImageError = (e) => {
      e.target.onerror = null; // Prevent looping
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
