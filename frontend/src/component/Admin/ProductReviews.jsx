import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./productReviews.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getReviews,
  deleteReview,
  resetDeleteReview,
} from "../../productSlice";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@mui/icons-material/Delete";
import Star from "@mui/icons-material/Star";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import SideBar from "./Sidebar";

const ProductReviews = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.products
  );

  const { error, reviews, loading } = useSelector(
    (state) => state.products
  );

  const [productId, setProductId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReview({ reviewId, productId }));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getReviews(productId));
  };

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getReviews(productId));
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Review Deleted Successfully");
      navigate("/admin/reviews");
      dispatch(resetDeleteReview());
    }
  }, [dispatch, error, deleteError, isDeleted, productId, navigate]);
  
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },

    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.4,

      cellClassName: (params) =>
        params.row.rating >= 3 ? "greenColor" : "redColor",
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button onClick={() => deleteReviewHandler(params.row.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL REVIEWS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <Star />
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={
                loading ? true : false || productId === "" ? true : false
              }
            >
              Search
            </Button>
          </form>

          {reviews && reviews.length > 0 ? (
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
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
