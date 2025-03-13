import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import BlogCard from "./BlogCard.jsx";
import MetaData from "../Layout/MetaData.jsx";
import { getBlogs, clearBlogErrors } from "../../Slices/ProductSlice.jsx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader/Loader.jsx";
import ReactJsAlert from "reactjs-alert";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, blogs } = useSelector((state) => state.blogs);

  useEffect(() => {
    if (error) {
      dispatch(clearBlogErrors());
    }
    dispatch(getBlogs());
  }, [dispatch, error]);

  const handleRefresh = () => {
    dispatch(getBlogs());
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="C_UR_BLOG" />

          <div className="banner">
            <p>Welcome to C_UR_BLOG</p>
            <h1>FIND AMAZING BLOGS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Blogs</h2>
          <button onClick={handleRefresh}>Refresh Blogs</button>
          <div className="container" id="container">
            <div className="container" id="container">
              {blogs &&
                blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
