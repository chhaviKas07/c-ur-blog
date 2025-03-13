const express = require("express");
const { getAllBlogs, createBlog, updateBlog, deleteBlog, getBlogDetails, createBlogComment, deleteComment, getBlogComments, getAdminBlogs } = require("../controllers/blogC");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/blogs").get(getAllBlogs);

router
    .route("/admin/blogs")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminBlogs);

router
    .route("/admin/blog/new")
    .post(isAuthenticatedUser, authorizeRoles("admin"), createBlog);

//     .route("/blog/:id").put(updateBlog).delete(deleteBlog);
router
    .route("/admin/blog/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateBlog)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBlog);

// router.route("/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

// router.route("/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);


router.route("/blog/:id").get(getBlogDetails);

router.route("/review").put(isAuthenticatedUser, createBlogComment);

router
    .route("/reviews")
    .get(getBlogComments)
    .delete(isAuthenticatedUser, deleteComment);

module.exports = router;