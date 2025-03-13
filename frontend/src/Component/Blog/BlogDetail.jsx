import React, { Fragment, useEffect, useState } from "react";
import "./BlogDetail.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getBlogDetails,
  clearBlogDetailErrors,
  newReview,
  resetNewReview,
  clearReviewErrors,
} from "../../Slices/ProductSlice.jsx";
import Loader from "../Layout/Loader/Loader.jsx";
import MetaData from "../Layout/MetaData.jsx";
import Carousel from "react-material-ui-carousel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { FaHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import { addItemsToCart } from "../../Slices/CartSlice.jsx";

const BlogDetail = ({ blog: blogProp }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, blog } = useSelector((state) => state.blogDetails);
  const { success, error: reviewError } = useSelector(
    (state) => state.userReviews
  );

  const options = {
    value: blog.likes,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity, setQuantity] = useState(0);
  const [open, setOpen] = useState(false);
  const [like, setLike] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    setQuantity((prevQty) => prevQty + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQty) => Math.max(prevQty - 1, 0)); // Prevent negative quantity
  };

  const addToCartHandler = (id, quantity) => {
    const price = 100; // Set price to 100 for each blog
    toast.success("Item Added To Cart");
    dispatch(addItemsToCart({ id, quantity, price }));
  };

  const submitReviewToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const reviewSubmitHandler = async () => {
    try {
      const myForm = new FormData();
      myForm.set("like", like);
      myForm.set("comment", comment);
      myForm.set("blogId", id);

      await dispatch(newReview(myForm)).unwrap();
      setOpen(false); // Close the dialog on successful submission
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBlogDetailErrors());
    }

    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearReviewErrors());
    }

    if (success) {
      toast.success("Review Submitted Successfully");
      dispatch(resetNewReview());
      dispatch(getBlogDetails(id)); // Refetch blog details to include new review
    } else {
      dispatch(getBlogDetails(id)); // Fetch blog details initially
    }
  }, [dispatch, id, error, reviewError, success]);

  return (
    <Fragment>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${blog?.title || "Blog Detail"} -- C_UR_BLOG`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {blog?.images &&
                  blog?.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{blog?.title}</h2>
                <p>Blog # {blog?._id}</p>
              </div>
              <div className="detailsBlock-2">
                <FaHeart {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({blog?.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button onClick={() => addToCartHandler(blog._id, quantity)}>
                    Add to Cart
                  </button>
                </div>
                <div className="detailsBlock-3-2">
                  <span>Price: ₹100</span>
                </div>
              </div>
              <div className="detailsBlock-4">
                Description : <p>{blog?.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <FaHeart onChange={(e) => setLike(e.target.value)} value={like} />
              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {blog.reviews && blog.reviews.length > 0 ? (
            <div className="reviews">
              {blog.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default BlogDetail;
