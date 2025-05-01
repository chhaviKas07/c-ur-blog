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

    dispatch(getProducts({ keyword, currentPage, price, category, ratings }))
      .unwrap()
      .then((data) => {
        console.log("Fetched Products:", data);
      })
      .catch((err) => console.error("Error Fetching Products:", err));
  }, [dispatch, keyword, currentPage, price, category, ratings, error]);

  return (
    <Fragment>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>

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

                <fieldset>
                  <Typography component="legend">Price Range</Typography>
                  <Slider
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100000}
                  />
                </fieldset>

                <fieldset>
                  <Typography component="legend">Ratings Above</Typography>
                  <Slider
                    value={ratings}
                    onChange={(e, newRatings) => setRatings(newRatings)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
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
