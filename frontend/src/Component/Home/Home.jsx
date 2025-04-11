import React, { Fragment, useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard.jsx";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, getProducts } from "../../productSlice.jsx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
// import { useAlert } from "react-alert";

const Home = () => {
  // const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  useEffect(() => {
    if (error) {
      console.error("Error fetching products:", error);
      dispatch(clearErrors());
    }
    dispatch(getProducts({}));
  }, [dispatch, error]);
  
  // console.log("Products from Redux:", products);
  // const handleRefresh = () => {
  //   window.location.reload(); // Example functionality
  // };
  
  
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="C_UR_PRODUCT" />

          <div className="banner">
            <p>Welcome to Eco-Friendly Marketplace</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

          </div>

          <h2 className="homeHeading">Featured Products</h2>
          {/* <button onClick={handleRefresh}>Refresh Products</button> */}
          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
