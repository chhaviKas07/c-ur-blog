const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, deleteReview, getProductReviews, getAdminProducts, updateMissingEcoScores, getEcoSummary,
  getTopEcoProducts,
  getMonthlyCarbonData,getEcoRecommendations } = require("../controllers/productC");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const upload = require("../utils/multer");

router.route("/products").get(getAllProducts);

router.get("/admin/eco/summary", isAuthenticatedUser, authorizeRoles("admin"), getEcoSummary);
router.get("/admin/eco/top-products", isAuthenticatedUser, authorizeRoles("admin"), getTopEcoProducts);
router.get("/admin/eco/monthly-carbon", isAuthenticatedUser, authorizeRoles("admin"), getMonthlyCarbonData);
router.get("/product/:id/recommendations", getEcoRecommendations);


router
    .route("/admin/products")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

    router.route("/admin/products/update-eco-scores")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateMissingEcoScores);

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