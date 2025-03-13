import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearBlogErrors,
  updateBlog,
  getBlogDetails,
  updateBlogReset,
} from "../../Slices/ProductSlice";
import MetaData from "../Layout/MetaData";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import SideBar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

const UpdateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { blog, error, loading, updateError, isUpdated } = useSelector(
    (state) => state.blogDetails
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author_name, setAuthor_name] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
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
    console.log("useEffect triggered"); // Debug log
    if (!blog || blog._id !== id) {
      console.log("Fetching blog details"); // Debug log
      dispatch(getBlogDetails(id));
    } else {
      console.log("Setting blog details"); // Debug log
      setTitle(blog.title || "");
      setDescription(blog.description || "");
      setAuthor_name(blog.author_name || "");
      setCategory(blog.category || "");
      setOldImages(blog.images || []);
    }

    if (error) {
      toast.error(error);
      dispatch(clearBlogErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearBlogErrors());
    }

    if (isUpdated) {
      toast.success("Blog Updated Successfully");
      navigate("/admin/blogs");
      dispatch(updateBlogReset());
    }
  }, [dispatch, id, blog, error, updateError, isUpdated, navigate]);

  const updateBlogSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("title", title);
    myForm.set("description", description);
    myForm.set("author_name", author_name);
    myForm.set("category", category);

    images.forEach((image) => {
      myForm.append("images", image);
    });
    dispatch(updateBlog({ id, blogData: myForm }));
  };

  const updateBlogImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <ToastContainer />
      <MetaData title="Update Blog" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateBlogSubmitHandler}
          >
            <h1>Update Blog</h1>

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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
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
                name="avatar"
                accept="image/*"
                onChange={updateBlogImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Blog Preview" />
                ))}
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Blog Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateBlog;
