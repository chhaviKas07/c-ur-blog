const express = require("express");
const {
  newUserBlogPayment,
  getSingleUserBlogPayment,
  myBlogPayment,
  getAllBlogPayment,
  updateBlogPayment,
  deleteBlogPayment,
} = require("../controllers/userBlogPaymentC");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/blogpayment/new").post(isAuthenticatedUser, newUserBlogPayment);

router.route("/blogpayment/:id").get(isAuthenticatedUser, getSingleUserBlogPayment);

router.route("/blogpayments/me").get(isAuthenticatedUser, myBlogPayment);

router
  .route("/admin/blogpayments")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllBlogPayment);

router
  .route("/admin/blogpayment/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateBlogPayment)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBlogPayment);

module.exports = router;
