import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// create express app and http server 

const app = express();
const server = http.createServer(app);

// create socket io server
export const io = new Server(server,{
    cors:{origin:"*"}
});

//store online users
export const userSocketMap = {}; //userId:socketId

//socket connection handler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected",userId);
    if(userId) userSocketMap[userId]=socket.id;

    //Emit online users to all connected client
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    
    socket.on("disconnect",()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

// use express json
app.use(express.json({limit:"4mb"}));


// use cors
app.use(cors());


app.use("/api/status",(req,res)=>{
    res.send("Server is running");
})

//connect to db
await connectDB();

// routes 
app.use("/api/auth", userRouter);
app.use("/api/messages",messageRouter);

// start server
const PORT = process.env.PORT||5004;
server.listen(PORT,()=>{
    console.log(`Server is running on port:${PORT}`);
})