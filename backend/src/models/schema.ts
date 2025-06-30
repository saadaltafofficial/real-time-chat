import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchema = new Schema({
    username: { type: Schema.Types.String, unique: true },
    email: { type: Schema.Types.String, unique: true },
    password: { type: Schema.Types.String },
    socketId: { type: Schema.Types.String, 
        default: function(this: any){ return this.username;} },
    createdAt: { type: Date, default: Date.now },
});


const roomSchema = new Schema({
    name: { type: Schema.Types.String, unique: true },
    users: [userSchema],
    createdAt: { type: Date, default: Date.now },   
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});


const User = mongoose.model("User", userSchema);
const Room = mongoose.model("Room", roomSchema);

export { User, Room };