import express from "express";
import { getAllAuthors, getMyProfile, login, logout, register } from "../controllers/userController.js";
import { isAuthentication, } from "../middleware/auth.js";

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.get("/logout",isAuthentication,logout)
router.get("/myprofile", isAuthentication, getMyProfile); // ✅ Fixed route
router.get ("/authors",getAllAuthors)

export default router;