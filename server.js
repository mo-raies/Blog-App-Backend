import app from './app.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
})
// console.log(cloudinary.config())
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});