import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  createProduct,
  getProducts,
  newProductReset,
} from "../../productSlice";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import SideBar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorageIcon from "@mui/icons-material/Storage";
import axios from 'axios';

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.products);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Home Decor",
    "Fashion and Accessories",
    "Stationery",
    "Personal Care",
    "Household Essentials",
    "Beauty",
  ];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Product Created Successfully");
      dispatch(newProductReset());
      dispatch(getProducts());
      navigate("/admin/products");
    }
  }, [dispatch, error, navigate, success]);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload"); // replace with actual Cloudinary preset
    formData.append("cloud_name", "dkusbu9rg"); // your Cloudinary cloud name
    
    try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dkusbu9rg/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    return {
      public_id: data.public_id,
      url: data.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
  

  // const createProductSubmitHandler = (e) => {
  //   e.preventDefault();
  
  //   const formData = new FormData();
  //   formData.set("name", name);
  //   formData.set("price", price);
  //   formData.set("description", description);
  //   formData.set("category", category);
  //   formData.set("stock", Stock);
  
  //   images.forEach((image) => {
  //     formData.append("images", image); // send raw file directly
  //   });
  
  //   dispatch(createProduct(formData));
  // };
  const createProductSubmitHandler = async (e) => {
    e.preventDefault();
  
    const uploadedImages = [];
  
    for (const image of images) {
      const cloudinaryData = await uploadImageToCloudinary(image);
      if (cloudinaryData && cloudinaryData.public_id && cloudinaryData.url) {
        uploadedImages.push(cloudinaryData);
      } else {
        toast.error("Image upload failed. Please try again.");
        return; // stop submitting if any upload fails
      }
    }
  
    const formData = {
      name,
      price,
      description,
      category,
      stock: Stock,
      images: uploadedImages,
    };
  
    console.log("📦 Final Product Payload:", formData); // optional for debugging
  
    dispatch(createProduct(formData));
  };
  
  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
  
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    setImages(files); // Store files for Cloudinary upload
  };
    

  // const createProductImagesChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setImages([]);
  //   setImagesPreview([]);
  
  //   files.forEach((file) => {
  //     const reader = new FileReader();
  
  //     reader.onload = () => {
  //       if (reader.readyState === 2) {
  //         setImagesPreview((old) => [...old, reader.result]);
  //         setImages((old) => [...old, file]);
  //       }
  //     };
  
  //     reader.readAsDataURL(file);
  //   });
  // };
  

  return (
    <Fragment>
      <ToastContainer />
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <DescriptionIcon />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
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

            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                value={Stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={createProductImagesChange}
              />
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((img, i) => (
                <img key={i} src={img} alt="Product Preview" />
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

export default NewProduct;
