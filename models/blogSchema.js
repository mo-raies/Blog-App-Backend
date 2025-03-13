import mongoose,{Mongoose, Schema} from "mongoose";

const blogSchema = new Schema (
  {
    title: {
      type: String,
      required: true,
      minLength: [10,"blog must contain at least 10 character"],
      maxlLength: [40,"blog cannot exceed 40 character"]
    },
    mainImage:{
      public_id: {
        type: String,
        required: true
      },
      url:{
        type: String,
        required: true
      }
    },
    intro: {
      type: String,
      required: true,
      minLength: [10,"blog must contain at least 10 character"],
    },
    paraOneImage: {
      public_id: {
        type: String,
      },
      url:{
        type: String,
      }
    },
    paraOneTitle:{
      type: String,
      minlength: [10,"Title must contain at least 10 character"],
    },
    paraOneDiscription: {
      type: String,
      minlength: [10,"Discription must contain at least 10 character"]
    },
    paraTwoImage: {
      public_id: {
        type: String,
      },
      url:{
        type: String,
      }
    },
    paraTwoTitle:{
      type: String,
      minlength: [10,"Title must contain at least 10 character"],
    },
    paraTwoDiscription: {
      type: String,
      minlength: [10,"Discription must contain at least 10 character"]
    },
    paraThreeImage: {
      public_id: {
        type: String,
      },
      url:{
        type: String,
      }
    },
    paraThreeTitle:{
      type: String,
      minLength: [10,"Title must contain at least 10 character"],
    },
    paraThreeDiscription: {
      type: String,
      minLength: [10,"Discription must contain at least 10 character"]
    },
    category: {
      type: String,
      required: true
    },
    createdby: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    authorAvatar: {
      type: String,
      required: true
    },
    published: {
      type: Boolean,
      default: true
    }

    
  },{timestamps: true});

export const Blog = mongoose.model("Blog", blogSchema);

