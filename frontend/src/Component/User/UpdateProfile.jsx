import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProfileErrors,
  updateProfile,
  loadUser,
  updateProfileReset,
} from "../../userSlice";
import MetaData from "../layout/MetaData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector(
    (state) => state.updateProfile
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
  // const updateProfileDataChange = (e) => {
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     if (reader.readyState === 2) {
  //       console.log("Avatar Preview: ", reader.result);
  //       setAvatarPreview(reader.result);
  //       setAvatar(e.target.files[0]);
  //     }
  //   };

  //   console.log("Selected File: ", e.target.files[0]);
  //   reader.readAsDataURL(e.target.files[0]);
  // };

  // const updateProfileSubmit = (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("email", email);
  
  //   if (avatar) {
  //     formData.append("avatar", avatar); // Make sure `avatar` is a File object
  //   }
  
  //   console.log("FormData Entries:");
  //   for (let [key, value] of formData.entries()) {
  //     console.log(key, value);  // Debugging
  //   }
  
  //   dispatch(updateProfile(formData));
  // };


  const updateProfileDataChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(file);
      }
    };
    reader.readAsDataURL(file);
  };

 
  const updateProfileSubmit = async (e) => {
    e.preventDefault();
  
    let avatarData = null;
  
    if (avatar) {
      try {
        const formData = new FormData();
        formData.append("file", avatar);
        formData.append("upload_preset", "unsigned_upload"); // 🔁 Replace with your Cloudinary preset
        formData.append("folder", "ecommerce");
  
        const res = await fetch("https://api.cloudinary.com/v1_1/dkusbu9rg/image/upload", {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        console.log("Cloudinary upload response:", data);
  
        if (!res.ok || !data.secure_url || !data.public_id) {
          throw new Error("Cloudinary upload failed");
        }
  
        avatarData = {
          public_id: data.public_id,
          url: data.secure_url,
        };
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        toast.error("Image upload failed");
        return; // ❌ Don't continue if upload fails
      }
    }
  
    // ✅ Build payload safely
    let payload = { name, email };
    if (avatarData && avatarData.public_id && avatarData.url) {
      payload.avatar = avatarData;
    }
  
    console.log("Payload being sent:", payload);
    dispatch(updateProfile(payload));
  };

  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }

    if (error) {
      toast.error(error);
      dispatch(clearProfileErrors());
    }

    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(loadUser());
      navigate("/account");

      dispatch(updateProfileReset());
    }
  }, [dispatch, error, isUpdated, navigate, user]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
      <ToastContainer />
    </Fragment>
  );
};

export default UpdateProfile;
