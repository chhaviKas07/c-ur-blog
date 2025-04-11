const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");
app.use(
  cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    
    
  //   const multer = require('multer');
  //   const upload = multer({ storage: multer.diskStorage({
  //     destination: (req, file, cb) => {
  //         cb(null, "ecommerce/");  // ✅ Use a proper folder
  //     },
  //     filename: (req, file, cb) => {
  //         cb(null, `${Date.now()}-${file.originalname}`);
  //     }
  // }) });

// Config
dotenv.config({ path: "backend/config/config.env" });


app.use(express.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
// app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload({ limits: { fileSize: 100 * 1024 * 1024 } }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));




const user = require("./routes/userR");
const payment = require("./routes/paymentR");
const order = require("./routes/orderR");
const product = require("./routes/productR");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// // Middleware for Errors
app.use(errorMiddleware);

module.exports = app;