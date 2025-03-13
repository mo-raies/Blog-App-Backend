import {catchAsyncErrors} from "../middleware/catchAsyncError.js";
import errorHandler from "../middleware/error.js";
import {User} from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

  export const register = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
      return next(new errorHandler(400, "User avatar is required"));
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedFormats.includes(avatar.mimetype)) {
      return next(new errorHandler(400, "Invalid file type. Please upload an avatar in PNG, JPEG, or WEBP format."));
  }

  const { name, email, password, phone, role, education } = req.body;

  if (!name || !email || !password || !phone || !role || !education || !avatar) {
      return next(new errorHandler(400, "Please fill all fields"));
  }

  let user = await User.findOne({ email });
  if (user) {
      return next(new errorHandler(400, "User already exists"));
  }

  // Upload to Cloudinary
  try {
      const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath);

      if (!cloudinaryResponse || cloudinaryResponse.error) {
          return next(new errorHandler(500, cloudinaryResponse.error?.message || "Cloudinary upload failed"));
      }

      user = await User.create({
          name,
          email,
          password,
          phone,
          role,
          education,
          avatar: {
              public_id: cloudinaryResponse.public_id,
              url: cloudinaryResponse.secure_url
          }
      });

      sendToken(user, 200, "User registered successfully", res);
  } catch (error) {
      return next(new errorHandler(500, error.message || "An error occurred"));
  }
};

  export const login = catchAsyncErrors(async(req,res,next)=> {
    const {email,password,role} = req.body
    if(!email || !password || !role){
      return next(new errorHandler(400, "Please fill full form"))
    }
    let user = await User.findOne({email}).select("+password")
    if (!user) {
      return next (new errorHandler(400, "user not found"))
    }
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
      return next (new errorHandler(400,"Invalid email or password"))
    }
    if (user.role !== role){
      return next (new errorHandler(400,`User with provided role(${role})not found`))
    };
    sendToken(user,200,"user logged in successfully", res)
    // res.status(200).json({
    //   success: true,
    //   message: "user logged In"
    // });
  })


  export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()), // `expired` ko `expires` se replace kiya
        httpOnly: true, // Cookie ko HTTP-only rakha
      })
      .json({
        success: true,
        message: "User logged out!",
      });
  });

  export const getMyProfile = catchAsyncErrors(async( req, res, next) => {
    const user = req.user
    console.log("req.user :", req.user)
    res.status(200).json({
      success: true,
      user,
    });
  })
  

  export const getAllAuthors = catchAsyncErrors (async (req , res, next) => {
  const authors =  await User.find({role: "Author"})
  res.status(200).json({
    success: true,
    authors,
  })
  
  })