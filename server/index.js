import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import contactRoutes from './routes/ContactRoutes.js'
import messagesRoutes from './routes/MessageRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';


import setupSocket from './socket.js';


dotenv.config();
//all environment variables are stored in .env file i.e process.env

const app = express();
app.use(express.json()); 
// create express app

const PORT = process.env.PORT || 5000;

const databaseURL = process.env.DATABASE_URL;

// cors is a middleware that allows cross-origin requests it is used to allow requests from different origins
const allowedOrigins = [process.env.ORIGIN];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));





app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use("/uploads/files",express.static("uploads/files"))




app.use(cookieParser());
// parse cookies from the request
console.log("Registering /api/auth");
app.use("/api/auth", authRoutes);

console.log("Registering /api/contacts");
app.use("/api/contacts", contactRoutes);

console.log("Registering /api/messages");
app.use("/api/messages", messagesRoutes);

console.log("Registering /api/channel");
app.use("/api/channel", channelRoutes);


const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



setupSocket(server);

mongoose.connect(databaseURL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
