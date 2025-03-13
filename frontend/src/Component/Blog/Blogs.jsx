import React, { Fragment, useEffect, useState } from "react";
import "./Blogs.css";
import { useSelector, useDispatch } from "react-redux";
import { clearBlogErrors, getBlogs } from "../../Slices/ProductSlice";
import Loader from "../Layout/Loader/Loader";
import MetaData from "../Layout/MetaData";
import BlogCard from "../Home/BlogCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

const categories = [
  "Health",
  "Product Review",
  "Life",
  "Travel",
  "Hobby",
  "Camera",
  "SmartPhones",
];

const Blogs = () => {
  const { keyword } = useParams(); // Access keyword from URL params
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [likes, setLikes] = useState(0);

  const {
    blogs,
    loading,
    error,
    blogsCount,
    resultPerPage,
    filteredBlogsCount,
  } = useSelector((state) => state.blogs);

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBlogErrors());
    }

    dispatch(getBlogs({ keyword, currentPage, category, likes }));
  }, [dispatch, keyword, currentPage, category, likes, error]);

  return (
    <Fragment>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="BLOGS -- ECOMMERCE" />
          <h2 className="productsHeading">Blogs</h2>

          <div className="products">
            {blogs &&
              blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
          <div>
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Likes Above</Typography>
              <Slider
                value={likes}
                onChange={(e, newLike) => {
                  setLikes(newLike);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>
          {resultPerPage < filteredBlogsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={filteredBlogsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Blogs;
