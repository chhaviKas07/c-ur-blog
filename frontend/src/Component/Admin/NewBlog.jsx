import React, { Fragment, useEffect, useState } from "react";
import "./newBlog.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearAdminErrors,
  createBlog,
  newBlogReset,
} from "../../Slices/ProductSlice";
import MetaData from "../Layout/MetaData";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import SideBar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const NewBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.blogs);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author_name, setAuthor_name] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Health",
    "Product Review",
    "Life",
    "Travel",
    "Hobby",
    "Camera",
    "SmartPhones",
  ];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminErrors());
    }

    if (success) {
      toast.success("Blog Created Successfully");
      dispatch(newBlogReset());
      navigate("/blogs"); // Navigate to the blog list page
    }
  }, [dispatch, error, navigate, success]);

  const createBlogSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("title", title);
    myForm.set("description", description);
    myForm.set("author_name", author_name);
    myForm.set("category", category);

    images.forEach((file) => {
      myForm.append("images", file);
    });

    dispatch(createBlog(myForm));
  };

  const createBlogImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <ToastContainer />
      <MetaData title="Create Blog" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createBlogSubmitHandler}
          >
            <h1>Create Blog</h1>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Blog Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <DescriptionIcon />
              <textarea
                placeholder="Blog Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Author Name"
                required
                value={author_name}
                onChange={(e) => setAuthor_name(e.target.value)}
              />
            </div>

            <div>
              <AccountTreeIcon />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="images"
                accept="image/*"
                onChange={createBlogImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Blog Image Preview" />
              ))}
            </div>

            <Button id="createProductBtn" type="submit" disabled={loading}>
              Create
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewBlog;
