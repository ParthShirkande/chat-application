import Channel from "../models/ChannelModel.js";
import User from "../models/userModel.js"
import mongoose from "mongoose";


export const createChannel = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;
        const admin = await User.findById(userId);
        console.log("Admin:", admin);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).json({ success: false, message: "Invalid members" });
        }
        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();
        res.status(201).json({ success: true, message: "Channel created successfully", channel: newChannel });

    }
    catch (error) {
        console.error("User info error:", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getUserChannel = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        console.log("User ID:", userId);
        const channels = await Channel.find({
            $or: [
                { members: userId },
                { admin: userId }
            ]
        }).sort({ updatedAt: -1 });
        console.log("Channels:", channels);
        return res.status(200).json({ success: true, channels });
    }
    catch (error) {
        console.error("User info error:", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}


export const getChannelMessages=async(req,res,next)=>{
    try{
        const {channelId}=req.params
        console.log("prams",req.params)
        const channel = await Channel.findById(channelId).populate({path:"messages",populate:{
            path:"sender",
            select:"firstName lastName email _id image color",
        },
    })
    // if(!channel){return res.status(404).send("channels not found")}

    const messages=channel.messages
    return res.status(200).json({ success: true, messages });
    }catch(error){
    console.error("User info error:", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}