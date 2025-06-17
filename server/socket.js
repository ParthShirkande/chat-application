import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server,allowedOrigins) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Map to keep track of connected users: userId -> socketId
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
 
  const sendMessage = async (data) => {
    try {
      const { sender, recipient, messageType, content, fileUrl } = data;

      console.log("Message data:", data);
      if (!sender || !recipient) {
        console.error("Missing sender or recipient in message data.");
        return;
      }

      const newMessage = await Message.create({
        sender,
        recipient,
        messageType,
        content: messageType === "text" ? content : undefined,
        fileUrl: messageType !== "text" ? fileUrl : undefined,
      });

      const populatedMessage = await Message.findById(newMessage._id)
        .populate("sender", "_id email firstName lastName image color")
        .populate("recipient", "_id email firstName lastName image color");

      console.log("Populated message:", populatedMessage);
      
      const recipientSocketId = userSocketMap.get(recipient);
      const senderSocketId = userSocketMap.get(sender);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("ReceiveMessage", populatedMessage);
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("ReceiveMessage", populatedMessage);
      }
    } catch (error) {
      console.error("Error in sendMessage:", error.message);
    }
  };



  const sendChannelMessage = async (data) => {
    try {
      const { sender, recipient, messageType, content, fileUrl, channnelId } = data;

      console.log("Channel message data:", data);
      if (!sender || !recipient) {
        console.error("Missing sender or recipient in channel message data.");
        return;
      }

      const newMessage = await Message.create({
        sender,
        recipient,
        messageType,
        content: messageType === "text" ? content : undefined,
        fileUrl: messageType !== "text" ? fileUrl : undefined,
        channnelId,
      });

      const populatedMessage = await Message.findById(newMessage._id)
        .populate("sender", "_id email firstName lastName image color").exec()

        await Channel.findByIdAndUpdate(channnelId,{
          $push:{messages:newMessage._id},
        })

        const channel=await Channel.findById(channnelId).populate("members")

        const finalData = {...populatedMessage._doc,channelId:channel._id}

        if(channel && channel.members){
          channel.members.forEach((member) => {
            const memberSocketId = userSocketMap.get(member._id.toString());
            if (memberSocketId) {
              io.to(memberSocketId).emit("Receive-Channel-Message", finalData);
            }
          });
          const adminSocketId = userSocketMap.get(channel.admin._id.toString());
          if(adminSocketId){
            io.to(adminSocketId).emit("Receive-Channel-Message", finalData);
          }
        }
              
    } catch (error) {
      console.error("Error in sendChannelMessage:", error.message);
    }
  }




  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`✅ User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.warn("⚠️ UserID not provided during socket connection.");
    }



    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);




    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
