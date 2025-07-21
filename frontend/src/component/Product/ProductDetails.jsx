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
import { NEW_REVIEW_RESET, getReviews } from "../../productSlice.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../Home/ProductCard.jsx"; // Adjust path as per your project structure

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // ✅ Use useParams instead of match
  const { reviews } = useSelector((state) => state.products);


  const { product, loading, error } = useSelector((state) => state.products);
  const { success, error: reviewError } = useSelector((state) => state.products);
  const [isStockLimitReached, setIsStockLimitReached] = useState(false);
  const { user } = useSelector((state) => state.user);


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



  const [ecoRecommendations, setEcoRecommendations] = useState([]);

  useEffect(() => {
    // This is your existing fetch product call
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  // ✅ Add this just below the above useEffect
  useEffect(() => {
    if (product && product._id) {
      axios
        .get(`/api/v1/product/${product._id}/recommendations`)
        .then((res) => setEcoRecommendations(res.data.recommendations))
        .catch((err) => console.error("Eco Rec Error:", err));
    }
  }, [product]);


  // const increaseQuantity = () => {
  //   if (product.Stock <= quantity) return;
  //   setQuantity(quantity + 1);
  // };
  // const increaseQuantity = () => {
  //   console.log("🟢 Trying to increase quantity");
  //   console.log("Current quantity:", quantity);
  //   console.log("Available stock:", product?.stock);

  //   if (product?.stock <= quantity) {
  //     console.warn("❌ Can't increase, stock limit reached");
  //     return;
  //   }
  //   setQuantity(quantity + 1);
  // };
  //   const increaseQuantity = () => {
  //   console.log("🟢 Trying to increase quantity");
  //   console.log("Current quantity:", quantity);
  //   console.log("Available stock:", product?.stock);

  //   if (product?.stock <= quantity) {
  //     console.warn("❌ Stock limit reached");
  //     setIsStockLimitReached(true);
  //     return;
  //   }

  //   setQuantity(quantity + 1);
  //   setIsStockLimitReached(false); // Reset if user reduces and re-increases
  // };
  const increaseQuantity = () => {
    if (quantity >= product?.stock) {
      setIsStockLimitReached(true);

      // Optional: Auto-hide after 3s
      setTimeout(() => setIsStockLimitReached(false), 3000);
      return;
    }

    setQuantity(prev => prev + 1);
    setIsStockLimitReached(false);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setIsStockLimitReached(false); // Allow increase again
    }
  };
  const addToCartHandler = () => {
    console.log("Product ID:", product._id); // Debugging
    dispatch(addItemsToCartThunk({ id: product._id, quantity }));
  };

  // const submitReviewToggle = () => setOpen(!open);

const submitReviewToggle = () => {
  if (!open) {
    // Modal is about to open, check for user's previous review
    const existingReview = product?.reviews?.find(
      (r) => r.user === user._id
    );

    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(0);
      setComment("");
    }
  }

  setOpen(!open); // Toggle modal
};
  // const reviewSubmitHandler = () => {
  //   const myForm = new FormData();
  //   myForm.set("rating", rating);
  //   myForm.set("comment", comment);
  //   myForm.set("productId", id);

  //   dispatch(createReview(myForm));
  //   setOpen(false);
  // };

  // const reviewSubmitHandler = () => {
  //   const reviewData = {
  //     rating,
  //     comment,
  //     productId: id,
  //   };

  //   dispatch(createReview(reviewData));
  //   console.log("📦 Reviews received:", reviews);
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

  // Reset form fields
  setRating(0);
  setComment("");
};
if (success) {
  toast.success("Review Submitted Successfully");
  dispatch({ type: NEW_REVIEW_RESET });
  dispatch(getProductDetails(id)); // reloads the latest reviews
}


  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //     dispatch(clearErrors());
  //   }
  //   if (reviewError) {
  //     toast.error(reviewError);
  //     dispatch(clearErrors());
  //   }
  //   if (success) {
  //     toast.success("Review Submitted Successfully");
  //     dispatch({ type: NEW_REVIEW_RESET }); // Ensure it's defined
  //   }
  //   dispatch(getProductDetails(id));
  // }, [dispatch, id, error, reviewError, success]);

  useEffect(() => {
    if (error) {
      console.log("🔥 Error:", error); // ✅ Confirm this logs
      toast.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      console.log("🔥 Review Error:", reviewError); // ✅ Confirm this logs
      toast.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      console.log("🎉 Success triggered");
      toast.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, error, reviewError, success]);

useEffect(() => {
  dispatch(getReviews(id)).then((res) => {
    console.log("Fetched reviews:", res); // 🔍 Check if avatar is there
  });
}, []);

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
                    {/* <button onClick={increaseQuantity}>+</button> */}
                    <button
                      onClick={increaseQuantity}
                      style={{
                        opacity: quantity >= product?.stock ? 0.5 : 1,
                        pointerEvents: quantity >= product?.stock ? 'none' : 'auto'
                      }}
                    >
                      +
                    </button>

                    {isStockLimitReached && (
                      <p style={{ color: "red", background: "white", fontWeight: "bold", padding: "4px" }}>
                        ⚠️ Quantity limit reached for this product.
                      </p>
                    )}
                  </div>
                  <button disabled={product?.stock < 1} onClick={addToCartHandler}>
                    Add to Cart
                  </button>
                </div>
                <p>
                  Status:
                  <b
                    className={product?.stock < 1 ? "redColor" : "greenColor"}
                  >
                    {product?.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>

              </div>

              <div className="detailsBlock-4">
                Description: <p>{product?.description}</p>
              </div>
              <span style={{ color: product.ecoScore >= 70 ? 'green' : product.ecoScore >= 40 ? 'orange' : 'red' }}>
                ♻️ Eco Score: {product.ecoScore}/100
              </span>
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

          {/* {product?.reviews?.length > 0 ? (
            <div className="reviews">
              {product.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )} */}
          {reviews?.length > 0 ? (
  <div className="reviews">
    {reviews.map((review) => (
      <ReviewCard key={review._id} review={review} />
    ))}
  </div>
) : (
  <p className="noReviews">No Reviews Yet</p>
)}

          {ecoRecommendations.length > 0 && (
  <div className="eco-recommendations">
    <h3>♻️ Greener Alternatives You Might Like</h3>
    <div className="recommendation-list" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {ecoRecommendations.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  </div>
)}



        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
