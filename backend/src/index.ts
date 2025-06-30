import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import { userRoute } from "./router/user";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";



dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;


const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};



const app = express();
app.use(cors(corsOptions));
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/user", userRoute);


const wss = new WebSocketServer({ port: 8000 });

interface User {
    socket: WebSocket
    room: string
}

let allSockets: User[] = [];

wss.on("connection", (socket ) => {
    
    socket.on("message", (message) => {
        console.log(`Message recieved  is \"${message.toString()}\"`);
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        if(!parsedMessage) {
            return socket.send("Invalid message");
        }
        console.log(parsedMessage);
        
        if (parsedMessage.type === "join") {
            console.log("user joined a room");
            allSockets.push({socket, room: parsedMessage.payload.roomId});
        }
        
        if (parsedMessage.type === "chat") {
            console.log("user sent a message");
            const currentUserRoom = allSockets.find(x => x.socket === socket)?.room;
            if (currentUserRoom) {
                allSockets.filter(x => x.room === currentUserRoom).forEach(x => x.socket.send(parsedMessage.payload.message));
            } else {
                socket.send("You are not in any room");
            }
        }
        
    })
    
})


async function main() {
    try {
        let connection = await mongoose.connect(`${MONGODB_URI}`);
        if (!connection) {
            throw new Error("Failed to connect to database");
        } else {
            console.log("Connected to database");
            
            
        }
        app.listen(7000, () => {
            console.log("Listening on port 7000!");
        })
        
    } catch (error) {
        console.log(error);
    }
    
}(main());