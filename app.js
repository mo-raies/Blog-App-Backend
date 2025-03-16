import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';
import {Dbconnection} from "./Database/Dbconnection.js"
import { ErrorMiddleware } from './middleware/error.js';
import userRouter from './Routers/userRouter.js';
import blogRouter from './Routers/blogRouter.js';
import fileUpload from 'express-fileupload';

const app = express();

dotenv.config({path:'./config/config.env'});

app.use(
  cors({
    origin: ["*"],
    methods: ["GET","PUT","DELETE","POST"],
    credentials: true,
})
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended:true }))

app.use(
  fileUpload ({
    useTempFiles:true,
    tempFileDir: "/temp/"
}))

app.use("/api/v1",userRouter);
app.use("/api/v1",blogRouter);

Dbconnection();

app.use(ErrorMiddleware);

export default app;

