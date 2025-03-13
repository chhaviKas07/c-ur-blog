import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import "./Search.css";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/blogs/${keyword}`); // Navigate to /blogs/:keyword
    } else {
      navigate("/blogs"); // Navigate to /blogs (default)
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- C_UR_BLOG" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
