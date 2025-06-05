import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8000 });

let userCount = 0;
let allSockets: WebSocket[] = [];

wss.on("connection", (socket) => {
    console.log("We are live at port 8000");
    allSockets.push(socket);
    
    userCount += 1;
    console.log(`User connect ${userCount}`);

    socket.on("message", (message) => {
        console.log(`Message recieved from ${userCount} is \"${message.toString()}\"`);
        for(let i=0; i < allSockets.length; i++) {
            allSockets[i].send(`User ${i+1}: ${message.toString()}`);
        }
    })

    socket.on("close", () => {
        userCount -= 1;
        console.log(`User disconnect ${userCount}`);
        console.log(userCount)
    })
})