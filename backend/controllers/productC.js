
const streamifier = require('streamifier'); // Make sure to require this at top if not already
const Product = require("../models/productM");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const mongoose = require('mongoose');
const axios = require("axios");
const { calculateEcoMetrics } = require("../utils/ecoUtils");
const User = require("../models/userM");

// trying now creating product
// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//   const {
//     name,
//     description,
//     price,
//     category,
//     stock,
//     images,
//     isEcoCertified,
//     materialType,
//     weightInGrams,
//     shippingDistanceKm,
//   } = req.body;

//   // ✅ Validate images
//   if (!Array.isArray(images)) {
//     return res.status(400).json({ success: false, message: "Images must be an array." });
//   }

//   const isValidImages = images.every((img) => img.public_id && img.url);
//   if (!isValidImages) {
//     return res.status(400).json({ success: false, message: "Each image must have public_id and url." });
//   }

//   // ✅ Inline carbon calculation function
//   const getCarbonFootprint = async (weight, distance) => {
//     const response = await axios.post(
//       "https://www.carboninterface.com/api/v1/estimates",
//       {
//         type: "shipping",
//         weight_value: weight,
//         weight_unit: "g",
//         distance_value: distance,
//         distance_unit: "km",
//         transport_method: "truck",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.CARBON_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data.data.attributes.carbon_kg * 1000; // convert kg to grams
//   };

//   // ✅ Eco score logic
//   const computeEcoScore = ({ isEcoCertified, materialType, weightInGrams, shippingDistanceKm }) => {
//     let score = 0;

//     // Certification bonus
//     if (isEcoCertified) score += 25;

//     // Material-based score
//     const materialScores = {
//       bamboo: 25,
//       recycled: 20,
//       cotton: 15,
//       plastic: 5,
//       default: 10,
//     };
//     score += materialScores[materialType?.toLowerCase()] || materialScores.default;

//     // Weight-based score
//     if (weightInGrams <= 500) score += 20;
//     else if (weightInGrams <= 1000) score += 10;

//     // Shipping distance
//     if (shippingDistanceKm <= 1000) score += 20;
//     else if (shippingDistanceKm <= 2000) score += 10;

//     return Math.min(score, 100);
//   };

//   // ✅ Default values
//   let traditionalFootprint = 0;
//   let ecoFootprint = 0;
//   let carbonSaved = 0;
//   let ecoScore = 0;

//   try {
//     if (weightInGrams && shippingDistanceKm) {
//       traditionalFootprint = await getCarbonFootprint(weightInGrams, shippingDistanceKm);

//       if (isEcoCertified) {
//         ecoFootprint = traditionalFootprint * 0.7; // 30% less for eco products
//       } else {
//         ecoFootprint = traditionalFootprint;
//       }

//       carbonSaved = traditionalFootprint - ecoFootprint;

//       // Calculate eco score only if enough data
//       ecoScore = computeEcoScore({
//         isEcoCertified,
//         materialType,
//         weightInGrams,
//         shippingDistanceKm,
//       });
//     }
//   } catch (error) {
//     console.error("Carbon API Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Carbon footprint calculation failed.",
//     });
//   }

//   // ✅ Create product with carbon + ecoScore
//   const product = await Product.create({
//     name,
//     description,
//     price,
//     category,
//     stock,
//     images,
//     user: req.user._id,
//     isEcoCertified,
//     materialType,
//     weightInGrams,
//     shippingDistanceKm,
//     traditionalFootprint,
//     ecoFootprint,
//     carbonSaved,
//     ecoScore,
//   });

//   res.status(201).json({
//     success: true,
//     product,
//   });
// });
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const {
    name, description, price, category, stock, images,
    isEcoCertified, materialType, weightInGrams, shippingDistanceKm
  } = req.body;

  if (!Array.isArray(images)) {
    return res.status(400).json({ success: false, message: "Images must be an array." });
  }

  const isValidImages = images.every((img) => img.public_id && img.url);
  if (!isValidImages) {
    return res.status(400).json({ success: false, message: "Each image must have public_id and url." });
  }

  let traditionalFootprint = 0;
  let ecoFootprint = 0;
  let carbonSaved = 0;
  let ecoScore = 0;

  if (weightInGrams && shippingDistanceKm) {
    try {
      const ecoData = await calculateEcoMetrics({
        isEcoCertified,
        materialType,
        weightInGrams,
        shippingDistanceKm,
      });

      traditionalFootprint = ecoData.traditionalFootprint;
      ecoFootprint = ecoData.ecoFootprint;
      carbonSaved = ecoData.carbonSaved;
      ecoScore = ecoData.ecoScore;
    } catch (error) {
      console.error("Carbon API Error:", error);
      return res.status(500).json({ success: false, message: "Carbon footprint calculation failed." });
    }
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images,
    user: req.user._id,
    isEcoCertified,
    materialType,
    weightInGrams,
    shippingDistanceKm,
    traditionalFootprint,
    ecoFootprint,
    carbonSaved,
    ecoScore,
  });

  res.status(201).json({ success: true, product });
});

// 1. Total carbon saved + eco stats
exports.getEcoSummary = async (req, res) => {
  const products = await Product.find();

  const totalCarbonSaved = products.reduce((acc, p) => acc + (p.carbonSaved || 0), 0);
  const ecoProducts = products.filter(p => p.isEcoCertified);
  const nonEcoProducts = products.length - ecoProducts.length;

  res.status(200).json({
    success: true,
    totalCarbonSaved,
    ecoCount: ecoProducts.length,
    nonEcoCount: nonEcoProducts,
  });
};

// 2. Top 5 eco products
exports.getTopEcoProducts = async (req, res) => {
  const products = await Product.find({ isEcoCertified: true })
    .sort({ carbonSaved: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    products,
  });
};

// 3. Monthly Carbon Saved (based on createdAt)
exports.getMonthlyCarbonData = async (req, res) => {
  const products = await Product.find({ isEcoCertified: true });

  const monthlyData = {};

  products.forEach((product) => {
    const date = new Date(product.createdAt);
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });

    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }

    monthlyData[month] += product.carbonSaved || 0;
  });

  const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));

  const carbonSaved = sortedMonths.map((month) => ({
    month,
    carbonSaved: parseFloat(monthlyData[month].toFixed(2)),
  }));

  res.status(200).json({
    success: true,
    carbonSaved,
  });
};

// Get Eco-Friendly Recommendations
// exports.getEcoRecommendations = catchAsyncErrors(async (req, res, next) => {
//   const currentProduct = await Product.findById(req.params.id);

//   if (!currentProduct) {
//     return res.status(404).json({ success: false, message: "Product not found" });
//   }

//   const recommendations = await Product.find({
//     _id: { $ne: req.params.id },
//     category: currentProduct.category,
//     isEcoCertified: true,
//   })
//     .sort({ carbonSaved: -1 }) // You can change this to ecoScore if you add that field
//     .limit(4);

//   res.status(200).json({
//     success: true,
//     recommendations,
//   });
// });

exports.getEcoRecommendations = catchAsyncErrors(async (req, res, next) => {
  const currentProduct = await Product.findById(req.params.id);

  if (!currentProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const recommendations = await Product.find({
    _id: { $ne: currentProduct._id },
    category: currentProduct.category,
    isEcoCertified: true,
  })
    .sort({ carbonSaved: -1 })
    .limit(4); // Limit to top 4

  res.status(200).json({
    success: true,
    recommendations,
  });
});

// Create Product -- Admin
// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//   const { name, description, price, category, stock, images } = req.body;

//   // Check if images is an array and each image has public_id and url
//   if (!Array.isArray(images)) {
//     return res.status(400).json({ success: false, message: "Images must be an array." });
//   }

//   const isValidImages = images.every((img) => img.public_id && img.url);
//   if (!isValidImages) {
//     return res.status(400).json({ success: false, message: "Each image must have public_id and url." });
//   }

//   const product = await Product.create({
//     name,
//     description,
//     price,
//     category,
//     stock,
//     images, // Array of { public_id, url }
//     user: req.user._id,
//   });

//   res.status(201).json({
//     success: true,
//     product,
//   });
// });
// above one final one

exports.updateMissingEcoScores = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({
    ecoScore: { $in: [null, 0] },
    weightInGrams: { $exists: true },
    shippingDistanceKm: { $exists: true },
  });

  const computeEcoScore = ({ isEcoCertified, materialType, weightInGrams, shippingDistanceKm }) => {
    let score = 0;
    if (isEcoCertified) score += 25;

    const materialScores = {
      bamboo: 25,
      recycled: 20,
      cotton: 15,
      plastic: 5,
      default: 10,
    };

    score += materialScores[materialType?.toLowerCase()] || materialScores.default;
    if (weightInGrams <= 500) score += 20;
    else if (weightInGrams <= 1000) score += 10;
    if (shippingDistanceKm <= 1000) score += 20;
    else if (shippingDistanceKm <= 2000) score += 10;

    return Math.min(score, 100);
  };

  let updatedCount = 0;

  for (let product of products) {
    const newScore = computeEcoScore(product);
    product.ecoScore = newScore;
    await product.save({ validateBeforeSave: false });
    updatedCount++;
  }

  res.status(200).json({
    success: true,
    message: `Eco Scores updated for ${updatedCount} products.`,
  });
});

exports.getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 10;

    // Total count of products before filters
    const productsCount = await Product.countDocuments();

    // Create API Feature utility and apply search + filter
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();

    // Get filtered products count BEFORE pagination
    const filteredProducts = await apiFeature.query.clone();
    const filteredProductsCount = filteredProducts.length;

    // Apply pagination now
    apiFeature.pagination(resultPerPage);

    const products = await apiFeature.query;

    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
//   // Check if the ID is valid
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return next(new ErrorHander("Invalid Product ID", 400));
//   }

//   // Find the product
//   let product = await Product.findById(req.params.id);

//   if (!product) {
//     return next(new ErrorHander("Product not found", 404));
//   }

//   const { name, description, price, category, stock, images } = req.body;

//   // Check if images is an array and valid
//   if (!Array.isArray(images)) {
//     return res.status(400).json({ success: false, message: "Images must be an array." });
//   }

//   const isValidImages = images.every((img) => img.public_id && img.url);
//   if (!isValidImages) {
//     return res.status(400).json({ success: false, message: "Each image must have public_id and url." });
//   }

//   // Update product data
//   const updatedData = {
//     name,
//     description,
//     price,
//     category,
//     stock,
//     images, // use the array with public_id and url directly
//   };

//   product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//     product,
//   });
// });
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHander("Invalid Product ID", 400));
  }

  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const {
    name,
    description,
    price,
    category,
    stock,
    images,
    isEcoCertified,
    materialType,
    weightInGrams,
    shippingDistanceKm,
  } = req.body;

  if (!Array.isArray(images)) {
    return res.status(400).json({ success: false, message: "Images must be an array." });
  }

  const isValidImages = images.every((img) => img.public_id && img.url);
  if (!isValidImages) {
    return res.status(400).json({ success: false, message: "Each image must have public_id and url." });
  }

  const updatedData = {
    name,
    description,
    price,
    category,
    stock,
    images,
    isEcoCertified,
    materialType,
    weightInGrams,
    shippingDistanceKm,
  };

  // If eco-related fields exist, recalculate metrics
  if (weightInGrams && shippingDistanceKm) {
    try {
      const ecoData = await calculateEcoMetrics({
        isEcoCertified,
        materialType,
        weightInGrams,
        shippingDistanceKm,
      });

      updatedData.traditionalFootprint = ecoData.traditionalFootprint;
      updatedData.ecoFootprint = ecoData.ecoFootprint;
      updatedData.carbonSaved = ecoData.carbonSaved;
      updatedData.ecoScore = ecoData.ecoScore;
    } catch (error) {
      console.error("Carbon API Error (update):", error.message);
      return res.status(500).json({ success: false, message: "Carbon footprint update failed." });
    }
  }

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
exports.createProductReview = async (req, res, next) => {
    // console.log("REQ.BODY REVIEW:", req.body);

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
// exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
//     const product = await Product.findById(req.query.id);

//     if (!product) {
//         return next(new ErrorHander("Product not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         reviews: product.reviews,
//     });
// });

// exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
// const product = await Product.findById(req.query.id).populate("reviews.user", "name avatar");
//   if (!product) {
//     return next(new ErrorHander("Product not found", 404));
//   }

//   res.status(200).json({
//     success: true,
//     reviews: product.reviews,
//   });
// console.log("Returning Reviews: ", JSON.stringify(product.reviews, null, 2));
// });
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Manually populate user data for each review
  const reviewsWithUser = await Promise.all(
    product.reviews.map(async (review) => {
      const user = await User.findById(review.user).select("name avatar");
      return {
        ...review.toObject(), // Convert Mongoose subdoc to plain JS object
        user, // attach full user object
      };
    })
  );
productListContainer("Populated Reviews:", JSON.stringify(reviewsWithUser, null, 2));

  res.status(200).json({
    success: true,
    reviews: reviewsWithUser,
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

