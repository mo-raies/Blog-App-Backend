import express from "express";
import { blogPost, deleteBlog, getAllBlogs, getMyBlog, getSingleBlog, updateBlog ,} from "../controllers/blogController.js";
import {isAuthentication,isAuthorized} from "../middleware/auth.js";

const router = express.Router();

router.post("/blog",isAuthentication,isAuthorized("Author"),blogPost);

router.delete("/blog/:id", deleteBlog);
router.post("/create", isAuthentication, isAuthorized("Author"), blogPost);
router.get("/blog/all",getAllBlogs);
router.get("/singleBlog/:id", isAuthentication,getSingleBlog);
router.get("/myBlog",isAuthentication,isAuthorized("Author"), getMyBlog);
router.put("/update/:id",isAuthentication,isAuthorized("Author"), updateBlog);

export default router ;