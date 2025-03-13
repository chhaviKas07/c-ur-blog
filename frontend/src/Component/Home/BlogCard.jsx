import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const BlogCard = ({ blog }) => {
  // Check if blog.images exists and has at least one image
  const imageUrl =
    blog.images && blog.images.length > 0
      ? blog.images[0].url
      : "/default-image.jpg";

  const options = {
    value: blog.ratings || 0, // Default to 0 if ratings is undefined
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Link className="blogCard" to={`/blog/${blog._id}`}>
      <img src={imageUrl} alt={blog.title} />
      <p>{blog.title}</p>
      <p>{blog.description}</p>
      <p>{blog.author_name}</p>
      <div>
        <FaHeart {...options} />
        <span className="blogCardSpan">
          ({blog.numOfReviews || 0} Comments)
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;
