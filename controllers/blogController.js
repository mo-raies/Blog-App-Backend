import mongoose from "mongoose";
import {catchAsyncErrors} from "../middleware/catchAsyncError.js" ;
import errorHandler from "../middleware/error.js" ;
import {Blog} from "../models/blogSchema.js" ;
import cloudinary from "cloudinary" ;


export const blogPost = catchAsyncErrors(async (req, res, next) => {

  // Check if files exist
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorHandler(400, "Blog main image is mandatory!"));
  }

  console.log("reqiest bodyyyyy-----",req.body)
  console.log("reqiest files-----",req.files)

  const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;

  if (!mainImage) {
    return next(new errorHandler(400, "Blog Main image is mandatory!"));
  }

  // Allowed formats
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (
    !allowedFormats.includes(mainImage.mimetype) ||
    (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ||
    (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype)) ||
    (paraThreeImage && !allowedFormats.includes(paraThreeImage.mimetype))
  ) {
    return next(new errorHandler(400, "Invalid file type. Only JPG, PNG, or WebP allowed."));
  }

  // Destructure request body
  const {
    title,
    intro,
    paraOneTitle,
    paraOneDiscription,
    paraTwoTitle,
    paraTwoDiscription,
    paraThreeTitle,
    paraThreeDiscription,
    category,
  } = req.body;

  const createdby = req.user._id;
  const authorName = req.user.name;
  const authorAvatar = req.user.avatar.url;

  if (!intro || !title || !category) {
    return next(new errorHandler(400, "Title, Intro, and Category are required fields!"));
  }

  // Upload images to Cloudinary
  const uploadPromises = [
    cloudinary.uploader.upload(mainImage.tempFilePath),
    paraOneImage ? cloudinary.uploader.upload(paraOneImage.tempFilePath) : Promise.resolve(null),
    paraTwoImage ? cloudinary.uploader.upload(paraTwoImage.tempFilePath) : Promise.resolve(null),
    paraThreeImage ? cloudinary.uploader.upload(paraThreeImage.tempFilePath) : Promise.resolve(null),
  ];

  const [mainImageRes, paraOneImageRes, paraTwoImageRes, paraThreeImageRes] = await Promise.all(uploadPromises);

  if (
    !mainImageRes ||
    mainImageRes.error ||
    (paraOneImage && (!paraOneImageRes || paraOneImageRes.error)) ||
    (paraTwoImage && (!paraTwoImageRes || paraTwoImageRes.error)) ||
    (paraThreeImage && (!paraThreeImageRes || paraThreeImageRes.error))
  ) {
    return next(new errorHandler(500, "Error occurred while uploading one or more images!"));
  }

  // Create blog object
  const blogData = {
    title,
    intro,
    paraOneTitle,
    paraOneDiscription,
    paraTwoTitle,
    paraTwoDiscription,
    paraThreeTitle,
    paraThreeDiscription,
    category,
    createdby,
    authorAvatar,
    authorName,
    mainImage: {
      public_id: mainImageRes.public_id,
      url: mainImageRes.secure_url,
    },
  };

  if (paraOneImageRes) {
    blogData.paraOneImage = {
      public_id: paraOneImageRes.public_id,
      url: paraOneImageRes.secure_url,
    };
  }

  if (paraTwoImageRes) {
    blogData.paraTwoImage = {
      public_id: paraTwoImageRes.public_id,
      url: paraTwoImageRes.secure_url,
    };
  }

  if (paraThreeImageRes) {
    blogData.paraThreeImage = {
      public_id: paraThreeImageRes.public_id,
      url: paraThreeImageRes.secure_url,
    };
  }

  // Save to DB
  const blog = await Blog.create(blogData);

  res.status(200).json({
    success: true,
    message: "Blog uploaded!",
    blog,
  });
});

export const deleteBlog = catchAsyncErrors(async(req,res,next) => {
    
  const {id} = req.params;
  // console.log(req.params)
  const blog = await Blog.findById(id);
  if (!blog) {
    return next( new errorHandler(404,"Blog not found"))
  }
  await blog.deleteOne()
  res.status(200).json({
    success: true,
    message: "Blog deleted!"
  })
})

export const getAllBlogs = catchAsyncErrors(async(req,res,next) => {
const allBlogs =  await Blog.find({published:true})
res.status(200).json({
  success: true,
  allBlogs,
})
})

export const getSingleBlog = catchAsyncErrors(async(req,res,next) => {
  const {id} = req.params;
  const blog =  await Blog.findById(id);
  if(!blog){
    return (new errorHandler(400, "Blog not found!"))
  }
  res.status(200).json({
    success: true,
    blog
  })
})

export const getMyBlog = catchAsyncErrors(async(req,res,next)=> {
  const userId = req.user._id;
    const blogs = await Blog.find({ createdby: new mongoose.Types.ObjectId(userId) });
    res.status(200).json({
        success: true,
        blogs
    })
})

export const updateBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let blog = await Blog.findById(id);
  
  if (!blog) {
    return next(new errorHandler(400, "Blog not found!"));
  }

  const newBlogData = {
    title: req.body.title,
    intro: req.body.intro,
    category: req.body.category,
    paraOneTitle: req.body.paraOneTitle,
    paraOneDescription: req.body.paraOneDescription,
    paraTwoTitle: req.body.paraTwoTitle,
    paraTwoDescription: req.body.paraTwoDescription,
    paraThreeTitle: req.body.paraThreeTitle,
    paraThreeDescription: req.body.paraThreeDescription,
    published: req.body.published,
  };

  if (req.files) {
    const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

    if (
      (mainImage && !allowedFormats.includes(mainImage.mimetype)) ||
      (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ||
      (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype)) ||
      (paraThreeImage && !allowedFormats.includes(paraThreeImage.mimetype))
    ) {
      return next(new errorHandler(400, "Invalid file format. Only PNG, JPEG, and WEBP formats are allowed!"));
    }

    if (mainImage) {
      await cloudinary.uploader.destroy(blog.mainImage.public_id);
      const newBlogMainImage = await cloudinary.uploader.upload(mainImage.tempFilePath);
      newBlogData.mainImage = {
        public_id: newBlogMainImage.public_id,
        url: newBlogMainImage.secure_url,
      };
    }

    if (paraOneImage) {
      if (blog.paraOneImage) {
        await cloudinary.uploader.destroy(blog.paraOneImage.public_id);
      }
      const newBlogParaOneImage = await cloudinary.uploader.upload(paraOneImage.tempFilePath);
      newBlogData.paraOneImage = {
        public_id: newBlogParaOneImage.public_id,
        url: newBlogParaOneImage.secure_url,
      };
    }

    if (paraTwoImage) {
      if (blog.paraTwoImage) {
        await cloudinary.uploader.destroy(blog.paraTwoImage.public_id);
      }
      const newBlogParaTwoImage = await cloudinary.uploader.upload(paraTwoImage.tempFilePath);
      newBlogData.paraTwoImage = {
        public_id: newBlogParaTwoImage.public_id,
        url: newBlogParaTwoImage.secure_url,
      };
    }

    if (paraThreeImage) {
      if (blog.paraThreeImage) {
        await cloudinary.uploader.destroy(blog.paraThreeImage.public_id);
      }
      const newBlogParaThreeImage = await cloudinary.uploader.upload(paraThreeImage.tempFilePath);
      newBlogData.paraThreeImage = {
        public_id: newBlogParaThreeImage.public_id,
        url: newBlogParaThreeImage.secure_url,
      };
    }
  }

  blog = await Blog.findByIdAndUpdate(id, newBlogData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Blog updated!",
    blog,
  });
});
