import socketio from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);

let messages: any = [];

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

const socketsIO = new socketio.Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});

socketsIO.on("connection", (client: any) => {
  console.log("made socket   connection", client.id);

  messages.map((message: any) => {
    client.emit("message", message);
  });

  client.on("sendMessage", (message: string, name: string) => {
    console.log("client is receiving message ", message);
    messages.push({ message, name });
    const data = {
      message,
      name,
    };
    socketsIO.emit("message", data);
  });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log("listening on port ", port);
});
