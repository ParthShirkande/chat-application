import mongoose from "mongoose"
import User from "../models/userModel.js"
import Message from "../models/MessagesModel.js"

export const searchContacts = async (req, res, next) => {
    try {
        const { searchTerm } = req.body
        console.log(searchTerm)
        if (searchTerm == undefined || searchTerm == null) {
            return res.status(400).send("searchTerm is required.")
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*?^{}|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                //"Match documents where _id is not equal to req.userId."
                {
                    $or: [
                        { firstName: { $regex: regex } },
                        { lastName: { $regex: regex } },
                        { email: { $regex: regex } }
                    ]
                }
            ],
        })

        console.log(contacts)
        return res.status(200).json({ contacts });
    }
    catch (error) {
        console.error("User info error:", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}



export const getContactsForDMList = async (req, res, next) => {
    try {

        // console.log(req) 
        let { userId } = req.userId
        userId = new mongoose.Types.ObjectId(String(req.userId));

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: {
                    timestamp: -1,
                },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    firstName: "$userInfo.firstName",
                    lastName: "$userInfo.lastName",
                    email: "$userInfo.email",
                    profilePic: "$userInfo.profilePic",
                    image: "$userInfo.image",
                    color: "$userInfo.color",
                }
                ,
            },
            {
                $sort: { lastMessageTime: -1 },
            }
        ])



        return res.status(200).json({ contacts });
    }
    catch (error) {
        console.error("User info error:", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}






export const getAllContacts = async (req, res, next) => {
    try {
       const users=await User.find({ _id: { $ne: req.userId } },
        "firstName lastName email _id"
       )

       const contacts = users.map((user)=>({
        label:user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
        value:user._id,
       }))
        console.log(contacts)
        return res.status(200).json({ contacts });
    }
    catch (error) {
        console.error("User info error:", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

