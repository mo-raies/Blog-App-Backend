
import mongoose, { Schema } from "mongoose";
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema (
  {
    name:{
      type: String,
      required: true,
      // minLength: [4,'Name must contain at least 4 character'],
      // maxlength: [32,'Name cannot exceed 32 character']
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail,"please provide a valid email"]
    },
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      // minLength: [8,'password must contain at least 8 character'],
      // maxlength: [30,'Name cannot exceed 30 character'],
      select: false
    },
    avatar: {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    education: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Reader","Author"]
    }
    },{timestamps:true});

    userSchema.pre('save', async function (next) {
      if (!this.isModified('password')) {
        return next();
      }
      this.password = await bcrypt.hash(this.password, 10);
      next();
    });
    

    userSchema.methods.comparePassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };


    userSchema.methods.getJWTToken = function () {
      return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_EXPIRES,
      });
  };

export const User = mongoose.model("User",userSchema)