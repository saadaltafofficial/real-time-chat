"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const user_1 = require("./router/user");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI;
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/user", user_1.userRoute);
const wss = new ws_1.WebSocketServer({ port: 8000 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        console.log(`Message recieved  is \"${message.toString()}\"`);
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        if (!parsedMessage) {
            return socket.send("Invalid message");
        }
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let connection = yield mongoose_1.default.connect(`${MONGODB_URI}`);
            if (!connection) {
                throw new Error("Failed to connect to database");
            }
            else {
                console.log("Connected to database");
            }
            app.listen(7000, () => {
                console.log("Listening on port 7000!");
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
(main());
