import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Person2Icon from "@mui/icons-material/Person2";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearErrors, login, register, loadUser } from "../../UserSlice";
// import { useDispatch, useSelector } from "react-redux";

// import { useAlert } from "react-alert";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const alert = useAlert();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  // const registerSubmit = (e) => {
  //   e.preventDefault();
    
  //   const myForm = new FormData();

  //   myForm.set("name", name);
  //   myForm.set("email", email);
  //   myForm.set("password", password);
  //   myForm.set("avatar", avatar);
  //   dispatch(register(myForm));
  // };


//   const registerSubmit = async (e) => {
//     e.preventDefault();

//     const myForm = new FormData();
//     myForm.set("name", name);
//     myForm.set("email", email);
//     myForm.set("password", password);
//     myForm.set("avatar", avatar);

//     console.log("Registering user...");
//     const response = await dispatch(register(myForm));

//     console.log("Response:", response); // Debugging response

//     if (response?.payload?.email) {  // ✅ Check if user data exists instead
//         console.log("Registration successful, dispatching loadUser...");
//         await dispatch(loadUser()); 
//         console.log("Navigating to dashboard...");
//         navigate("/account");
//     } else {
//         console.log("Registration failed or no success response:", response);
//     }
// };

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_upload"); // your actual preset
  formData.append("cloud_name", "dkusbu9rg");

  const res = await fetch("https://api.cloudinary.com/v1_1/dkusbu9rg/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return {
    public_id: data.public_id,
    url: data.secure_url,
  };
};

const registerSubmit = async (e) => {
  e.preventDefault();

  let avatarData = {
    public_id: "default_avatar",
    url: "https://res.cloudinary.com/dkusbu9rg/image/upload/v1744035770/Profile_gfcuj2.png",
  };
  // let avatarData = { public_id: "", url: "" };

  if (avatar && avatar !== "/Profile.png") {
    try {
      avatarData = await uploadToCloudinary(avatar);
    } catch (err) {
      toast.error("Avatar upload failed");
      return;
    }
  }

  const userData = {
    name,
    email,
    password,
    avatar: avatarData,
  };

  const response = await dispatch(register(userData));

  if (response?.payload?.success) {
    await dispatch(loadUser());
    navigate(redirect);

  }
};

  
  

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  // const redirect = location.search ? location.search.split("=")[1] : "/account";
  
  const redirect =
  new URLSearchParams(window.location.search).get("redirect") || "/account";


  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated) {
      navigate(redirect);

    }
  }, [dispatch, error, isAuthenticated, navigate]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
    <ToastContainer />
    {loading ? (
      <Loader />
    ) : (
      <Fragment>
        <div className="LoginSignUpContainer">
          <div className="LoginSignUpBox">
            <div>
              <div className="login_signUp_toggle">
                <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
              </div>
              <button ref={switcherTab}></button>
            </div>
            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
              <div className="loginEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="loginPassword">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  autoComplete="current-password" // Add autocomplete attribute
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Link to="/password/forgot">Forget Password ?</Link>
              <input type="submit" value="Login" className="loginBtn" />
            </form>
            <form
              className="signUpForm"
              ref={registerTab}
              encType="multipart/form-data"
              onSubmit={registerSubmit}
            >
              <div className="signUpName">
                <Person2Icon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
              </div>
              <div className="signUpPassword">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  autoComplete="current-password" // Add autocomplete attribute
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                />
              </div>

              <div id="registerImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={registerDataChange}
                />
              </div>
              <input type="submit" value="Register" className="signUpBtn" />
            </form>
          </div>
        </div>
      </Fragment>
    )}
  </Fragment>
  );
};

export default LoginSignUp;




// const LoginSignUp = ({}) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { error, loading, isAuthenticated } = useSelector(
//     (state) => state.user
//   );

//   const loginTab = useRef(null);
//   const registerTab = useRef(null);
//   const switcherTab = useRef(null);

//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");

//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const { name, email, password } = user;

//   const [avatar, setAvatar] = useState("/Profile.png");
//   const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

//   const loginSubmit = (e) => {
//     e.preventDefault();
//     dispatch(login(loginEmail, loginPassword));
//   };

//   const registerSubmit = (e) => {
//     e.preventDefault();

//     const myForm = new FormData();

//     myForm.set("name", name);
//     myForm.set("email", email);
//     myForm.set("password", password);
//     myForm.set("avatar", avatar);
//     dispatch(register(myForm));
//   };

//   const registerDataChange = (e) => {
//     if (e.target.name === "avatar") {
//       const reader = new FileReader();

//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setAvatarPreview(reader.result);
//           setAvatar(reader.result);
//         }
//       };

//       reader.readAsDataURL(e.target.files[0]);
//     } else {
//       setUser({ ...user, [e.target.name]: e.target.value });
//     }
//   };

//   // const redirect =
//   //   new URLSearchParams(window.location.search).get("redirect") || "/account";

//   // const redirect = location.search ? location.search.split("=")[1] : "/account";

//   const redirect =
//     new URLSearchParams(window.location.search).get("redirect") || "/account";

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearErrors());
//     }

//     if (isAuthenticated) {
//       navigate(redirect);
//     }
//   }, [dispatch, error, toast, history, isAuthenticated, redirect]);

//   const switchTabs = (e, tab) => {
//     if (tab === "login") {
//       switcherTab.current.classList.add("shiftToNeutral");
//       switcherTab.current.classList.remove("shiftToRight");

//       registerTab.current.classList.remove("shiftToNeutralForm");
//       loginTab.current.classList.remove("shiftToLeft");
//     }
//     if (tab === "register") {
//       switcherTab.current.classList.add("shiftToRight");
//       switcherTab.current.classList.remove("shiftToNeutral");

//       registerTab.current.classList.add("shiftToNeutralForm");
//       loginTab.current.classList.add("shiftToLeft");
//     }
//   };

//   return (
//     <Fragment>
//       <ToastContainer />
//       {loading ? (
//         <Loader />
//       ) : (
//         <Fragment>
//           <div className="LoginSignUpContainer">
//             <div className="LoginSignUpBox">
//               <div>
//                 <div className="login_signUp_toggle">
//                   <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
//                   <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
//                 </div>
//                 <button ref={switcherTab}></button>
//               </div>
//               <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
//                 <div className="loginEmail">
//                   <MailOutlineIcon />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     required
//                     value={loginEmail}
//                     onChange={(e) => setLoginEmail(e.target.value)}
//                   />
//                 </div>
//                 <div className="loginPassword">
//                   <LockOpenIcon />
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     required
//                     autoComplete="current-password" // Add autocomplete attribute
//                     value={loginPassword}
//                     onChange={(e) => setLoginPassword(e.target.value)}
//                   />
//                 </div>
//                 <Link to="/password/forgot">Forget Password ?</Link>
//                 <input type="submit" value="Login" className="loginBtn" />
//               </form>
//               <form
//                 className="signUpForm"
//                 ref={registerTab}
//                 encType="multipart/form-data"
//                 onSubmit={registerSubmit}
//               >
//                 <div className="signUpName">
//                   <Person2Icon />
//                   <input
//                     type="text"
//                     placeholder="Name"
//                     required
//                     name="name"
//                     value={name}
//                     onChange={registerDataChange}
//                   />
//                 </div>
//                 <div className="signUpEmail">
//                   <MailOutlineIcon />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     required
//                     name="email"
//                     value={email}
//                     onChange={registerDataChange}
//                   />
//                 </div>
//                 <div className="signUpPassword">
//                   <LockOpenIcon />
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     required
//                     autoComplete="current-password" // Add autocomplete attribute
//                     name="password"
//                     value={password}
//                     onChange={registerDataChange}
//                   />
//                 </div>

//                 <div id="registerImage">
//                   <img src={avatarPreview} alt="Avatar Preview" />
//                   <input
//                     type="file"
//                     name="avatar"
//                     accept="image/*"
//                     onChange={registerDataChange}
//                   />
//                 </div>
//                 <input type="submit" value="Register" className="signUpBtn" />
//               </form>
//             </div>
//           </div>
//         </Fragment>
//       )}
//     </Fragment>
//   );
// };

// export default LoginSignUp;
