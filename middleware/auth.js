import {catchAsyncErrors} from "../middleware/catchAsyncError.js"
import errorHandler from "../middleware/error.js"
import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken"


//AUTHENTICATION

export const isAuthentication = catchAsyncErrors(async(req,res,next) => {
  const {token} = req.cookies;
  if (!token) {
    return next (new errorHandler (400,"user is not Authenticated"))
  }
  const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id)

  next()
});

//AUTHORIZATION 

export const isAuthorized = (...roles) => {
  return (req,res,next) => {
    console.log("request--user infoo---",req.user)
    if (!roles.includes(req.user.role)) {
      return next( 
        new errorHandler (
          `user with this role(${req.user.role}) not allowed to access this resoures`
      ))
    }
    next();
  }}
