// import React, { Fragment, useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import "./blogReviews.css";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   clearReviewErrors,
//   getAllReviews,
//   deleteReviews,
//   resetDeleteReview,
// } from "../../Slices/ProductSlice";
// import MetaData from "../Layout/MetaData";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Star from "@mui/icons-material/Star";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@mui/material";
// import SideBar from "./Sidebar";
// import { get } from "mongoose";

// const BlogReviews = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { error: deleteError, isDeleted } = useSelector(
//     (state) => state.userReviews
//   );

//   const {
//     error,
//     reviews = [],
//     loading,
//   } = useSelector((state) => state.userReviews);

//   const [blogId, setBlogId] = useState("");

//   const deleteReviewHandler = (reviewId) => {
//     dispatch(deleteReviews(reviewId, blogId));
//   };

//   const blogReviewsSubmitHandler = (e) => {
//     e.preventDefault();
//     dispatch(getAllReviews(blogId));
//   };

//   useEffect(() => {
//     if (blogId.length === 24) {
//       dispatch(getAllReviews(blogId));
//     }
//     if (error) {
//       toast.error(error);
//       dispatch(clearReviewErrors());
//     }

//     if (deleteError) {
//       toast.error(deleteError);
//       dispatch(clearReviewErrors());
//     }

//     if (isDeleted) {
//       toast.success("Review Deleted Successfully");
//       navigate("/admin/reviews");
//       dispatch(resetDeleteReview);
//     }
//   }, [dispatch, toast, error, deleteError, navigate, isDeleted, blogId]);

//   const columns = [
//     { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

//     {
//       field: "user",
//       headerName: "User",
//       minWidth: 200,
//       flex: 0.6,
//     },

//     {
//       field: "comment",
//       headerName: "Comment",
//       minWidth: 350,
//       flex: 1,
//     },

//     {
//       field: "rating",
//       headerName: "Rating",
//       type: "number",
//       minWidth: 180,
//       flex: 0.4,

//       cellClassName: (params) => {
//         return params.getValue(params.id, "rating") >= 3
//           ? "greenColor"
//           : "redColor";
//       },
//     },

//     {
//       field: "actions",
//       flex: 0.3,
//       headerName: "Actions",
//       minWidth: 150,
//       type: "number",
//       sortable: false,
//       renderCell: (params) => {
//         return (
//           <Fragment>
//             <Button
//               onClick={() =>
//                 deleteReviewHandler(params.getValue(params.id, "id"))
//               }
//             >
//               <DeleteIcon />
//             </Button>
//           </Fragment>
//         );
//       },
//     },
//   ];

//   const rows = [];

//   reviews &&
//     reviews.forEach((item) => {
//       rows.push({
//         id: item._id,
//         rating: item.rating,
//         comment: item.comment,
//         user: item.name,
//       });
//     });

//   return (
//     <Fragment>
//       <MetaData title={`ALL REVIEWS - Admin`} />

//       <div className="dashboard">
//         <SideBar />
//         <div className="productReviewsContainer">
//           <form
//             className="productReviewsForm"
//             onSubmit={blogReviewsSubmitHandler}
//           >
//             <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

//             <div>
//               <Star />
//               <input
//                 type="text"
//                 placeholder="Product Id"
//                 required
//                 value={blogId}
//                 onChange={(e) => setBlogId(e.target.value)}
//               />
//             </div>

//             <Button
//               id="createProductBtn"
//               type="submit"
//               disabled={loading ? true : false || blogId === "" ? true : false}
//             >
//               Search
//             </Button>
//           </form>

//           {reviews && reviews.length > 0 ? (
//             <DataGrid
//               rows={rows}
//               columns={columns}
//               pageSize={10}
//               disableSelectionOnClick
//               className="productListTable"
//               autoHeight
//             />
//           ) : (
//             <h1 className="productReviewsFormHeading">No Reviews Found</h1>
//           )}
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default BlogReviews;

import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./blogReviews.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearReviewErrors,
  getAllReviews,
  deleteReviews,
  resetDeleteReview,
} from "../../Slices/ProductSlice";
import MetaData from "../Layout/MetaData";
import DeleteIcon from "@mui/icons-material/Delete";
import Star from "@mui/icons-material/Star";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import SideBar from "./Sidebar";

const BlogReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.userReviews
  );
  const {
    error,
    reviews = [],
    loading,
  } = useSelector((state) => state.userReviews);

  const [blogId, setBlogId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReviews({ reviewId, blogId }));
    }
  };

  const blogReviewsSubmitHandler = (e) => {
    e.preventDefault();
    if (blogId.length === 24) {
      dispatch(getAllReviews(blogId));
    } else {
      toast.error("Invalid Blog ID");
    }
  };

  useEffect(() => {
    console.log("Current reviews state:", reviews);
    if (error) {
      toast.error(error);
      dispatch(clearReviewErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearReviewErrors());
    }

    if (isDeleted) {
      toast.success("Review Deleted Successfully");
      navigate("/admin/reviews");
      dispatch(resetDeleteReview());
    }
  }, [dispatch, error, deleteError, isDeleted, navigate, reviews]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
    { field: "user", headerName: "User", minWidth: 200, flex: 0.6 },
    { field: "comment", headerName: "Comment", minWidth: 350, flex: 1 },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.4,
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => deleteReviewHandler(params.getValue(params.id, "id"))}
        >
          <DeleteIcon />
        </Button>
      ),
    },
  ];

  const rows = reviews.map((item) => ({
    id: item._id,
    rating: item.rating,
    comment: item.comment,
    user: item.user.name,
  }));

  return (
    <Fragment>
      <MetaData title={`ALL REVIEWS - Admin`} />
      <div className="dashboard">
        <SideBar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={blogReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>
            <div>
              <Star />
              <input
                type="text"
                placeholder="Blog ID"
                required
                value={blogId}
                onChange={(e) => setBlogId(e.target.value)}
              />
            </div>
            <Button
              id="searchReviewsBtn"
              type="submit"
              disabled={loading || !blogId}
            >
              Search
            </Button>
          </form>
          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
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

export default BlogReviews;
