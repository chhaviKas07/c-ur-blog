const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error");


// // Config
dotenv.config({ path: "backend/config/config.env" });

app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// // Route Imports
const blog = require("./routes/blogR");
const user = require("./routes/userR");
const userBlogPayment = require("./routes/userBlogPaymentR");
const payment = require("./routes/paymentR");

app.use("/api/v1", blog);
app.use("/api/v1", user);
app.use("/api/v1", userBlogPayment);
app.use("/api/v1", payment);


// // Middleware for Errors
app.use(errorMiddleware);

module.exports = app;