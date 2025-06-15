"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8000 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        console.log(`Message recieved  is \"${message.toString()}\"`);
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);
        if (parsedMessage.type === "join") {
            console.log("user joined a room");
            allSockets.push({ socket, room: parsedMessage.payload.roomId });
        }
        if (parsedMessage.type === "chat") {
            console.log("user sent a message");
            const currentUserRoom = (_a = allSockets.find(x => x.socket === socket)) === null || _a === void 0 ? void 0 : _a.room;
            if (currentUserRoom) {
                allSockets.filter(x => x.room === currentUserRoom).forEach(x => x.socket.send(parsedMessage.payload.message));
            }
            else {
                socket.send("You are not in any room");
            }
        }
    });
});
