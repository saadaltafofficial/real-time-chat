import { WebSocketServer, WebSocket } from "ws";

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