import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
 
import bcrypt from "bcryptjs"
import {renameSync,unlinkSync} from "fs"

const maxAge = 3 * 24 * 60 * 60 // 3 days in seconds

const createToken = (email,userId) => {
    return jwt.sign({ email,userId }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
}

export const signup = async (req, res,next) => {
    const { email, password} = req.body
    try {
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ 
            message: "Email already registered" 
        });
    }
    const user= await User.create({email,password});
    res.cookie("jwt", createToken(user.email, user._id), {
        secure:true,  
        httpOnly: true,
        maxAge: maxAge * 1000,
        sameSite: "none"
    })
    res.status(201).json({
        success: true,
         user:{
            id:user._id,
            email: user.email,
            profileSetup: user.profileSetup,
        }
    })
        
    } 
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({success: false, message: "Internal server error" })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const auth = await bcrypt.compare(password, user.password);
        if(!auth) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.cookie("jwt", createToken(user.email, user._id), {
            secure:true,  
            httpOnly: true,
            maxAge: maxAge * 1000,
            sameSite: "none"
        })
        res.status(200).json({
            success: true,
             user:{
                id:user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        })
        console.log("Login successful:",user);

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({success: false, message: "Internal server error" })
    }
}



export const getUserInfo = async (req, res) => {
    try{
        console.log(req.userId);
        const userData = await User.findById(req.userId).select("-password")
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ 
                id:userData._id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
        })
    }
    catch(error){
        console.error("User info error:", error);
        res.status(500).json({success: false, message: "Internal server error" })
    }
}


export const updateProfile = async (req, res,next) => {
    try{
        const {userId}=req;
        const {firstName,lastName,color}=req.body
        console.log(firstName,lastName,color)
        if(!firstName || !lastName ){
            return res.status(400).send("Firstname , Lastname and Color is required")
        }
        const userData = await User.findByIdAndUpdate(userId,{
            firstName,lastName,color,profileSetup:true
        },{new:true,runValidators:true})

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ 
                id:userData._id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
        })
    }
    catch(error){
        console.error("User info error:", error);
        res.status(500).json({success: false, message: "Internal server error" })
    }
}





export const addProfileImage = async (req, res,next) => {
    try{
        if(!req.file){
            return res.status(400).send("File is required")
        }
        const date=Date.now()
        let fileName="uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path,fileName);

        const updatedUser = await User.findByIdAndUpdate(
            req.userId, { image: fileName }, { new: true, runValidators: true }
        );
       
        return res.status(200).json({ 
                image: updatedUser.image,
        }) 
    }
    catch(error){
        console.error("User info error:", error);
        res.status(500).json({success: false, message: "Internal server error" })
    }
}





export const removeProfileImage = async (req, res,next) => {
    try{
        const {userId}=req;
        const user=await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(user.image){
            unlinkSync(user.image);
        }
        user.image=null
        await user.save();   
       
        return res.status(200).send("Profile removed successfully")
    }
    catch(error){
        console.error("User info error:", error);
        res.status(500).json({success: false, message: "Internal server error" })
    }
}

export const logOut = async (req, res,next) => {
    try{
        res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"none"})
        res.status(200).send("Logout successful")
    }
    catch(error){
        console.error("User info error:", error);
        res.status(500).json({success: false, message: "Internal server error" })
    }
}