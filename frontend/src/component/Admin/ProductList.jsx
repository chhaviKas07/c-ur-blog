import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllProductsAdmin,
  deleteProduct,
  resetDeleteState,
} from "../../productSlice";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
// import { toast, ToastContainer } from "react-toastify";
import { Button } from "@mui/material";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const alert = useAlert();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });


  // const { error, products } = useSelector((state) => state.products);
// const { error: deleteError, isDeleted } = useSelector(
  //   (state) => state.products
  // );
  const { error,deleteError, adminProducts, isDeleted } = useSelector((state) => state.products);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Product Deleted Successfully");
      navigate("/admin/products");
      dispatch(resetDeleteState());
    }

    dispatch(getAllProductsAdmin());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const productId = params.row.id;
        return (
          <Fragment>
            {/* <Link to={`/admin/product/${params.getValue(params.id, "id")}`}> */}
            <Link to={`/admin/product/${productId}`}>
              <EditIcon />
            </Link>

            {/* <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
              }
            > */}
                   <Button onClick={() => deleteProductHandler(productId)}>
              <DeleteIcon />
              </Button>
          </Fragment>
        );
      },
    },
  ];

  // const rows = [];

  // products &&
  //   products.forEach((item) => {
  //     rows.push({
  //       id: item._id,
  //       stock: item.Stock,
  //       price: item.price,
  //       name: item.name,
  //     });
  //   });
  // const rows = products?.map((product) => {
    const rows = adminProducts?.map((product) => {

    if (!product || !product._id) return null; // Skip products without _id
    return {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
    };
  }).filter(Boolean); // Remove null values

  return (
    <Fragment>
        {/* <ToastContainer /> */}
      <MetaData title={`ALL PRODUCTS - Admin`} />
      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL PRODUCTS</h1>

          {/* <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          /> */}
          
          <DataGrid
  rows={rows}
  columns={columns}
  pagination
  paginationModel={paginationModel}
  onPaginationModelChange={(model) => setPaginationModel(model)}
  pageSizeOptions={[5, 10, 20, 50]}
  disableSelectionOnClick
  className="productListTable"
  autoHeight
/>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;
