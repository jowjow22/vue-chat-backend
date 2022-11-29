import socketio from "socket.io";
import { createServer } from "http";

const socket = createServer();

let messages: any = [];

const socketsIO = new socketio.Server(socket, {
  cors: {
    origin: "*",
    credentials: true,
    allowedHeaders: ["my-custom-header"],
    methods: ["GET", "POST"],
  },

  allowEIO3: true,
});

socketsIO.on("connection", (client: any) => {
  console.log("made socket connection", client.id);

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

const port = 8000;
socketsIO.listen(port);
console.log("listening on port ", port);
