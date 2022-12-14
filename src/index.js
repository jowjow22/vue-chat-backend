"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
let messages = [];
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const socketsIO = new socket_io_1.default.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    allowEIO3: true,
});
socketsIO.on("connection", (client) => {
    console.log("made socket   connection", client.id);
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
const port = 3000;
httpServer.listen(port, () => {
    console.log("listening on port ", port);
});
