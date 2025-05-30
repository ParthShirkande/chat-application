import Message from "../models/MessagesModel.js"
import {mkdirSync,  renameSync} from "fs"

export const getMessages = async (req, res, next) => {
    try {
        const user1 =req.userId      //comes from auth middleware verifytoken
        const user2 =req.body.id     //comes from post request
        console.log(req)
        console.log("User info:", user1, user2);
      
        if(!user1 || !user2) {
            return res.status(400).json({ success: false, message: "User IDs are required" });
        }   
        
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 }, 
                { sender: user2, recipient: user1 }
            ]
        }).sort({ timestamp: 1 });
        console.log(messages)

        return res.status(200).json({ success: true, messages });
    }

    catch (error) {
        console.error("User info error:", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}




export const uploadFile = async (req, res) => {
    try{
        const file = req.file;
        console.log("File info:", file);
        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        let date=Date.now()
        let fileDir=`uploads/files/${date}`
        let fileName=`${fileDir}/${file.originalname}`
        mkdirSync(fileDir, { recursive: true })
        renameSync(file.path, fileName)
        return res.status(200).json({ success: true, filePath: fileName });
    }
    catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}