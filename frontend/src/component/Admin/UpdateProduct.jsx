import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
  UPDATE_PRODUCT_RESET
} from "../../productSlice";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import SideBar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorageIcon from "@mui/icons-material/Storage";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ScaleIcon from "@mui/icons-material/Scale";
// import EcoIcon from "@mui/icons-material/Eco";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { error, product } = useSelector((state) => state.products);

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.products);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

const [isEcoCertified, setIsEcoCertified] = useState(false);
const [materialType, setMaterialType] = useState("");
const [weightInGrams, setWeightInGrams] = useState(0);
const [shippingDistanceKm, setShippingDistanceKm] = useState(0);

const materialTypes = ["plastic", "paper", "glass", "metal", "bamboo"];


  const categories = [
    "Home Decor",
    "Fashion and Accessories",
    "Stationery",
    "Personal Care",
    "Household Essentials",
    "Beauty",
  ];


  useEffect(() => {
    if (product && product._id !== id) {
      dispatch(getProductDetails(id));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      setOldImages(product.images);
      setIsEcoCertified(product.isEcoCertified || false);
setMaterialType(product.materialType || "");
setWeightInGrams(product.weightInGrams || 0);
setShippingDistanceKm(product.shippingDistanceKm || 0);

    }
//     if (product && product._id === id) {
//   setName(product.name || "");
//   setDescription(product.description || "");
//   setPrice(product.price || 0);
//   setCategory(product.category || "");
//   setStock(product.stock || 0);
//   setOldImages(product.images || []);
// }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

      if (isUpdated) {
    toast.success("Product Updated Successfully");
    
    setTimeout(() => {
      navigate("/admin/products");
      dispatch(UPDATE_PRODUCT_RESET());
    }, 1500); // wait 1.5s so toast is visible
  }
  }, [
    dispatch,
    alert,
    error,
    navigate,
    isUpdated,
    id,
    product,
    updateError,
  ]);

  // const updateProductSubmitHandler = (e) => {
  //   e.preventDefault();

  //   const myForm = new FormData();

  //   myForm.set("name", name);
  //   myForm.set("price", price);
  //   myForm.set("description", description);
  //   myForm.set("category", category);
  //   myForm.set("Stock", Stock);

  //   images.forEach((image) => {
  //     myForm.append("images", image);
  //   });
  //   // dispatch(updateProduct(id, myForm));
  //   dispatch(updateProduct({ id: id, productData: myForm }));
  //   console.log("Updating Product:", { id: id, productData: myForm });
  // };

  const updateProductImagesChange = (e) => {
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


  const updateProductSubmitHandler = (e) => {
    e.preventDefault();
  
    // const myForm = {
    //   name,
    //   price,
    //   description,
    //   category,
    //   // Stock,
    //   stock: Stock,
    //   images, // Use the image URLs from Cloudinary
    // };
  
    const myForm = {
  name,
  price,
  description,
  category,
  stock: Stock,
  images,
  isEcoCertified,
  materialType,
  weightInGrams,
  shippingDistanceKm,
};

    dispatch(updateProduct({ id: id, productData: myForm }));
  };
  
  const handleImageUpload = async (files) => {
    const imageUrls = [];
    const previews = [];
  
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("upload_preset", "unsigned_upload");
  
      const res = await fetch("https://api.cloudinary.com/v1_1/dkusbu9rg/image/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      imageUrls.push({ public_id: data.public_id, url: data.secure_url });
      previews.push(data.secure_url);
    }
  
    setImages(imageUrls);         // For backend submission
    setImagesPreview(previews);   // For preview display
  };
  
  
  

  return (
    <Fragment>
        <ToastContainer />
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Update Product</h1>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name || ""} // fallback to empty string
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
                value={price}
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
  <CheckBoxIcon />
  <label style={{ display: "flex", alignItems: "center" }}>
    <input
      type="checkbox"
      checked={isEcoCertified}
      onChange={(e) => setIsEcoCertified(e.target.checked)}
      style={{ marginRight: "8px", transform: "scale(1.2)" }}
    />
    Eco Certified?
  </label>
</div>

<div>
  <EnergySavingsLeafIcon />
  <select
    value={materialType}
    onChange={(e) => setMaterialType(e.target.value)}
  >
    <option value="">Choose Material Type</option>
    {materialTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
</div>

<div>
  <ScaleIcon />
  <input
    type="number"
    placeholder="Weight (grams)"
    value={weightInGrams}
    onChange={(e) => setWeightInGrams(Number(e.target.value))}
  />
</div>

<div>
  <LocalShippingIcon />
  <input
    type="number"
    placeholder="Shipping Distance (km)"
    value={shippingDistanceKm}
    onChange={(e) => setShippingDistanceKm(Number(e.target.value))}
  />
</div>
            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                onChange={(e) => setStock(e.target.value)}
                value={Stock}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Product Preview" />
                ))}
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Update Product
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
