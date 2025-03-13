const Blog = require("../models/blogM");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorhandler");

// // Create Product -- Admin
// exports.createBlog = catchAsyncErrors(async (req, res, next) => {
//     let images = [];

//     if (typeof req.body.images === "string") {
//         images.push(req.body.images);
//     } else {
//         images = req.body.images;
//     }

//     const imagesLinks = [];

//     for (let i = 0; i < images.length; i++) {
//         const result = await cloudinary.v2.uploader.upload(images[i], {
//             folder: "blogsImages",
//         });

//         imagesLinks.push({
//             public_id: result.public_id,
//             url: result.secure_url,
//         });
//     }

//     req.body.images = imagesLinks;

//     if (!req.user || !req.user.id) {
//         return next(new Error('User is not authenticated'));
//     }
//     req.body.user = req.user.id;

//     const { title, author_name } = req.body;

//     if (!title || !author_name) {
//         return res.status(400).json({ error: 'Please enter both title and author name' });
//     }


//     const blog = await Blog.create(req.body);

//     res.status(201).json({
//         success: true,
//         blog,
//     });
// });

// exports.createBlog = catchAsyncErrors(async (req, res, next) => {
//     try {
//         let images = req.body.images || []; // Default to empty array if images is undefined

//         if (typeof images === "string") {
//             images = [images]; // Convert string to array if necessary
//         }

//         if (!Array.isArray(images)) {
//             return res.status(400).json({ success: false, message: "Invalid images format" });
//         }

//         if (!images.length) {
//         }

//         const imagesLinks = [];
//         for (let i = 0; i < images.length; i++) {
//             const result = await cloudinary.v2.uploader.upload(images[i], {
//                 folder: "blogsImages",
//             });
//             imagesLinks.push({
//                 public_id: result.public_id,
//                 url: result.secure_url,
//             });
//         }

//         req.body.images = imagesLinks;

//         if (!req.user || !req.user.id) {
//             return next(new ErrorHandler('User is not authenticated', 401));
//         }

//         req.body.user = req.user.id;

//         const { title, author_name } = req.body;
//         if (!title || !author_name) {
//             return res.status(400).json({ error: 'Please enter both title and author name' });
//         }

//         const blog = await Blog.create(req.body);
//         res.status(201).json({ success: true, blog });
//     } catch (error) {
//         console.error('Error creating blog:', error); // Log full error details
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

exports.createBlog = catchAsyncErrors(async (req, res, next) => {
    try {
        let images = req.body.images || [];

        if (typeof images === 'string') {
            images = [images];
        }

        if (!Array.isArray(images)) {
            return res.status(400).json({ success: false, message: 'Invalid images format' });
        }

        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            try {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: 'blogsImages',
                });
                console.log('Cloudinary Upload Result:', result);  // Log result for debugging
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (uploadError) {
                console.error('Error uploading image to Cloudinary:', uploadError);
                return res.status(500).json({ success: false, message: 'Error uploading images' });
            }
        }


        req.body.images = imagesLinks;

        if (!req.user || !req.user.id) {
            return next(new ErrorHandler('User is not authenticated', 401));
        }

        req.body.user = req.user.id;

        const { title, author_name } = req.body;
        if (!title || !author_name) {
            return res.status(400).json({ error: 'Please enter both title and author name' });
        }

        const blog = await Blog.create(req.body);
        res.status(201).json({ success: true, blog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});



// // Get All Product
exports.getAllBlogs = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8;
    const blogsCount = await Blog.countDocuments();

    const apiFeature = new ApiFeatures(Blog.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const blogs = await apiFeature.query;

    // let filteredBlogsCount = blogs.length;
    // apiFeature.pagination(resultPerPage);
    let filteredBlogsCount = await Blog.countDocuments(apiFeature.query._conditions);

    // blogs = await apiFeature.query;


    res.status(200).json({
        success: true,
        blogs,
        blogsCount,
        resultPerPage,
        filteredBlogsCount,
    });
});

// // Get All Product (Admin)
exports.getAdminBlogs = catchAsyncErrors(async (req, res, next) => {
    const blogs = await Blog.find();

    res.status(200).json({
        success: true,
        blogs,
    });
});

// // Get Product Details
exports.getBlogDetails = catchAsyncErrors(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new ErrorHander("No Blog Available", 404));
    }

    res.status(200).json({
        success: true,
        blog,
    });
});

// // Update Product -- Admin

exports.updateBlog = catchAsyncErrors(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new ErrorHander("No Blog Available", 404));
    }

    // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < blog.images.length; i++) {
            await cloudinary.v2.uploader.destroy(blog.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "blogsImages",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        blog,
    });
});

// // Delete Product

exports.deleteBlog = catchAsyncErrors(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new ErrorHander("No Blog Available", 404));
    }

    // Deleting Images From Cloudinary
    for (let i = 0; i < blog.images.length; i++) {
        await cloudinary.v2.uploader.destroy(blog.images[i].public_id);
    }

    await blog.deleteOne();

    res.status(200).json({
        success: true,
        message: "Blog Deleted Successfully",
    });
});

// Create New Review or Update the review
exports.createBlogComment = catchAsyncErrors(async (req, res, next) => {
    const { like, comment, blogId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        like: Number(like),
        comment,
    };

    const blog = await Blog.findById(blogId);

    const isReviewed = blog.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        blog.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.like = like), (rev.comment = comment);
        });
    } else {
        blog.reviews.push(review);
        blog.numOfReviews = blog.reviews.length;
    }

    let avg = 0;

    blog.reviews.forEach((rev) => {
        avg += rev.like;
    });

    blog.likes = avg / blog.reviews.length;

    await blog.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});


// Get All Reviews of a product
exports.getBlogComments = catchAsyncErrors(async (req, res, next) => {
    const blog = await Blog.findById(req.query.id);

    if (!blog) {
        return next(new ErrorHander("No Blog Available", 404));
    }

    res.status(200).json({
        success: true,
        comments: blog.reviews,
    });
});

// Delete Review
exports.deleteComment = catchAsyncErrors(async (req, res, next) => {
    const blog = await Blog.findById(req.query.blogId);

    if (!blog) {
        return next(new ErrorHander("No Blog Available", 404));
    }

    const reviews = blog.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.like;
    });

    let likes = 0;

    if (reviews.length === 0) {
        likes = 0;
    } else {
        likes = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Blog.findByIdAndUpdate(
        req.query.blogId,
        {
            reviews,
            likes,
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
    });
});
