"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
let messages = [];
const socketsIO = new socket_io_1.default.Server({
    cors: {
        origin: "http://localhost:8080",
        credentials: true,
    },
    allowEIO3: true,
});
socketsIO.on("connection", (client) => {
    console.log("made socket connection", client.id);
    messages.map((message) => {
        client.emit("message", message);
    });
    client.on("sendMessage", (message, name) => {
        console.log("client is receiving message ", message);
        messages.push({ message, name });
        const data = {
            message,
            name,
        };
        socketsIO.emit("message", data);
    });
});
const port = 8000;
socketsIO.listen(port);
console.log("listening on port ", port);
