import {Router} from 'express';
import { logOut, signup } from '../controllers/AuthController.js';
import { login } from '../controllers/AuthController.js';
import { getUserInfo } from '../controllers/AuthController.js';
import { updateProfile,addProfileImage,removeProfileImage } from '../controllers/AuthController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

import multer from 'multer';
// multer is a middleware for handling multipart/form-data, primarily used for file uploads in Node.js/Express apps.


const authRoutes= Router();

const upload =multer({dest:"uploads/profiles/"})


authRoutes.post('/signup', signup);
authRoutes.post('/login', login);

authRoutes.get('/userInfo',verifyToken, getUserInfo);

authRoutes.post('/update-profile',verifyToken, updateProfile);

authRoutes.post('/add-profile-image',verifyToken,upload.single("profile-image"), addProfileImage);

authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage)

authRoutes.post("/logout",logOut)
export default authRoutes; 