// import React, { Fragment, useEffect, useState } from "react";
// import "./Products.css";
// import { useSelector, useDispatch } from "react-redux";
// import Loader from "../layout/Loader/Loader.jsx";
// import MetaData from "../layout/MetaData.jsx";
// import ProductCard from "../Home/ProductCard";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useParams } from "react-router-dom";
// import Typography from "@mui/material/Typography";
// import Slider from "@mui/material/Slider";
// import { getProducts, clearErrors } from "../../productSlice.jsx";
// import { Pagination } from "@mui/material";
// import Search from "./Search.jsx";

// const categories = [
//   "Home Decor",
//   "Fashion and Accessories",
//   "Stationery",
//   "Personal Care",
//   "Household Essentials",
//   "Beauty",
// ];

// const Products = () => {
//   const { keyword } = useParams();
//   const dispatch = useDispatch();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [price, setPrice] = useState([0, 25000]);
//   const [category, setCategory] = useState("");
//   const [ratings, setRatings] = useState(0);
// const [ecoScore, setEcoScore] = useState(0);

//   const {
//     products,
//     loading,
//     error,
//     productsCount,
//     resultPerPage,
//     filteredProductsCount,
//   } = useSelector((state) => state.products);

//   const priceHandler = (event, newPrice) => {
//     setPrice(newPrice);
//   };

//   const handlePageChange = (e, value) => {
//     setCurrentPage(value);
//   };

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearErrors());
//     }

//     dispatch(getProducts({ keyword, currentPage, price, category, ratings }))
//       .unwrap()
//       .then((data) => {
//         console.log("Fetched Products:", data);
//       })
//       .catch((err) => console.error("Error Fetching Products:", err));
//   }, [dispatch, keyword, currentPage, price, category, ratings, error]);

//   return (
//     <Fragment>
//       <ToastContainer />
//       {loading ? (
//         <Loader />
//       ) : (
//         <Fragment>
//           <MetaData title="PRODUCTS -- ECOMMERCE" />
//           <h2 className="productsHeading">Products</h2>
//           <div className="productSearchBox">
// <Search/>
//           </div>
//           <div className="productsPage">
//             <div className="contentWrapper">
//               {/* Sidebar */}
//               <aside className="sidebar">
//                 <Typography className="filterHeading">Categories</Typography>
//                 <ul className="categoryBox">
//                   {categories.map((categoryItem) => (
//                     <li
//                       key={categoryItem}
//                       className={`category-link ${category === categoryItem ? "active" : ""}`}
//                       onClick={() => {
//                         setCategory(categoryItem);
//                         setCurrentPage(1);
//                       }}
//                     >
//                       {categoryItem}
//                     </li>
//                   ))}
//                 </ul>
//                 <fieldset className="priceRangeBox">
//                   <legend>Price Range</legend>
//                   <div className="priceLabels">
//                     <span>₹{price[0]}</span>
//                     <span>₹{price[1]}</span>
//                   </div>
//                   <Slider
//                     value={price}
//                     onChange={priceHandler}
//                     valueLabelDisplay="auto"
//                     min={0}
//                     max={10000}
//                     step={100}
//                   />
//                 </fieldset>
// <fieldset className="ecoScoreBox">
//   <legend>Eco Score</legend>
//   <div className="ecoScoreLabels">
//     <span>{ecoScore}</span>
//     <span>/ 100</span>
//   </div>
//   <Slider
//     value={ecoScore}
//     onChange={(e, newValue) => setEcoScore(newValue)}
//     valueLabelDisplay="auto"
//     min={0}
//     max={100}
//     step={1}
//   />
// </fieldset>

//                 <fieldset className="ratingBox">
//                   <legend>Ratings Above</legend>
//                   <div className="ratingLabel">
//                     <span>{ratings} ★ & above</span>
//                   </div>
//                   <Slider
//                     value={ratings}
//                     onChange={(e, newRating) => {
//                       setRatings(newRating);
//                       setCurrentPage(1); // important to reset to page 1
//                     }}
//                     valueLabelDisplay="auto"
//                     min={0}
//                     max={5}
//                     step={0.5}
//                   />
//                 </fieldset>

//               </aside>

//               {/* Product Grid */}
//               <section className="productGrid">
//                 {products.length === 0 ? (
//                   <h3 className="noProducts">No products found</h3>
//                 ) : (
//                   <div className="productList">
//                     {products.map((product) => (
//                       <ProductCard key={product._id} product={product} />
//                     ))}
//                   </div>
//                 )}

//                 {filteredProductsCount > resultPerPage && (
//                   <div className="paginationBox">
//                     <Pagination
//                       count={Math.ceil(filteredProductsCount / resultPerPage)}
//                       page={currentPage}
//                       onChange={(e, value) => handlePageChange(e, value)}
//                       color="primary"
//                       shape="rounded"
//                       size="large"
//                     />
//                   </div>
//                 )}
//               </section>
//             </div>
//           </div>
//         </Fragment>
//       )}
//     </Fragment>
//   );
// };

// export default Products;

import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import MetaData from "../layout/MetaData.jsx";
import ProductCard from "../Home/ProductCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { getProducts, clearErrors } from "../../productSlice.jsx";
import { Pagination } from "@mui/material";
import Search from "./Search.jsx";

const categories = [
  "Home Decor",
  "Fashion and Accessories",
  "Stationery",
  "Personal Care",
  "Household Essentials",
  "Beauty",
];

const Products = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  // const [ecoScore, setEcoScore] = useState(0);
  const [ecoScore, setEcoScore] = useState(null);

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    const filters = {
      keyword,
      currentPage,
      price,
      category,
      ratings,
    };

    // ✅ Only apply ecoScore if user sets it above 0
    if (ecoScore > 0) {
      filters.ecoScore = { gte: ecoScore };
    }

    // dispatch(getProducts(filters))



    
    dispatch(getProducts({
      keyword,
      currentPage,
      price,
      category,
      ratings,
      ecoScore: ecoScore > 0 ? ecoScore : null, // 💡 send number only
    })).unwrap()
      .then((data) => {
        console.log("Fetched Products:", data);
      })
      .catch((err) => console.error("Error Fetching Products:", err));
  }, [dispatch, keyword, currentPage, price, category, ratings, ecoScore, error]);

  return (
    <Fragment>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>
          <div className="productSearchBox">
            <Search />
          </div>
          <div className="productsPage">
            <div className="contentWrapper">
              {/* Sidebar */}
              <aside className="sidebar">
                <Typography className="filterHeading">Categories</Typography>
                <ul className="categoryBox">
                  {categories.map((categoryItem) => (
                    <li
                      key={categoryItem}
                      className={`category-link ${category === categoryItem ? "active" : ""}`}
                      onClick={() => {
                        setCategory(categoryItem);
                        setCurrentPage(1);
                      }}
                    >
                      {categoryItem}
                    </li>
                  ))}
                </ul>

                {/* Price Range */}
                <fieldset className="priceRangeBox">
                  <legend>Price Range</legend>
                  <div className="priceLabels">
                    <span>₹{price[0]}</span>
                    <span>₹{price[1]}</span>
                  </div>
                  <Slider
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10000}
                    step={100}
                  />
                </fieldset>

                {/* Eco Score */}
                <fieldset className="ecoScoreBox">
                  <legend>Eco Score</legend>
                  <div className="ecoScoreLabels">
                    <span>{ecoScore}</span>
                    <span>/ 100</span>
                  </div>
                  <Slider
                    value={ecoScore}
                    onChange={(e, newValue) => {
                      setEcoScore(newValue);
                      setCurrentPage(1);
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    step={1}
                  />

                  {/* Reset Button */}
                  {ecoScore > 0 && (
                    <button
                      onClick={() => setEcoScore(0)}
                      className="resetEcoScore"
                    >
                      Reset Eco Score
                    </button>
                  )}
                </fieldset>
                {/* Ratings */}
                <fieldset className="ratingBox">
                  <legend>Ratings Above</legend>
                  <div className="ratingLabel">
                    <span>{ratings} ★ & above</span>
                  </div>
                  <Slider
                    value={ratings}
                    onChange={(e, newRating) => {
                      setRatings(newRating);
                      setCurrentPage(1);
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                    step={0.5}
                  />
                </fieldset>
              </aside>

              {/* Product Grid */}
              <section className="productGrid">
                {products.length === 0 ? (
                  <h3 className="noProducts">No products found</h3>
                ) : (
                  <div className="productList">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}

                {filteredProductsCount > resultPerPage && (
                  <div className="paginationBox">
                    <Pagination
                      count={Math.ceil(filteredProductsCount / resultPerPage)}
                      page={currentPage}
                      onChange={(e, value) => handlePageChange(e, value)}
                      color="primary"
                      shape="rounded"
                      size="large"
                    />
                  </div>
                )}
              </section>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
