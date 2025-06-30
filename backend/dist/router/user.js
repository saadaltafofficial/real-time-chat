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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const schema_1 = require("../models/schema");
const zod_1 = require("zod");
exports.userRoute = (0, express_1.Router)();
exports.userRoute.post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sanatizeUser = zod_1.z.object({
                username: zod_1.z.string().toLowerCase().max(20),
                email: zod_1.z.string().email().max(40),
                password: zod_1.z.string().max(100),
            });
            const parseduser = sanatizeUser.safeParse(req.body);
            console.log(parseduser);
            if (!parseduser.success) {
                res.status(400).json({ error: "Invalid user details" });
                return;
            }
            const { username, email, password } = parseduser.data;
            const findUser = yield schema_1.User.findOne({ username, email });
            if (findUser) {
                res.status(409).send("user already exists");
                return;
            }
            const user = new schema_1.User({ username, email, password });
            yield user.save();
            res.send({
                message: "user created",
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
});
