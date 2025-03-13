const UserBlogPayment = require("../models/userBlogPaymentM");
const Blog = require("../models/blogM");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// // Create new Order
exports.newUserBlogPayment = catchAsyncErrors(async (req, res, next) => {
    const { userInfo, paymentInfo, itemsPrice, taxPrice, totalPrice, orderItems } = req.body;

    console.log("Request body:", req.body);
    console.log("User:", req.user);

    // Check if all required fields are provided
    if (!userInfo || !paymentInfo || !itemsPrice || !taxPrice || !totalPrice || !orderItems) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    // Create a new UserBlogPayment entry
    const userBlogPayment = await UserBlogPayment.create({
        userInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
        orderItems, // Include orderItems
    });

    res.status(201).json({ success: true, userBlogPayment });
});


// // get Single Order
exports.getSingleUserBlogPayment = catchAsyncErrors(async (req, res, next) => {
    const userBlogPayment = await UserBlogPayment.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!userBlogPayment) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        userBlogPayment,
    });
});

// get logged in user  Orders
// exports.myBlogPayment = catchAsyncErrors(async (req, res, next) => {
//     const userBlogPayment = await UserBlogPayment.find({ user: req.user._id });

//     res.status(200).json({
//         success: true,
//         userBlogPayment,
//     });
// });

exports.myBlogPayment = catchAsyncErrors(async (req, res, next) => {

    const userBlogPayments = await UserBlogPayment.find({ user: req.user._id });

    if (!userBlogPayments) {
        return next(new ErrorHandler("No orders found for this user", 404));
    }

    res.status(200).json({
        success: true,
        userBlogPayments,
    });
});




// get all Orders -- Admin
exports.getAllBlogPayment = catchAsyncErrors(async (req, res, next) => {
    const userBlogPayments = await UserBlogPayment.find();

    let totalAmount = 0;

    userBlogPayments.forEach((userBlogPayment) => {
        totalAmount += userBlogPayment.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        userBlogPayments,
    });
});


// update Order Status -- Admin
exports.updateBlogPayment = catchAsyncErrors(async (req, res, next) => {
    const userBlogPayment = await UserBlogPayment.findById(req.params.id);

    if (!userBlogPayment) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if (userBlogPayment.userBlogPaymentStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    userBlogPayment.userBlogPaymentStatus = req.body.status;

    if (req.body.status === "Delivered") {
        userBlogPayment.deliveredAt = Date.now();
    }

    await userBlogPayment.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});

// delete Order -- Admin
exports.deleteBlogPayment = catchAsyncErrors(async (req, res, next) => {
    // const order = await Order.findById(req.params.id);
    const userBlogPayment = await UserBlogPayment.findByIdAndDelete(req.params.id);

    if (!userBlogPayment) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    // await order.remove();

    res.status(200).json({
        success: true,
    });
});
