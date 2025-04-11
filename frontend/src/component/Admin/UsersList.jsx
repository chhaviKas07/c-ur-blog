import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
import {
  getAllUsers,
  deleteUser,
  clearAdminErrors,
  deleteUserReset,
} from "../../userSlice";

const UsersLists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, users } = useSelector((state) => state.userAdmin);
  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.userAdmin);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

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
      toast.success(message);
      navigate("/admin/users");
      dispatch(deleteUserReset());
    }

    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, isDeleted, navigate, message]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 150, flex: 0.5 },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.value === "admin" ? "greenColor" : "redColor";
      },
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/user/${params.row.id}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => deleteUserHandler(params.row.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows =
    users?.map((user) => ({
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    })) || [];

  return (
    <Fragment>
      <ToastContainer />
      <MetaData title={`ALL USERS - Admin`} />
      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            // autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default UsersLists;
