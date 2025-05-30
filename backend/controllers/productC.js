
const streamifier = require('streamifier'); // Make sure to require this at top if not already
const Product = require("../models/productM");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const mongoose = require('mongoose');

// Create Product -- Admin

// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//     console.log("REQ.BODY:", req.body);
  
//     let images = [];
  
//     // If images come as string (JSON from frontend), parse it
//     if (typeof req.body.images === "string") {
//       try {
//         images = JSON.parse(req.body.images);
//       } catch (error) {
//         return res.status(400).json({ success: false, message: "Invalid images format" });
//       }
//     } else if (Array.isArray(req.body.images)) {
//       images = req.body.images;
//     }
  
//     // Validate each image object
//     const isValidImages = images.every(
//       (img) => img.public_id && img.url
//     );
  
//     if (!isValidImages) {
//       return res.status(400).json({ success: false, message: "Each image must have public_id and url" });
//     }
  
//     const product = await Product.create({
//       name: req.body.name,
//       description: req.body.description,
//       price: req.body.price,
//       category: req.body.category,
//       stock: req.body.stock,
//       images,
//       user: req.user._id,
//     });
  
//     res.status(201).json({
//       success: true,
//       product,
//     });
//   });
  

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock, images } = req.body;

  // Check if images is an array and each image has public_id and url
  if (!Array.isArray(images)) {
    return res.status(400).json({ success: false, message: "Images must be an array." });
  }

  const isValidImages = images.every((img) => img.public_id && img.url);
  if (!isValidImages) {
    return res.status(400).json({ success: false, message: "Each image must have public_id and url." });
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images, // Array of { public_id, url }
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    product,
  });
});


// exports.getAllProducts = async (req, res) => {
//   try {
//     const resultPerPage = 10;
//     const currentPage = Number(req.query.page) || 1;

//     const skip = resultPerPage * (currentPage - 1);

//     const keyword = req.query.keyword
//       ? {
//           name: {
//             $regex: req.query.keyword,
//             $options: "i",
//           },
//         }
//       : {};

//     let queryObj = {
//       ...keyword,
//       // Add other filters like category, price, rating if you want
//     };

//     let productsQuery = Product.find(queryObj)
//       .limit(resultPerPage)
//       .skip(skip);

//     const products = await productsQuery;

//     const productsCount = await Product.countDocuments(queryObj);

//     res.status(200).json({
//       success: true,
//       products,
//       productsCount,
//       resultPerPage,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 10;
    const currentPage = Number(req.query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  
  const category = req.query.category
    ? { category: { $regex: req.query.category, $options: "i" } }
    : {};
  
  const price = req.query.price
    ? {
        price: {
          $gte: Number(req.query.price.gte) || 0,
          $lte: Number(req.query.price.lte) || 25000,
        },
      }
    : {};
  
  const ratings = req.query.ratings && !isNaN(req.query.ratings)
    ? {
        ratings: {
          $gte: Number(req.query.ratings),
        },
      }
    : {};
  
  const queryObj = {
    ...keyword,
    ...category,
    ...price,
    ...ratings,
  };
  

    const productsCount = await Product.countDocuments(queryObj);

    const products = await Product.find(queryObj)
      .limit(resultPerPage)
      .skip(skip);

    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount: productsCount, // add this to match frontend logic
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};









// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Update Product -- Admin

// exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
//     let product = await Product.findById(req.params.id);

//     if (!product) {
//         return next(new ErrorHander("Product not found", 404));
//     }

//     // Images Start Here
//     let images = [];

//     if (typeof req.body.images === "string") {
//         images.push(req.body.images);
//     } else {
//         images = req.body.images;
//     }

//     if (images !== undefined) {
//         // Deleting Images From Cloudinary
//         for (let i = 0; i < product.images.length; i++) {
//             await cloudinary.v2.uploader.destroy(product.images[i].public_id);
//         }

//         const imagesLinks = [];

//         for (let i = 0; i < images.length; i++) {
//             const result = await cloudinary.v2.uploader.upload(images[i], {
//                 folder: "products",
//             });

//             imagesLinks.push({
//                 public_id: result.public_id,
//                 url: result.secure_url,
//             });
//         }

//         req.body.images = imagesLinks;
//     }

//     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//     });

//     res.status(200).json({
//         success: true,
//         product,
//     });
// });

// exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
//     // Check if the ID is a valid MongoDB ObjectID
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//         return next(new ErrorHander("Invalid Product ID", 400));

//     }

//     // Find the product by ID
//     let product = await Product.findById(req.params.id);

    
//     if (!product) {
//         return next(new ErrorHander("Product not found", 404));
//     }

//     // Images handling
//     let images = [];

//     if (req.body.images) {
//         if (typeof req.body.images === "string") {
//             images.push(req.body.images);
//         } else {
//             images = req.body.images;
//         }

//         // If images are provided, delete the old ones and upload the new ones
//         if (images.length > 0) {
//             for (let i = 0; i < product.images.length; i++) {
//                 await cloudinary.v2.uploader.destroy(product.images[i].public_id);
                
//             }

//             const imagesLinks = [];

//             for (let i = 0; i < images.length; i++) {
//                 const result = await cloudinary.v2.uploader.upload(images[i], {
//                     folder: "ecommerce",
//                 });

//                 imagesLinks.push({
//                     public_id: result.public_id,
//                     url: result.secure_url,
//                 });
//             }

//             req.body.images = imagesLinks;
//         }
//     }

//     // Update the product with the new data
//     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
        
//     });

//     res.status(200).json({
//         success: true,
//         product,
        
//     });
// });

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHander("Invalid Product ID", 400));
  }

  // Find the product
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const { name, description, price, category, stock, images } = req.body;

  // Check if images is an array and valid
  if (!Array.isArray(images)) {
    return res.status(400).json({ success: false, message: "Images must be an array." });
  }

  const isValidImages = images.every((img) => img.public_id && img.url);
  if (!isValidImages) {
    return res.status(400).json({ success: false, message: "Each image must have public_id and url." });
  }

  // Update product data
  const updatedData = {
    name,
    description,
    price,
    category,
    stock,
    images, // use the array with public_id and url directly
  };

  product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});


// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product Delete Successfully",
    });
});

// Create New Review or Update the review
// exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
//     const { rating, comment, productId } = req.body;

//     const review = {
//         user: req.user._id,
//         name: req.user.name,
//         rating: Number(rating),
//         comment,
//     };

//     const product = await Product.findById(productId);

//     const isReviewed = product.reviews.find(
//         (rev) => rev.user.toString() === req.user._id.toString()
//     );

//     if (isReviewed) {
//         product.reviews.forEach((rev) => {
//             if (rev.user.toString() === req.user._id.toString())
//                 (rev.rating = rating), (rev.comment = comment);
//         });
//     } else {
//         product.reviews.push(review);
//         product.numOfReviews = product.reviews.length;
//     }

//     let avg = 0;

//     product.reviews.forEach((rev) => {
//         avg += rev.rating;
//     });

//     product.ratings = avg / product.reviews.length;

//     await product.save({ validateBeforeSave: false });

//     res.status(200).json({
//         success: true,
//     });
// });
exports.createProductReview = async (req, res, next) => {
    console.log("REQ.BODY REVIEW:", req.body);

    try {
      const { rating, comment, productId } = req.body;
  
      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      const isReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
  
      if (isReviewed) {
        // Update existing review
        product.reviews.forEach((r) => {
          if (r.user.toString() === req.user._id.toString()) {
            r.rating = rating;
            r.comment = comment;
          }
        });
      } else {
        // Add new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
      }
  
      // Recalculate product ratings
      let avg = 0;
      product.reviews.forEach((r) => {
        avg += r.rating;
      });
  
      product.ratings = avg / product.reviews.length;
  
      await product.save({ validateBeforeSave: false });
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error in createProductReview:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    // Destructure productId and reviewId from the query
    const { productId, id: reviewId } = req.query;

    // Check if productId and reviewId exist in the request
    if (!productId || !reviewId) {
        return next(new ErrorHander("Product ID and Review ID are required", 400));
    }

    // Fetch product by ID
    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    // Check if the product has any reviews
    if (!product.reviews || product.reviews.length === 0) {
        return next(new ErrorHander("No reviews found for this product", 404));
    }

    // Filter out the review to delete
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== reviewId.toString() && rev.comment // Ensure the comment exists
    );

    // Recalculate the average rating
    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    const ratings = reviews.length === 0 ? 0 : avg / reviews.length;
    const numOfReviews = reviews.length;

    // Update the product's reviews, ratings, and numOfReviews
    await Product.findByIdAndUpdate(
        productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    });
});

