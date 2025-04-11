const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, deleteReview, getProductReviews, getAdminProducts } = require("../controllers/productC");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const upload = require("../utils/multer");

router.route("/products").get(getAllProducts);

router
    .route("/admin/products")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

// router.route("/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/product/new").post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    // upload.array("images", 5), // ✅ Ensure images are uploaded
    createProduct
);

router.post(
    "/admin/product/new",
    // upload.array("images", 5),  // 👈 very important!
    isAuthenticatedUser,
    authorizeRoles("admin"),
    createProduct
  );

router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);


router.route("/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);


router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
    .route("/reviews")
    .get(getProductReviews)
    .delete(isAuthenticatedUser, deleteReview);

module.exports = router;