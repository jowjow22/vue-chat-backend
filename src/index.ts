import socket from "socket.io";

let messages: any = [];

const socketsIO = new socket.Server({
  cors: {
    origin: "*",
    credentials: true,
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
