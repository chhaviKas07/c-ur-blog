import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Person2Icon from "@mui/icons-material/Person2";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SideBar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getUserDetails,
  updateUser,
  clearProfileErrors,
  updateUserReset,
  deleteUserReset,
} from "../../userSlice";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = id;

  const { loading, error, user } = useSelector((state) => state.userAdmin);
  // const { isDeleted } = useSelector((state) => state.userAdmin);
  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
    isDeleted,
  } = useSelector((state) => state.userAdmin);

  const [role, setRole] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(getUserDetails(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else if (user) {
      setRole(user.role);
    }
  
    if (error) {
      toast.error(error);
      dispatch(clearProfileErrors());
    }
  
    if (updateError) {
      toast.error(updateError);
      dispatch(clearProfileErrors());
    }
  
    if (isUpdated) {
      console.log("isUpdated:", isUpdated);

      toast.success("User Updated Successfully");
        dispatch(updateUserReset());
        navigate("/admin/users");// give time for toast to show
    }


    // if (isDeleted) {
    //   toast.success("User Deleted Successfully");
    //     navigate("/admin/users");
    //     dispatch(deleteUserReset());
    // }
    if (isDeleted) {
      toast.success("User Deleted Successfully");
      navigate("/admin/users");
      dispatch(deleteUserReset());
    }
  }, [dispatch, error, updateError, isUpdated,isDeleted, user, userId, navigate]);
  

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("role", role);
    dispatch(updateUser({ id: userId, userData: { role } }));
  };

  return (
    <Fragment>
      <ToastContainer />
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <div>
                <Person2Icon />
                <input
                  type="text"
                  placeholder="Name"
                  value={user ? user.name : ""}
                  disabled
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  value={user ? user.email : ""}
                  disabled
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
  id="createProductBtn"
  type="submit"
  disabled={updateLoading || role === ""}
>
  {updateLoading ? "Updating..." : "Update"}
</Button>

            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
