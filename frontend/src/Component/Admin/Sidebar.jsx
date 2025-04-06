// import React from "react";
// import "./sidebar.css";
// import logo from "../../assets/logo.png";
// import { Link } from "react-router-dom";
// import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import PostAddIcon from "@mui/icons-material/PostAdd";
// import AddIcon from "@mui/icons-material/Add";
// import ImportExportIcon from "@mui/icons-material/ImportExport";
// import ListAltIcon from "@mui/icons-material/ListAlt";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import RateReviewIcon from "@mui/icons-material/RateReview";

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <Link to="/">
//         <img src={logo} alt="Ecommerce" />
//       </Link>
//       <Link to="/admin/dashboard">
//         <p>
//           <DashboardIcon /> Dashboard
//         </p>
//       </Link>
//       <SimpleTreeView
//         aria-label="SimpleTreeView"
//         defaultCollapseIcon={<ExpandMoreIcon />}
//         defaultExpandIcon={<ImportExportIcon />}
//         sx={{ minWidth: 240 }} // Adjust width as needed
//       >
//         <TreeItem nodeId="1" label="Blogs">
//           <TreeItem
//             nodeId="2"
//             label={
//               <Link
//                 to="/admin/blogs"
//                 style={{ textDecoration: "none", color: "inherit" }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <PostAddIcon />
//                   <span>All</span>
//                 </div>
//               </Link>
//             }
//           />
//           <TreeItem
//             nodeId="3"
//             label={
//               <Link
//                 to="/admin/blog"
//                 style={{ textDecoration: "none", color: "inherit" }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <AddIcon />
//                   <span>Create</span>
//                 </div>
//               </Link>
//             }
//           />
//         </TreeItem>
//       </SimpleTreeView>
//       <Link to="/admin/blogpayments">
//         <p>
//           <ListAltIcon />
//           Orders
//         </p>
//       </Link>
//       <Link to="/admin/users">
//         <p>
//           <PeopleIcon /> Users
//         </p>
//       </Link>
//       <Link to="/admin/reviews">
//         <p>
//           <RateReviewIcon />
//           Reviews
//         </p>
//       </Link>
//     </div>
//   );
// };

// export default Sidebar;

import React from "react";
import "./sidebar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>
      <div className="sidebar-section">
        <p>Blogs</p>
        <Link
          to="/admin/products"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
          }}
        >
          <PostAddIcon />
          <span>All</span>
        </Link>
        <Link
          to="/admin/product/new"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AddIcon />
          <span>Create</span>
        </Link>
      </div>
      <Link to="/admin/orders">
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <PeopleIcon /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReviewIcon />
          Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;
