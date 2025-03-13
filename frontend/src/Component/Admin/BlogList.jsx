import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./productList.css"; // Ensure the CSS file is properly named and available
import { useSelector, useDispatch } from "react-redux";
import {
  clearAdminErrors,
  getAdminBlog,
  deleteBlog,
  deleteBlogReset,
} from "../../Slices/ProductSlice"; // Adjust the import according to your slice file
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@mui/material";

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, blogs } = useSelector((state) => state.adminBlogs);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.adminBlogs
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearAdminErrors());
    }

    if (isDeleted) {
      toast.success("Blog Deleted Successfully");
      navigate("/admin/dashboard");
      dispatch(deleteBlogReset());
    }

    dispatch(getAdminBlog());
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  const columns = [
    { field: "id", headerName: "Blog ID", minWidth: 200, flex: 0.5 },
    {
      field: "title",
      headerName: "Title",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "author_name",
      headerName: "Author Name",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Fragment>
          <Link to={`/admin/blog/${params.row.id}`}>
            <EditIcon />
          </Link>
          <Button onClick={() => deleteBlogHandler(params.row.id)}>
            <DeleteIcon />
          </Button>
        </Fragment>
      ),
    },
  ];

  const rows = blogs.map((item) => ({
    id: item._id,
    title: item.title,
    description: item.description,
    author_name: item.author_name,
  }));

  const deleteBlogHandler = (id) => {
    dispatch(deleteBlog(id));
  };

  return (
    <Fragment>
      <MetaData title={`ALL BLOGS - Admin`} />
      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL Blogs</h1>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={15}
            disableSelectionOnClick
            className="productListTable"
            // autoHeight
          />
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default BlogList;
