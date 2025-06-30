"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const userSchema = new mongoose_2.Schema({
    username: { type: mongoose_2.Schema.Types.String, unique: true },
    email: { type: mongoose_2.Schema.Types.String, unique: true },
    password: { type: mongoose_2.Schema.Types.String },
    socketId: { type: mongoose_2.Schema.Types.String,
        default: function () { return this.username; } },
    createdAt: { type: Date, default: Date.now },
});
const roomSchema = new mongoose_2.Schema({
    name: { type: mongoose_2.Schema.Types.String, unique: true },
    users: [userSchema],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_2.Schema.Types.ObjectId, ref: "User" },
});
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
const Room = mongoose_1.default.model("Room", roomSchema);
exports.Room = Room;
