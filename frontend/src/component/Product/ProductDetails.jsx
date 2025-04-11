import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ProductDetails.css";
import {
  clearErrors,
  getProductDetails,
  createReview,
} from "../../productSlice.jsx";
import ReviewCard from "./ReviewCard.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import MetaData from "../layout/MetaData.jsx";
import Carousel from "react-material-ui-carousel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Rating from "@mui/material/Rating"; // ✅ Import Rating
import { FaHeart } from "react-icons/fa"; 
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import { addItemsToCartThunk } from "../../CartSlice.jsx"; // Adjust path if needed
import { NEW_REVIEW_RESET } from "../../productSlice.jsx";
 

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // ✅ Use useParams instead of match

  const { product, loading, error } = useSelector((state) => state.products);
  const { success, error: reviewError } = useSelector((state) => state.products);

  const options = {
    size: "large",
    value: product?.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addToCartHandler = () => {
    console.log("Product ID:", product._id); // Debugging
    dispatch(addItemsToCartThunk({ id: product._id, quantity }));
  };

  const submitReviewToggle = () => setOpen(!open);

  // const reviewSubmitHandler = () => {
  //   const myForm = new FormData();
  //   myForm.set("rating", rating);
  //   myForm.set("comment", comment);
  //   myForm.set("productId", id);
  
  //   dispatch(createReview(myForm));
  //   setOpen(false);
  // };
  
  const reviewSubmitHandler = () => {
    const reviewData = {
      rating,
      comment,
      productId: id,
    };
  
    dispatch(createReview(reviewData));
    setOpen(false);
  };
  
  
  

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET }); // Ensure it's defined
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, reviewError, success]);
  

  return (
    <Fragment>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product?.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
            <Carousel className="carousel">
  {product?.images?.map((item, i) => (
    <img
      className="CarouselImage"
      key={i}
      src={item.url}
      alt={`Slide ${i}`}
    />
  ))}
</Carousel>

            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product?.name}</h2>
                <p>Product # {product?._id}</p>
              </div>
              <div className="detailsBlock-2">
                {/* <Rating {...options} /> */}
                <Rating value={Number(product?.ratings) || 0} readOnly precision={0.5} size="large" />
                <span className="detailsBlock-2-span">
                  ({product?.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product?.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button disabled={product?.Stock < 1} onClick={addToCartHandler}>
                    Add to Cart
                  </button>
                </div>
                <p>
                  Status:
                  <b className={product?.Stock < 1 ? "redColor" : "greenColor"}>
                    {product?.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description: <p>{product?.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={submitReviewToggle}>
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              {/* <Rating onChange={(e) => setRating(e.target.value)} value={rating} size="large" /> */}
              <Rating onChange={(e) => setRating(Number(e.target.value))} value={rating} size="large" />
              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
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

          {product?.reviews?.length > 0 ? (
            <div className="reviews">
              {product.reviews.map((review) => (
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

export default ProductDetails;
